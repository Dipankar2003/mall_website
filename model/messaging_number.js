const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messaging_number_schema = new Schema({
  First_name: {
    type: String,
    required: true,
  },
  Phone_number: {
    type: Number,
    required: true,
  },
  DOB: {
    type: String,
    required: true,
  },
});

const messaging_number = mongoose.model(
  "Messaging_number",
  messaging_number_schema
);
module.exports = messaging_number;
