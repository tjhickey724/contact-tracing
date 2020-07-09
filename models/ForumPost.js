'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = Schema( {
  topic: String,
  message: String,
  author: String,
  date: Date
} );

module.exports = mongoose.model( 'ForumPostTeam0', schema );