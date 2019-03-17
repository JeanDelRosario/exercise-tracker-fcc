'use strict';

const date = require('./utilities.js').date;

const User = require('./models').User;

const createUser = function(req, res, done) {
  
   const user = new User({username: req.body.username});
   user.save(function(err, data) {
     
     User.find({username: req.body.username}, function(err, data) {
       
       res.json({username: data[0].username, id: data[0].shortId});
       if(err) return done(err);
       done(null, data);
     })
  });
}

const addExercise = function(req, res, done) {
  // First look if the user exist
  User.findOne({shortId: req.body.userId}, function(err, data){
    
    if(data === null) return res.send(401, 'User doesn\'t exist'); 
    
    req.body.date = req.body.date === "" ? date(new Date()) : req.body.date;
    
    const exerciseLog = {description: req.body.description,
                          duration: req.body.duration,
                         date: req.body.date}
    
    data.exerciseLog.push(exerciseLog);
    
    console.log(data.exerciseLog)
    data.save(function(err, data) {
      if(err) return done(err);
      
      done(null, data);
      
      res.json({username: data.username,
               description: req.body.description,
               duration: req.body.duration,
               date: req.body.date})
    });
  })
}

const getLogs = function(req, res) {
  
  User.findOne({shortId: req.query.userId}, '-_id username exerciseLog', function(err, data){
    
    if(data === null) return res.status(401).send('User doesn\'t exist.');
    
    // Handling optional parameters: from, to, limit
    // TODO: make the filtering in the database instead of locally
    // TODO: check if the dates are valid dates
    
    data.exerciseLog = req.query.from === undefined ? data.exerciseLog : 
      data.exerciseLog.filter((exercise) => exercise.date >= req.query.from);
    
    data.exerciseLog = req.query.to === undefined ? data.exerciseLog : 
      data.exerciseLog.filter((exercise) => exercise.date <= req.query.to);
    
    data.exerciseLog = req.query.limit === undefined ? data.exerciseLog : 
      data.exerciseLog.filter((exercise, index) => index < req.query.limit);
    
    res.json(data);
  })
}

exports.createUser = createUser;
exports.addExercise = addExercise;
exports.getLogs = getLogs;