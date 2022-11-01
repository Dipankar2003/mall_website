const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message_schema = new Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
const message = mongoose.model("Message", message_schema);
module.exports = message;
