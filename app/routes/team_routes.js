// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Team = require('../models/team')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Create a Team
router.post('/teams', requireToken, (req, res, next) => {
    // request data from client and store to var
    const teamData = req.body.team
    // request id from user object and set to owner
    teamData.owner = req.user._id
    // save the data in the db using Team.create
    Team.create(teamData)
        .then((team) => {
            res.status(201).json(team)
            teamData.save()
        })
        .catch(next)

})
router.patch('/teams/:id', requireToken, (req, res, next) => {
    // remove owner from incoming data
    delete req.body.teams.owner
    const id = req.params.id
    // locate team
    Team.findById(id)
    // if no doc is found in team will send error
    .then(handle404)
    // check for ownership and require
    .then(team => requireOwnership(team, req.user))
    
    .then(team => team.updateOne(req.body.team))

    .then(() => res.sendStatus(204))

    .catch(next)
})
// index teams
router.get('/teams', requireToken, (req, res, next) => {
    // store user id to var
    const userId = req.user._id
    // find all teams that owner owns
    Team.find({ owner: userId })
    .then(team => res.json(team))
    .catch(next)
})

module.exports = router