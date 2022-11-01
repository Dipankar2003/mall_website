const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallery_schema = new Schema(
  {
    Product_name: {
      type: String,
      required: true,
    },
    Product_price: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Product_Desc: {
      type: String,
      required: true,
    },
    Product_img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery_img", gallery_schema);
module.exports = Gallery;
