const mongoose = require('mongoose');

function randPassword(letters, numbers, either) {
    var chars = [
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
     "0123456789", // numbers
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // either
    ];
  
    return [letters, numbers, either].map(function(len, i) {
      return Array(len).fill(chars[i]).map(function(x) {
        return x[Math.floor(Math.random() * x.length)];
      }).join('');
    }).concat().join('').split('').sort(function(){
      return 0.5-Math.random();
    }).join('')
  }
  
  // invoke like so: randPassword(5,3,2);

const passwordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    email_username: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: false },
    generatedPw: { type: String, required: false },
});

module.exports = mongoose.model('Password', passwordSchema);