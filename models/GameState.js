'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var schema = Schema( {
  gamePIN: String,
  status: String,
  state: String,
  stage: Number,
  owner: Schema.Types.ObjectId,
} );

module.exports = mongoose.model( 'GameStateTeam0', schema );
