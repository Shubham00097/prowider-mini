const express = require("express");

const {
  resetQuotaWebhook,
} = require("../controllers/webhookController");

const router = express.Router();

router.post("/payment", resetQuotaWebhook);

module.exports = router;