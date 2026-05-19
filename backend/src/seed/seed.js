const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Service = require("../models/Service");
const Provider = require("../models/Provider");
const AllocationState = require("../models/AllocationState");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  try {
    await Service.deleteMany();
    await Provider.deleteMany();
    await AllocationState.deleteMany();

    const services = await Service.insertMany([
      { name: "Service 1" },
      { name: "Service 2" },
      { name: "Service 3" },
    ]);

    const providers = [];

    for (let i = 1; i <= 8; i++) {
      providers.push({
        name: `Provider ${i}`,
      });
    }

    await Provider.insertMany(providers);

    await AllocationState.insertMany([
      {
        serviceName: "Service 1",
        currentIndex: 0,
      },
      {
        serviceName: "Service 2",
        currentIndex: 0,
      },
      {
        serviceName: "Service 3",
        currentIndex: 0,
      },
    ]);

    console.log("Seed Data Inserted");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seed();