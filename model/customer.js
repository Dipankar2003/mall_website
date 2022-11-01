const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customer_schema = new Schema(
  {
    First_name: {
      type: String,
      required: true,
    },
    Last_name: {
      type: String,
      required: true,
    },
    Email: {
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
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer_data", customer_schema);
module.exports = Customer;
