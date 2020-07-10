const express = require('express');
const router = express.Router();
const axios = require('axios')

const GameAnswer = require('../models/GameAnswer')
const GameState = require('../models/GameState')

/*
  WORK IN PROGRESS!!

  Here is an example of an app for managing a multiperson game
  similar to JackBox where one user shares their screen in Zoom, 
  and all players connect to the server using their phones.
  
  The idea is that a loggedIn user goes to startGame and
  this creates a new game object in the Game database
  Game Schema ...
     {gamePIN:String,state:???}
  
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
  in the GameAnswer database with the gamePIN and the username.
     {gamePIN:String, username:String, answer:String}
  The users can update their answer at any time and it appear on the main screen. 
  
*/

const loggedIn = (req,res,next) => {
  if (res.locals.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/startGame', 
  loggedIn,
  (req,res,next) => {res.render('gameStart')})

router.post('/startGame', 
  loggedIn,
  async (req,res,next) => {
    try{
      const gamePIN = Math.round(10000000*Math.random())
      const gameState = 
            new GameState(
              {gamePIN:gamePIN,
               status:'start',
               state:'start',
               stage:0,
               owner:res.locals.user.email,
              })
      res.redirect('gameScreen/'+gamePIN)
    } catch(error){next(error)}
})


router.get('/gameScreen/:gamePIN', loggedIn,
  async (req,res,next) => {
    try {
      const gamePIN = req.params.gamePIN
      res.locals.gamePIN = gamePIN
      res.locals.state = await GameState.find({gamePIN:gamePIN})
      res.locals.answers = await GameAnswer.find({gamePIN:gamePIN})
      res.render('gameScreen')
    } catch(error) { next(error)}
})

router.get('/playGame', loggedIn,
           (req,res,next) => {res.render('gameJoin')})

router.post('/playingGame', loggedIn,
  async (req,res,next) => {
    try {
      const gamePIN = req.body.gamePIN
      res.locals.gamePIN = gamePIN
      const gameState = await GameState.findOne({gamePIN:gamePIN})
      res.locals.isAdmin = (gameState.email == res.locals.user.email)
      const answer = req.body.answer || "hello again"
      console.log(`in playingGame ${gamePIN} ${answer} ${res.locals.username}`)
      let gameAnswer = 
             await GameAnswer.findOne(
               {gamePIN:gamePIN, 
                username:res.locals.username})
      if (gameAnswer){
        console.log("found an answer ...")
        //console.dir(gameAnswer)
        gameAnswer.answer = answer
        await gameAnswer.save()
        //console.dir(gameAnswer)
      } else {
        //console.log("didn't find any answers")
        gameAnswer = new GameAnswer(
          {username:res.locals.username,
           gamePIN:gamePIN,
           answer:answer})
        await gameAnswer.save()
        //console.log("created a new GameAnswer object")
      }
      
      res.render('gamePlaying')
      
    } catch(error){
        console.log("whoops!! an error in gamePlaying")
        next(error)
    }
})

router.post('/playingGame/:gamePIN', loggedIn,
  async (req,res,next) => {
    try{
      const gamePIN = req.params.gamePIN
      res.send("work in progress")
    } catch(error){next(error)}
})

router.get("/endGame/:gamePin", loggedIn,
  async (req,res,next) => {
    try{
      const gamePIN = req.params.gamePIN
      await GameAnswer.deleteMany({gamePIN:gamePIN})
      res.redirect('/startGame')
    } catch(error){next(error)}
})

router.get("/showGameAnswers",
  async (req,res,next) => {
    try {
      const answers = await GameAnswer.find()
      res.json(answers)
    } catch(error) { next(error)}
})

router.get("/showGameStates",
  async (req,res,next) => {
    try {
      const results = await GameState.find()
      res.json(results)
    } catch(error) { next(error)}
})

// CODE for Mafia game ....
/*
router.get('/startGame', (req,res) => {
  res.render("startGame") // form to get gamename and list of users ...
})

let games = [
  {roomname:"789sdfs",
   members:"tim david sean",
   mafia:"tim",
   detective:"david",
   dead:[],
   revealed:[],
   time:'daytime',
   daylength:300,
  }
]
router.post('/createGame', (req,res) => {
  const gameInfo = req.body
  games = games.concat(gameInfo)
  res.locals.games = games
  res.json(games)
  //res.render('showGames')
})
*/

module.exports = router