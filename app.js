var createError = require('http-errors');
var sql = require('mysql2')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session')
var flash = require('express-flash')

var indexRouter = require('./routes/index');
var requestRouter = require('./routes/request');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var tourRouter = require('./routes/tour');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session Settings
app.use(cookieParser());
app.use(cookieParser());
app.use(session({ 
    secret: 'N*HD%vm&#%FVB',
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 990000 }
    cookie: { maxAge: 7200000 }
}))

app.use(flash());


app.use('/', indexRouter);
app.use('/request', requestRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/tour_admin', tourRouter);

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
