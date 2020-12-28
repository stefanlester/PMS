const mongoose = require('mongoose');

// not in use now
function randPassword(letters, numbers, either) {
  var chars = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
    "0123456789~!@#$%^&*()_+", // numbers and characters
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // either
  ];

  return [letters, numbers, either].map(function (len, i) {
    return Array(len).fill(chars[i]).map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    }).join('');
  }).concat().join('').split('').sort(function () {
    return 0.5 - Math.random();
  }).join('')
}
// invoke like so: randPassword(5,3,2);

const passwordSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  email_username: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: false
  },
  legacyApplicationUrl: {
    type: String,
    required: true
  },
  generatedPw: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  },
  hibp_result: {
    type: String,
    require: true
  }
});

// password expiry
passwordSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('Password', passwordSchema);