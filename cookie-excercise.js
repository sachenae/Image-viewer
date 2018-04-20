'use strict';
const express = require('express');
const app = express();

cookieParser = require('cookie-parser'); // in order to read cookie sent from client
app.use(cookieParser());

// app.get('/*', (req, res) => {
//   const param1 = req.path;
//   const queryparams = req.query;


//   res.send('Got to the root with path: '+param1+' with query params: '+
//         JSON.stringify(queryparams)+'Cookies: '+JSON.stringify(req.cookies));
// });



app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } 
  else
  {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important!
});
console.log('inspector started');
app.listen(4000);