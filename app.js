var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var api = require("./api")


var app = express();



app.use('/api', api);

app.listen(3000, ()=>{
  console.log("connected")
})
