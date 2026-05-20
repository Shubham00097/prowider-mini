const mongoose = require("mongoose");

const Provider = require("../models/Provider");
const LeadAssignment = require("../models/LeadAssignment");
const AllocationState = require("../models/AllocationState");

const mandatoryProviders = {
    "Service 1": ["Provider 1"],
    "Service 2": ["Provider 5"],
    "Service 3": ["Provider 1", "Provider 4"],
};

const providerPools = {
    "Service 1": ["Provider 2", "Provider 3", "Provider 4"],

    "Service 2": ["Provider 6", "Provider 7", "Provider 8"],

    "Service 3": [
        "Provider 2",
        "Provider 3",
        "Provider 5",
        "Provider 6",
        "Provider 7",
        "Provider 8",
    ],
};

const distributeLead = async (lead, serviceName, session) => {
    const TOTAL_REQUIRED = 3;
    let selectedProviders = [];

    // =========================
    // STEP 1: Mandatory Providers
    // =========================

    const mandatory = mandatoryProviders[serviceName] || [];

    for (const providerName of mandatory) {
        // Atomic claim quota
        const provider = await Provider.findOneAndUpdate(
            { name: providerName, usedQuota: { $lt: 10 } },
            { $inc: { usedQuota: 1 } },
            { session, new: true }
        );

        if (provider) {
            selectedProviders.push(provider);
        }
    }

    // =========================
    // STEP 2: Fair Allocation
    // =========================

    const remainingSlots = TOTAL_REQUIRED - selectedProviders.length;

    if (remainingSlots > 0) {
        const pool = providerPools[serviceName];

        // Persistent round robin state
        const state = await AllocationState.findOne({
            serviceName,
        }).session(session);

        if (!state)
            throw new Error(
                `Run seed first: AllocationState missing for ${serviceName}`
            );
        let currentIndex = state.currentIndex;
        let checked = 0;

        while (
            selectedProviders.length < TOTAL_REQUIRED &&
            checked < pool.length
        ) {
            const providerName = pool[currentIndex % pool.length];

            // avoid duplicates
            const alreadySelected = selectedProviders.some(
                (p) => p.name === providerName
            );

            if (!alreadySelected) {
                // Atomic claim quota
                const provider = await Provider.findOneAndUpdate(
                    { name: providerName, usedQuota: { $lt: 10 } },
                    { $inc: { usedQuota: 1 } },
                    { session, new: true }
                );

                if (provider) {
                    selectedProviders.push(provider);
                }
            }

            currentIndex++;
            checked++;
        }

        // Save updated pointer
        await AllocationState.findOneAndUpdate(
            { serviceName },
            {
                $set: {
                    currentIndex: currentIndex % pool.length,
                },
            },
            {
                session,
                new: true,
            }
        );
    }

    // =========================
    // STEP 3: Validation
    // =========================

    if (selectedProviders.length !== TOTAL_REQUIRED) {
        throw new Error(
            "Not enough providers available with quota"
        );
    }

    // =========================
    // STEP 4: Save Assignments
    // =========================

    const assignments = selectedProviders.map((provider) => ({
        leadId: lead._id,
        providerId: provider._id,
    }));

    await LeadAssignment.insertMany(assignments, { session });

    return selectedProviders;
};

module.exports = distributeLead;