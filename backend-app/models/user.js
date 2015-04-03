var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// define our nerd model
// module.exports allows us to pass this to other files when it is called
var userSchema = new Schema({
  name: String,
  username: {type: String, unique: true},
  password: {type: String},
  oauth: {
    token: {type: String, required: true},
    token_secret: {type: String, required: true, unique: true}
  },
  meta: {
    userid: {type: Number, unique: true},
    deviceid: {type: Number, unique: true}
  },
  created_at: Date,
  updated_at: Date,
  activity: {},
  sleep:{}
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;

  if (!this.created_at) {
    this.created_at = currentDate;
  }

  next();
});

module.exports = mongoose.model('WCUser', userSchema);