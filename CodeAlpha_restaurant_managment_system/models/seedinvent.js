const mongoose = require("mongoose");
const Inventory = require("./models/inventory"); // path to your Inventory model

mongoose.connect("mongodb://127.0.0.1:27017/restaurant");

const inventoryData = [
  { name: "Paneer", category: "dairy", quantity: 1000, unit: "grams" },
  { name: "Butter", category: "dairy", quantity: 500, unit: "grams" },
  { name: "Garam Masala", category: "spice", quantity: 200, unit: "grams" },
  { name: "Tomatoes", category: "vegetable", quantity: 500, unit: "grams" }
];

async function seedInventory() {
  try {
    await Inventory.deleteMany(); // clear old stock
    await Inventory.insertMany(inventoryData);
    console.log("Inventory seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedInventory();
