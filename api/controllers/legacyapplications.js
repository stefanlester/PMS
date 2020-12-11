const mongoose = require("mongoose");
const LegacyApplication = require("../models/legacyapplication");
const Password = require("../models/password");

exports.legacyapplications_get_all = (req, res, next) => {
  LegacyApplication.find()
    .select("password email_username _id")
    .populate("password", "title")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        legacyapplications: docs.map(doc => {
          return {
            _id: doc._id,
            password: doc.password,
            title: doc.title,
            request: {
              type: "GET",
              url: "http://localhost:4000/legacyapplications/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.legacyapplications_create_legacyapplication = (req, res, next) => {
  Password.findById(req.body.passwordId)
    .then(password => {
      if (!password) {
        return res.status(404).json({
          message: "Password not found"
        });
      }
      const legacyapplication = new LegacyApplication({
        _id: mongoose.Types.ObjectId(),
        nameofApp: req.body.nameofApp,
        url: req.body.url
      });
      return legacyapplication.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Legacy Application stored",
        createdOrder: {
          _id: result._id,
          nameofApp: result.nameofApp,
          url: result.url
        },
        request: {
          type: "GET",
          url: "http://localhost:4000/legacyapplications/" + result._id
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

exports.legacyapplications_get_legacyapplication = (req, res, next) => {
  LegacyApplication.findById(req.params.orderId)
    .populate("password")
    .exec()
    .then(legacyapplication => {
      if (!legacyapplication) {
        return res.status(404).json({
          message: "Legacy Application not found"
        });
      }
      res.status(200).json({
        legacyapplication: legacyapplication,
        request: {
          type: "GET",
          url: "http://localhost:4000/legacyapplications"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.legacyapplications_delete_legacyapplication = (req, res, next) => {
  LegacyApplication.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Legacy Application deleted",
        request: {
          type: "POST",
          url: "http://localhost:4000/legacyapplications",
          body: { passwordId: "ID", title: "String" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
