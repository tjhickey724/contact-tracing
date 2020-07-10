'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var gameAnswerSchema = Schema( {
  gamePIN: String,
  username: String,
  answer: String,
  messageFromAdmin: String,
  messageToAdmin: String,
} );

module.exports = mongoose.model( 'GameAnswerTeam0', gameAnswerSchema );
