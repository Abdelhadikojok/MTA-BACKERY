// models/itemModel.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, //عجين بلحمة
  price: { type: Number, required: true }, // 12000
  description: { type: String, required: true }, // لحمة,عجين رقاقات,حجم صغير,دزينة
  productImage: { type: String, required: true }, //
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    index: true,
  },
});

const Item = mongoose.model("Item", ItemSchema, "Item");

module.exports = Item;
