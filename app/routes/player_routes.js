// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Player = require('../models/player')

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

    // create player
router.post('/players', requireToken, (req, res, next) => {
    // request data and store body in var
    const playerData = req.body.player 
    // store user id to owner
    playerData.owner = req.user._id
    // create doc for player 
    Player.create(playerData)
    // then send response status and data as json
        .then(player => {
            res.status(201).json(player)
           
        })
         // save player data
         playerData.save()
        // catch error and send message back to client
        .catch(next)
})
    // index player
router.get('/players', requireToken, (req, res, next) => {
       // store user id to var
       const userId = req.user._id
       // find all players
       Player.find({ owner: userId })
      
       .then(player => res.json(player))
       .catch(next)
})

router.delete('/players/:id', requireToken, (req, res, next) => {
    Player.findById(req.params.id)
    .then(handle404)
    .then(player => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, player)
      // delete the example ONLY IF the above didn't throw
      player.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)

})


module.exports = router