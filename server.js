'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const coordinates = require('./coordinates');
const ExifImage = require('exif').ExifImage;
const moment = require('moment');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = express();

const https = require('https');
const fs = require('fs');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
      key: sslkey,
      cert: sslcert
};


https.createServer(options, app).listen(3000);

app.get('/', (req, res) => {
  res.redirect('index.html');
});
//force redirection from HTTP to HTTPS
const http = require('http');

http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
      res.end();
}).listen(8080);

// app.use((req, res, next) => {
//   if (req.query.token === 'SECRET_TOKEN_TOKEN') {
//       next();
//   }
//   else {
//       res.status(401).send('Please sign in.');
//   }
// });


// require('dotenv').config();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// passport.use(new LocalStrategy(
//     (username, password, done) => {
//         if (username !== process.env.username || password !== process.env.password) {
//             done(null, false, {message: 'Incorrect credentials.'});
//             return;
//         }
//         return done(null, {});
//     }
// ));
// app.use(passport.initialize());

// app.post('/login', 
//   passport.authenticate('local', { 
//     successRedirect: '/', 
//     failureRedirect: '/test', 
//     session: false })
// );


//middleware
app.use(helmet());

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(express.static('public'));
//Parse aplication/json
app.use(bodyParser.json());
app.use('/users', users);


//Passport 
//////////////////////////////////////////////////////////////////
require('dotenv').config();
//Username and Password in .env
passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.DB_USR || password !== process.env.DB_PWD) {
            done(null, false, {
                message: 'Incorrect credentials.'
            });
            return;
        }
        return done(null, {});
    }
));

//login route
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        session: false
    })
);



app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/viewerdb').then(() => {
}, err => {
  console.log('Connection to db failed: ' + err);
});

// Schema
const Schema = mongoose.Schema;
const catSchema = new Schema({
    time: Date,
    category: String,
    title: String,
    details: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    thumbnail: String,
    image: String,
    original: String,
    
  }
);

// Model
const Cat = mongoose.model('Cat', catSchema);


const upload = multer({dest: 'public/original'});

// add new image
app.post('/cats', upload.single('picture'), function(req, res, next) {
  
  req.body.original = 'original/' + req.file.filename;
  // save default coordinates
  //req.body.coordinates = JSON.parse(req.body.coordinates);
  next();
});

//get coordinates from EXIF
app.use('/cats', (req, res, next) => {
  console.log(JSON.stringify(req.file));
  coordinates.getCoordinates(req.file.path).then(coords => {
    req.body.coordinates = coords;
    next();
  });
});

// // make small thumbnail
// const thumbPath ="";
// app.use('/cats', (req, res, next) => {
//  thumbPath = 'thumb/' + req.file.filename;
//   imageresize.resize(req.file.path, 'public/' + thumbPath, 320, 240).
//       then(resp => {
//         console.log(resp);
//         req.body.thumbnail = thumbPath;
//         next();
//       });
// });


app.post('/cats', (req,res) => {
  console.log(req.body);
  const billi = new Cat (
    {
      time: new Date(moment().format('MMMM Do YYYY,h:mm:ss a')),
      category: req.body.category,
      title: req.body.title,
      details: req.body.details,
      coordinates: req.body.coordinates,
      thumbnail:req.body.original,
      original:req.body.original
  
  
    })
  billi.save();
  res.redirect('form.html');
  })
  
  app.get('/resources', (req, res) => {
     Cat.find({},(err,data)=> {
       res.json(data);
     })
  });

  app.post('/update', (req, res) => {
    console.log(req.body.id);
    
    Cat.findById(req.body.id, (err, data) => {
      if (err) throw err;     
      data.category= req.body.category;
      data.title= req.body.title;
      data.details= req.body.details;
      data.save();
    });
   
    res.redirect('/')
  })
  
  
app.post('/update', (req, res) => {
  console.log(req.body.word);


  Cat.find({ name: req.body.word }, (err, data) => {
    if (err) res.send(err);
    console.log(data);
    res.send(data);
  })
})

app.post('/delete', (req, res) => {
  console.log(req.body.word);
  Cat.findByIdAndRemove(req.body.word,(err,res)=>{
     if(err) throw err;
     console.log(res);  

  })
  res.redirect('/')
})
