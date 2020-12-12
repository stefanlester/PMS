const mongoose = require("mongoose");
const pwd = require("../models/password");
const Password = require("../models/password");

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

exports.passwords_get_all = (req, res, next) => {
  Password.find()
    .select("title email_username password")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        passwords: docs.map(doc => {
          return {
            email_username: doc.email_username,   // continue from here
            title: doc.title,
            password: doc.password,
            generatedPw: randPassword(7,9,8),
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
    generatedPw: randPassword(7,9,8),
  });
  password
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created password successfully",
        createdPassword: {
          title: result.password,
          email_username: result.email_username,
          generatedPw: result.generatedPw,
          _id: result._id,
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
  Product.remove({ _id: id })
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
