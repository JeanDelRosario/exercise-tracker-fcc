'use strict';

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const shortId = require('shortid');
const cors = require('cors');

const createUser = require('./logic.js').createUser;
const addExercise = require('./logic.js').addExercise;
const getLogs = require('./logic.js').getLogs;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Setting up database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

// Creating users
app.post('/api/exercise/new-user', function(req, res, next) {
  createUser(req, res, done);
});

// Add exercises
app.post('/api/exercise/add', function(req, res, next) {
  addExercise(req, res, done);
});

// Done function
function done(err, data) {
  if(err) { return err; }
  if(!data) {
    console.log('Missing `done()` argument');
    return console.log({message: 'Missing callback argument'});
  }
}

// API for getting exercise log
app.get('/api/exercise/log', function(req, res) {
  getLogs(req, res);
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
