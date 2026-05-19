const Provider = require("../models/Provider");
const WebhookEvent = require("../models/WebhookEvent");

const resetQuotaWebhook = async (req, res) => {
  try {
    const { eventId } = req.body;

    // =========================
    // Validate eventId
    // =========================

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    // =========================
    // Check idempotency
    // =========================

    const existingEvent = await WebhookEvent.findOne({
      eventId,
    });

    if (existingEvent) {
      return res.status(200).json({
        success: true,
        message:
          "Webhook already processed (idempotent)",
      });
    }

    // =========================
    // Save webhook event
    // =========================

    await WebhookEvent.create({
      eventId,
    });

    // =========================
    // Reset all provider quotas
    // =========================

    await Provider.updateMany(
      {},
      {
        $set: {
          usedQuota: 0,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Provider quotas reset successfully",
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Webhook already processed (idempotent)",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  resetQuotaWebhook,
};