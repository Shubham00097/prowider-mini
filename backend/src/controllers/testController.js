const axios = require("axios");

const generateLeads = async (req, res) => {
  try {
    const requests = [];
    const basePhone = Math.floor(10000000 + Math.random() * 90000000);

    for (let i = 1; i <= 10; i++) {
      const paddedI = i.toString().padStart(2, "0");
      requests.push(
        axios.post(`${process.env.BASE_URL}/api/leads`, {
          name: `Test User ${i}`,
          phone: `${basePhone}${paddedI}`,
          city: "Delhi",

          description: "Concurrency Test",

          serviceName:
            i % 3 === 0
              ? "Service 1"
              : i % 3 === 1
              ? "Service 2"
              : "Service 3",
        })
      );
    }

    const results = await Promise.allSettled(requests);

    return res.status(200).json({
      success: true,
      totalRequests: results.length,

      results: results.map((r) => ({
        status: r.status,

        data:
          r.status === "fulfilled"
            ? r.value.data
            : r.reason.message,
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

const Service = require("../models/Service");
const Provider = require("../models/Provider");
const AllocationState = require("../models/AllocationState");

const seedDatabase = async (req, res) => {
  try {
    await Service.deleteMany();
    await Provider.deleteMany();
    await AllocationState.deleteMany();

    await Service.insertMany([
      { name: "Service 1" },
      { name: "Service 2" },
      { name: "Service 3" },
    ]);

    const providers = [];
    for (let i = 1; i <= 8; i++) {
      providers.push({ name: `Provider ${i}` });
    }
    await Provider.insertMany(providers);

    await AllocationState.insertMany([
      { serviceName: "Service 1", currentIndex: 0 },
      { serviceName: "Service 2", currentIndex: 0 },
      { serviceName: "Service 3", currentIndex: 0 },
    ]);

    return res.status(200).json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateLeads,
  seedDatabase,
};