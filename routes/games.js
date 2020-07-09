const express = require('express');
const router = express.Router();
const axios = require('axios')

/*
  Here is an example of an app for managing a multiperson game
  The idea is that a logged in user goes to startGame and
  this creates a new game object in the Game database
  This object has a gamePIN which the other players will type in
  when they visit "/playGame"
  
  When they visit playGame and enter in the gamePIN it sends them to
  a site "/playingGame" which re
  
*/
router.get('/startGame',(req,res,next) => {res.render('startGame')})

router.post('/startGame',
  async (req,res,next) => {
    try{
      res.send("work in progress")
    } catch(error){next(error)}
})

module.exports = router