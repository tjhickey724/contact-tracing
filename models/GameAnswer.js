'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var gameAnswerSchema = Schema( {
  gamePIN: String,
  username: String,
  answer: String
} );

module.exports = mongoose.model( 'Team0', userSchema );
