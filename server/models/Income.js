const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  description: String
});

module.exports = mongoose.model('Income', IncomeSchema);