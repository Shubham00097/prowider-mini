const Service = require("../models/Service");
const Provider = require("../models/Provider");
const AllocationState = require("../models/AllocationState");

const autoSeed = async () => {
    try {
        const serviceCount = await Service.countDocuments();
        const providerCount = await Provider.countDocuments();

        if (serviceCount === 0 || providerCount === 0) {
            console.log("Empty database detected. Starting auto-seed...");

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

            console.log("Auto-seed completed successfully.");
        } else {
            console.log("Database already contains data. Skipping auto-seed.");
        }
    } catch (error) {
        console.error("Auto-seed failed:", error.message);
    }
};

module.exports = autoSeed;
