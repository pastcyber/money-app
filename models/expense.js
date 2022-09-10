const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
   typeOfExpense: {
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

const expense = mongoose.model('Expense', ExpenseSchema);

module.exports = expense;
