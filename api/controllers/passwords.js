const encrypt = require('encryptor-node')
const decrypt = require('encryptor-node')
const mongoose = require("mongoose");
const pwd = require("../models/password"); // NOT IN USE NOW. WILL USE LATER
const Password = require("../models/password");
const secret = 'secret'
const hibp = require ('haveibeenpwned') (); // module for hibp

// FUNCTION TO GENERATE RANDOM PASSWORD ACCORDING TO CONFIGURABLE LENGTH
// FOR BOTWE: INITITALIZE FUNCTION LIKE THIS === randpassword(number of letters you want, number of numbers you want, mixed characters)
//REMEMBER TO WRITE THIS FUNCTION IN MIDDLEWARE AND EXPORT IT HERE
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

let randomPw = randPassword(10,10,10)
let payload = randomPw

exports.passwords_get_all = (req, res, next) => {
  Password.find()
    .select("title email_username password generatedPw")  // added generatedPw to get generated password from function passwords_create_password
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        passwords: docs.map(doc => {
          return {
            email_username: doc.email_username,   // continue from here
            title: doc.title,
            password: doc.password,
            generatedPw: doc.generatedPw, //get generated password
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:4000/passwords/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.passwords_create_password = (req, res, next) => {
  const password = new Password({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    email_username: req.body.email_username,
    password: req.body.password,
    generatedPw: payload,
    hibp_result: req.body.hibp_result
  });

  password
    .save()
    .then(result => {
      console.log(result);

      //HIBP SERVICE
      hibp.pwnedpasswords.byPassword ('generatedPw', (err, count) => {
        if (!count) {
          console.log ('Great! Password is not found.');
        } else {
          console.log ('Oops! Password was found ' + count + ' times!');
        }
      });

      res.status(201).json({
        message: "Created password successfully",
        createdPassword: {
          title: result.title,
          email_username: result.email_username,
          generatedPw: result.generatedPw,
          _id: result._id,
          hibp_result: result.hibp_result,
          request: {
            type: "GET",
            url: "http://localhost:4000/passwords/" + result._id
          }
        } 
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.passwords_get_password = (req, res, next) => {
  // decrypting
  //const decrypted = decrypt(secret, payload);
  //console.log(decrypted); // { decrypted password }
  const id = req.params.passwordId;
  Password.findById(id)
    .select("title email_username _id password generatedPw")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          password: doc,
          request: {
            type: "GET",
            url: "http://localhost:4000/passwords"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.passwords_update_password = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Password.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Password updated",
        request: {
          type: "GET",
          url: "http://localhost:4000/passwords/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.passwords_delete = (req, res, next) => {
  const id = req.params.productId;
  Password.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Passwords deleted",
        request: {
          type: "POST",
          url: "http://localhost:4000/passwords",
          body: { title: "String", email_username: "String" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public

// gotten from password.js model(PMS\api\models\password.js Line 52)
/* passwordSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
}; */
exports.passwords_reset = (req, res) => {
  Password.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
      .then((user) => {
          if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

          res.render('reset', {Password});
      })
      .catch(err => res.status(500).json({message: err.message}));
};

