'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const multer = require('multer');
const coordinates = require('./coordinates');

const ExifImage = require('exif').ExifImage;


const app = express();


app.use(express.static(path.join(__dirname, 'public')));



mongoose.connect('mongodb://localhost/viewerdb').then(() => {
  app.listen(3000,() => {
    console.log('connected to server');
  });
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
      time: Date.now(),
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


  
 
