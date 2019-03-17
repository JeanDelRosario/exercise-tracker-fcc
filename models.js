'use strict';
const mongoose = require('mongoose');
const shortId = require('shortid');


const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {type: String, required: true},
  shortId: {type: String, 'default': shortId.generate()},
  exerciseLog: {type: Array, 'default': []}
});
const User = mongoose.model('User', UserSchema);

exports.User = User;