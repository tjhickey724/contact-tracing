const express = require('express');
const router = express.Router();
const axios = require('axios')

/*
  WORK IN PROGRESS!!

  Here is an example of an app for managing a multiperson game
  similar to JackBox where one user shares their screen in Zoom, 
  and all players connect to the server using their phones.
  
  The idea is that a loggedIn user goes to startGame and
  this creates a new game object in the Game database
     {gamePIN:String,state:Mixed}
  
  This object has a gamePIN which the other players will type in
  when they visit "/playGame"
  
  The game owner is sent to a "/gameScreen/gamePIN"  which shows the current
  state of the game and refreshes every 10 seconds.  
  
  As players join their usernames appear on the main screen... 
  As they type answers, the answers appear on the main screen.  
  The gameScreen route could pick winners, keep score, etc.
  
  When they visit playGame and enter in the gamePIN it sends them to
  a site "/playingGame/gamePIN"
  
  This has a form which allows them to type in a string which gets stored
  in the Answer database with the gamePIN and the username.
  
*/
router.get('/startGame',(req,res,next) => {res.render('startGame')})

router.post('/startGame',
  async (req,res,next) => {
    try{
      res.send("work in progress")
    } catch(error){next(error)}
})

router.get('/gameScreen/:gamePIN',
  async (req,res,next) => {
    try {
      const gamePIN = req.params.gamePIN
      res.render('gameScreen')
    } catch(error) { next(error)}
})

router.get('/playGame',(req,res,next) => {res.render('playGame')})

router.get('/playingGame/:gamePIN',
  async (req,res,next) => {
    try {
      const gamePIN = req.params.gamePIN
      res.render('playingGame')
    } catch(error){next(error)}
})

router.post('/playingGame/:gamePIN',
  async (req,res,next) => {
    try{
      const gamePIN = req.params.gamePIN
      res.send("work in progress")
    } catch(error){next(error)}
})

module.exports = router