const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    badges: { type: [String], default: [] }
});

module.exports = mongoose.model("badges", BadgeSchema);
