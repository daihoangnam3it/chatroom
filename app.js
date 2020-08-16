var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv=require('dotenv');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
var cookieParser = require('cookie-parser')
const flash=require('connect-flash');
var mongoose=require('mongoose');

dotenv.config({path:'./.env'});
require('./config/passport')(passport);

var app = express();
app.get('*',function(req,res,next){
  res.locals.user=req.user||null;
  next();
})
//Connect DATABASE
const DB=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
var url=process.env.MONGODB_URI;

mongoose.connect(DB,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:true}).then(()=>{
  console.log('Đã kết nối với database')
}).catch(err=>console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));








app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.errs_mgs=req.flash('errs_mgs');
  res.locals.error=req.flash('error');
  res.locals.user=req.user||null;

  next();
})



//Passport config





app.use('/', indexRouter);
app.use('/users', usersRouter);
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
