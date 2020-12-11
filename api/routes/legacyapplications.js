const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const LegacyApplicationsController = require('../controllers/legacyapplications');

// Handle incoming GET requests to /legacy apps
router.get("/", LegacyApplicationsController.legacyapplications_get_all);

router.post("/", LegacyApplicationsController.legacyapplications_create_legacyapplication);

router.get("/:legacyapplicationId", LegacyApplicationsController.legacyapplications_get_legacyapplication);

router.delete("/:legacyapplicationId", LegacyApplicationsController.legacyapplications_delete_legacyapplication);

module.exports = router;
 