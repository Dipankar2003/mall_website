const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Banner_schema = new Schema({
  Banner_img: {
    type: String,
    required: true,
  },
});
const Banner = mongoose.model("Banner_img", Banner_schema);
module.exports = Banner;
