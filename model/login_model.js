const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const login_schema = new Schema({
  Email: {
    type: String,
    required: true,
  },
  Passward: {
    type: String,
    required: true,
  },
});

const login = mongoose.model("Login_detail", login_schema);
module.exports = login;
