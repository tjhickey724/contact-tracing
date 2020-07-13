'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = Schema( {
  topic: String,
  message: String,
  author: String,
  date: Date,
  authorId: Schema.Types.ObjectId // the _id field of the user who created this message
} );

module.exports = mongoose.model( 'ForumPostTeam0', schema );