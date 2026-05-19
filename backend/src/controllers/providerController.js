const Provider = require("../models/Provider");
const LeadAssignment = require("../models/LeadAssignment");

const getProviderDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    const assignments = await LeadAssignment.find({
      providerId: id,
    })
      .populate({
        path: "leadId",
        populate: {
          path: "serviceId",
          model: "Service",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,

      provider: {
        id: provider._id,
        name: provider.name,
        monthlyQuota: provider.monthlyQuota,
        usedQuota: provider.usedQuota,
        remainingQuota:
          provider.monthlyQuota - provider.usedQuota,
      },

      totalLeads: assignments.length,

      leads: assignments.map((item) => ({
        assignmentId: item._id,

        assignedAt: item.createdAt,

        lead: item.leadId,
      })),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find();

    return res.status(200).json({
      success: true,
      providers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProviderDashboard,
  getAllProviders,
};