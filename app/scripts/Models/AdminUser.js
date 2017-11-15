var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_FACTOR = 10;
var AdminUserScheme = new Schema({
  AdminID:Schema.ObjectId,
  AdminName:String,
  AdminUsername:String,
  AdminPassword:String,
  AdminEmail:String,
  AdminType:String,
  LastLogged:[
      {LoggedInAt:Date}
  ]
},
 {
  collection: 'AdminUser'
});

AdminUserScheme.pre('save', function(next){
  var user = this;
  if (!user.isModified('AdminPassword')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.AdminPassword, salt, function(err, hash){
      if(err) return next(err);

      user.AdminPassword = hash;
      next();
    });
  });
});
module.exports = mongoose.model('AdminUser', AdminUserScheme);
