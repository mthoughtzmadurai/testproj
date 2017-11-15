var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_FACTOR = 10;
var ApplicationSchema = new Schema({
  ApplicationName:String,
  CreatedBy:String,
  CreatedAt:Date,
  AppSecretID:String,
  BaseURL:String,
  RedirectURL:String,
  isActive:String
},
 {
  collection: 'Applications'
});


ApplicationSchema.pre('save', function(next) {
  this.CreatedAt = Date.now();
  this.isActive = "A";
  next();
});

module.exports = mongoose.model('Applications', ApplicationSchema);
