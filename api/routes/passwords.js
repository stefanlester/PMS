const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
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

//router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get("/:passwordId", PasswordsController.passwords_get_password);

router.patch("/:passwordId", checkAuth, PasswordsController.passwords_update_password);

router.delete("/:passwordId", checkAuth, PasswordsController.passwords_delete);

module.exports = router;
