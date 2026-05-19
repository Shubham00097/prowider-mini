const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const Service = require("../models/Service");

const distributeLead = require("../services/distributeLead");

const createLead = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const {
        name,
        phone,
        city,
        description,
        serviceName,
      } = req.body;

      // =========================
      // Validate Input
      // =========================

      if (!/^\d{10}$/.test(phone)) {
        throw new Error("Phone number must be exactly 10 digits");
      }

      const service = await Service.findOne({
        name: serviceName,
      }).session(session);

      if (!service) {
        throw new Error("Service not found");
      }

      // =========================
      // Duplicate Check
      // =========================

      const existingLead = await Lead.findOne({
        phone,
        serviceId: service._id,
      }).session(session);

      if (existingLead) {
        // We throw a custom error to distinguish it from transaction errors
        throw new Error("Duplicate lead for same service not allowed");
      }

      // =========================
      // Create Lead
      // =========================

      const lead = await Lead.create(
        [
          {
            name,
            phone,
            city,
            description,
            serviceId: service._id,
          },
        ],
        { session }
      );

      // =========================
      // Distribute Lead
      // =========================

      const assignedProviders = await distributeLead(
        lead[0],
        serviceName,
        session
      );

      result = { lead: lead[0], assignedProviders };
    });

    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead: result.lead,
      assignedProviders: result.assignedProviders,
    });
  } catch (error) {
    session.endSession();
    console.log("Transaction Error:", error.message);

    const badRequestMessages = [
      "Duplicate lead for same service not allowed",
      "Phone number must be exactly 10 digits",
      "Service not found"
    ];

    if (badRequestMessages.includes(error.message) || error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: error.code === 11000 ? "Duplicate lead for same service not allowed" : error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
};