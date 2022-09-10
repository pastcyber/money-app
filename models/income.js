const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    userID: {
    type: String,
    required: true
  },
    typeOfIncome: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

const income = mongoose.model('Income', IncomeSchema);

module.exports = income;
