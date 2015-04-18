var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  profile: {
    name: String,
    gender: Number,
    age: Number ,
    location: String
  },
  oauth: {
    token: {type: String, required: true},
    token_secret: {type: String, required: true, unique: true}
  },
  meta: {
    userid: {type: Number, unique: true},
    deviceid: {type: Number, unique: true},
    created_at: Date,
    updated_at: Date
  },
  data:{
    body: {},
    activity: {},
    sleep:{}
  },
  settings:{
    startDate: Date,
    endDate: Date,
    show: Boolean
  }
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