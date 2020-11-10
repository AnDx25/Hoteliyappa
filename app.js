require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose=require('mongoose')

var indexRouter = require('./routes/index');

//For sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**For Flash messages */

const flash = require('connect-flash');

/**For passport.js */
//including library
const User=require('./models/user');
const passport=require('passport');
const compression = require('compression');
const helmet = require('helmet');
//var usersRouter = require('./routes/users');

var app = express();


// app.use(helmet());
//compress responses
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Configure Session middleware
app.use(session({
  
  secret : process.env.SECRET,
  // Setting this value means a new session is not saved in the database unless the session is actually modified
  saveUninitialized : false,
  resave : false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

/**For passport.js */
//Configure Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
/********************************************************************************* */

/**Flash messages */
/********************************************************************************* */

app.use(flash());
//setting up flash middleware
app.use((req,res,next)=>{
  res.locals.user=req.user;
  res.locals.url=req.path;
  res.locals.flash=req.flash();/*This line makes the flash avaialble as a variable in all of the pug files */
  next()
});
/********************************************************************************* */

/**About MiddleWare */
//1. Making a middleware to occur only for admin section
app.use('/admin',(req,res,next)=>{
  console.log("You are in admin section")
  //Here next is used inorder to move the page forward else it would stuck to the same url which is provided
  next()
})
//2. Inorder to make any template appear for all the routes then leave frst para, of app.use() empty

//3. req is also used to get the curent path
app.use((req,res,next)=>{
  // console.log("current path is "+req.path)
  res.locals.url=req.path //Now url is available for whole project
  //Here next is used inorder to move the page forward else it would stuck to the same url which is provided
  next()
})
/********************************************************************************** */
//Set up mongoose connection
var mongoDB = process.env.DB;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise=global.Promise
mongoose.connection.on('error',(error)=>{console.log("hi");console.error(error.message); console.log(error)});

// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb://Anurag25:Anurag@25@cluster1-shard-00-00.xc06s.mongodb.net:27017,cluster1-shard-00-01.xc06s.mongodb.net:27017,cluster1-shard-00-02.xc06s.mongodb.net:27017/lets-travel?ssl=true&replicaSet=atlas-6elbnl-shard-0&authSource=admin&retryWrites=true&w=majority";
// MongoClient.connect(uri, function(err, client) {
//   // const collection = client.db("lets-travel").collection("collection");
//   // perform actions on the collection object
//   // client.close();
// });


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
