const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Budget", budgetSchema);