const express = require("express");
const router = express.Router();
const multer = require('multer');
//const checkAuth = require('../middleware/check-auth');
const PasswordsController = require('../controllers/passwords');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", PasswordsController.passwords_get_all);

router.post("/", PasswordsController.passwords_create_password);

router.get("/:passwordId", PasswordsController.passwords_get_password);

router.patch("/:passwordId", PasswordsController.passwords_update_password);

router.delete("/:passwordId", PasswordsController.passwords_delete);

router.patch("/:passwordId", PasswordsController.passwords_reset);

module.exports = router;
