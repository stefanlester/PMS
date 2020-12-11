const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const LegacyApplicationsController = require('../controllers/legacyapplications');

// Handle incoming GET requests to /orders
router.get("/", checkAuth, LegacyApplicationsController.legacyapplications_get_all);

router.post("/", checkAuth, LegacyApplicationsController.legacyapplications_create_legacyapplication);

router.get("/:legacyapplicationId", checkAuth, LegacyApplicationsController.legacyapplications_get_legacyapplication);

router.delete("/:legacyapplicationId", checkAuth, LegacyApplicationsController.orders_delete_order);

module.exports = router;
 