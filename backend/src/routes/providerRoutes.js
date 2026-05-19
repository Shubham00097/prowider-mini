const express = require("express");

const {
  getProviderDashboard,
  getAllProviders,
} = require("../controllers/providerController");

const router = express.Router();

router.get("/", getAllProviders);
router.get("/:id/dashboard", getProviderDashboard);

module.exports = router;