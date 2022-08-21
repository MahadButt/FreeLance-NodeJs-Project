/* global __dirname */
require('dotenv').config({ path: `${process.env.NODE_ENV}.env` })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
// var https = require('https');
var passport = require('passport');
var helmet = require('helmet');
var bodyParser = require('body-parser');

var Categories = require('./api/middlewares/saveCat');
// Bring in the data model
require('./api/db');

var indexRouter = require('./api')

var app = express();

// Set Proxy Forward header to get request URL
app.set('trust proxy', 'loopback');

//create a cors middleware
app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//SaveCategories
Categories.saveCat();

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
//routes
app.get('/', (req, res, next) => {
  res.json({ name: "Finaps", status: "OK" })
});
app.use(process.env.API_PREFIX, indexRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(process.env.PORT, function () {
  console.log(`
  ####################################
      Process.env.NODE_ENV:${process.env.NODE_ENV}
  🛡️  Server listening on port: ${process.env.PORT} 🛡️
  ####################################
`);
});

module.exports = app;