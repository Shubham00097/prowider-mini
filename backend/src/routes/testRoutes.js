const express = require("express");

const {
  generateLeads,
} = require("../controllers/testController");

const router = express.Router();

router.post("/generate-leads", generateLeads);

module.exports = router;