const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    recipe:[{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
        quantityNeeded: { type: Number, required: true } // per serving
      }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
