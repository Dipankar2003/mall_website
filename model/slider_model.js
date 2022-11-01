const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Slider_schema = new Schema({
  Slider_img: {
    type: String,
    required: true,
  },
});
const Slider = mongoose.model("Slider_img", Slider_schema);
module.exports = Slider;
