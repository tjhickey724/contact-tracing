'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = Schema( {
  when: Date,
  where: String,
  who: String,
  howLong: String,
  description: String,

} );

module.exports = mongoose.model( 'ContactTJH0', schema );