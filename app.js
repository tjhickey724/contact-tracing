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
//const auth = require('./routes/auth')
const auth = require('./routes/googleAuth')
app.use(auth)


const Contact = require("./models/Contact")

app.get("/", 
 isLoggedIn,
  async (req,res,next) => {
    try {
      res.locals.contacts = await Contact.find({userId:res.locals.user._id})
      res.render('index')   
    } catch(error) {next(error)}
})

app.post('/addContact',
  isLoggedIn,
  async (req,res,next) => {
    try {
      const contact = new Contact(
         {when: new Date(),
          where: req.body.where,
          howLong: req.body.howLong,
          description: req.body.description,
          who: req.body.who,
          userId: res.locals.user._id
         })
      await contact.save()
      res.redirect('/')   
    } catch(error) {next(error)}
})

const User = require('./models/User')

app.get('/profile',
 isLoggedIn,
  async (req,res,next) => {
    try {
      res.locals.user = await User.findOne({_id:res.locals.user._id})

      res.render("profile")   
    } catch(error) {next(error)}
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
