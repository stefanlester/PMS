const mongoose = require('mongoose');

function generatePassword(pLength){

    var keyListAlpha="abcdefghijklmnopqrstuvwxyz",
        keyListInt="123456789",
        keyListSpec="!@#_",
        password='';
    var len = Math.ceil(pLength/2);
    len = len - 1;
    var lenSpec = pLength-2*len;

    for (i=0;i<len;i++) {
        password+=keyListAlpha.charAt(Math.floor(Math.random()*keyListAlpha.length));
        password+=keyListInt.charAt(Math.floor(Math.random()*keyListInt.length));
    }

    for (i=0;i<lenSpec;i++)
        password+=keyListSpec.charAt(Math.floor(Math.random()*keyListSpec.length));

    password=password.split('').sort(function(){return 0.5-Math.random()}).join('');

    return password;
}

const passwordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    email_username: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Password', passwordSchema);