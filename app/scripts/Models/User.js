var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var secretgenerator = require('speakeasy');
var UserSchema = new Schema({
  UserName:String,
  AppID:String,
  SecretBaseKey:String,
  AuthenticationMethod:String,
  CreatedAt:Date,
  isActive:String,
  QRPath:String,
  DeviceID:String,
  LastLogged:[
      {LoggedInAt:Date}
  ]
},
 {
  collection: 'Users'
});

UserSchema.pre('save', function(next) {
  this.CreatedAt = Date.now();
  this.isActive = "A";
  next();
});

module.exports = mongoose.model('User', UserSchema);
