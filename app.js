/*
  app.js -- This creates an Express webserver
*/

// First we load in all of the packages we need for the server...
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const debug = require("debug")("personalapp:server");



// connect to a database
const mongoose = require( 'mongoose' );
const mongodb_URI = process.env.MONGODB_URI // was 'mongodb://localhost/hsad'
mongoose.connect( mongodb_URI, { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});

const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

// Now we create the server
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbyanana789sdfa",
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.urlencoded({ extended: false }));


// here we handle some routes in their own routing file
// this keeps the main app.js more organized ...
const auth = require('./routes/auth')
app.use(auth)

const recipes = require('./routes/recipes')
app.use(recipes)

const games = require('./routes/games')
app.use(games)



app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/time", (req,res,next) => {
  res.send("The time is now!")
})

app.get("/gohome", (req,res,next) => {
  res.redirect('/')
})

app.get("/jtime", (req,res,next) => {
  const now = new Date()
  res.json(now)
})

app.get("/aboutPage", (req,res,next) => {
  res.render("about")
})

app.get("/greeting/:name", (req,res,next) => {
  const nombre = req.params.name
  res.send("hello "+nombre)
})

app.get("/testing/:year", (req,res,next) => {
  const yearNumber = req.params.year
  res.send(yearNumber + " was a memorable year!")
})

app.get("/bio/tim", (req,res,next) => {
  res.render("tim")
})




app.get("/demo", (request, response) => {
  response.locals.message = "Welcome to the Demo page. I am a message!"
  response.locals.magicNumber = 24
  
  response.render("demo");
});

let forumPosts = [ 
  {topic:'school',message:'working on project',username:'tim',date:new Date()},
  {topic:'home',message:'better sleep well tonight',username:'tim',date:new Date()}
]
/*
app.get('/forum', (req,res) => {
  res.locals.posts = forumPosts.reverse()
  res.render('forum')
})

app.post("/addToForum", (req,res) => {
  req.body.date = new Date()
  req.body.username = res.locals.username
  forumPosts = forumPosts.concat(req.body)
  res.redirect('/forum')
  //res.json(forumPosts)
})
*/

const ForumPost = require("./models/ForumPost")

app.get('/forum', 
  async (req,res,next) => {
   try{
      res.locals.posts = await ForumPost.find().sort({date:-1}).limit(5)
      res.render('forum')   
   } catch(error) {next(error)}
})

app.post("/addToForum", 
  isLoggedIn,
  async (req,res,next) => {
    try{
        const forumPost = 
        new ForumPost(
          {topic:req.body.topic,
           message: req.body.message,
           author: res.locals.username || "anonymous",
           authorId: res.locals.user._id,
           date: new Date()})
        await forumPost.save()
        res.redirect('/forum')     
    }catch(error){next(error)}
})

app.get("/deleteForumPost/:postId", 
 isLoggedIn,
  async (req,res,next) => {
    try{
        const postId = req.params.postId
        await forumPost.deleteOne({_id:postId}
        res.redirect('/forum')     
    }catch(error){next(error)}
})



const User = require('./models/User')

app.get('/showUsers.json', 
  async (req,res,next) => {
    try{
      const users = await User.find() // finds list of all users
      res.json(users)
    } catch(error){
      next(error)
    }
})

app.get('/showUsers', 
  async (req,res,next) => {
    try{
      res.locals.users = await User.find() // finds list of all users
      res.render('showUsers')
    } catch(error){
      next(error)
    }
})

app.get('/showUser/:userId', 
  async (req,res,next) => {
    try{
      const userId = req.params.userId
      res.locals.theUser = await User.findOne({_id:userId}) // find one user
      res.json(res.locals.theUser)
      //res.render('showUser')
    } catch(error){
      next(error)
    }
})




app.get("/about", (req, res) => {
  res.render("about");
});


app.get('/showformdata', (request,response) => {
  const data = request.body
  response.json(data)
})



// Don't change anything below here ...

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Here we set the port to use
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
