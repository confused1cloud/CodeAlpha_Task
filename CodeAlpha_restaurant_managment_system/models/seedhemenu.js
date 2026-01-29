const mongoose = require("mongoose");
const MenuItem = require("./models/menuitems");
const Inventory = require("./models/inventory");

mongoose.connect("mongodb://127.0.0.1:27017/restaurant");

async function seed() {
  try {
    // Fetch inventory items
    const paneer = await Inventory.findOne({ name: "Paneer" });
    const butter = await Inventory.findOne({ name: "Butter" });
    const garamMasala = await Inventory.findOne({ name: "Garam Masala" });
    const tomatoes = await Inventory.findOne({ name: "Tomatoes" });
    const wheat = await Inventory.findOne({ name: "Wheat" });
    const garlic = await Inventory.findOne({ name: "Garlic" });
    const rice = await Inventory.findOne({ name: "Rice" });
    const vegetables = await Inventory.findOne({ name: "Vegetables" });

    const menu = [
      // MAIN COURSE
      {
        name: "Paneer Angara",
        category: "main-course",
        price: 240,
        recipe: [
          { ingredient: paneer._id, quantityNeeded: 200 },
          { ingredient: butter._id, quantityNeeded: 20 },
          { ingredient: garamMasala._id, quantityNeeded: 5 },
          { ingredient: tomatoes._id, quantityNeeded: 50 }
        ]
      },
      {
        name: "Butter Paneer",
        category: "main-course",
        price: 220,
        recipe: [
          { ingredient: paneer._id, quantityNeeded: 150 },
          { ingredient: butter._id, quantityNeeded: 25 },
          { ingredient: garamMasala._id, quantityNeeded: 5 }
        ]
      },
      {
        name: "Veg Kolhapuri",
        category: "main-course",
        price: 210,
        recipe: [
          { ingredient: vegetables._id, quantityNeeded: 200 },
          { ingredient: garamMasala._id, quantityNeeded: 5 },
          { ingredient: tomatoes._id, quantityNeeded: 50 }
        ]
      },

      // ROTIS
      {
        name: "Wheat Roti",
        category: "roti",
        price: 15,
        recipe: [
          { ingredient: wheat._id, quantityNeeded: 100 }
        ]
      },
      {
        name: "Butter Naan",
        category: "roti",
        price: 25,
        recipe: [
          { ingredient: wheat._id, quantityNeeded: 100 },
          { ingredient: butter._id, quantityNeeded: 10 }
        ]
      },
      {
        name: "Garlic Naan",
        category: "roti",
        price: 35,
        recipe: [
          { ingredient: wheat._id, quantityNeeded: 100 },
          { ingredient: butter._id, quantityNeeded: 10 },
          { ingredient: garlic._id, quantityNeeded: 5 }
        ]
      },

      // RICE
      {
        name: "Steamed Rice",
        category: "rice",
        price: 90,
        recipe: [
          { ingredient: rice._id, quantityNeeded: 150 }
        ]
      },
      {
        name: "Veg Fried Rice",
        category: "rice",
        price: 140,
        recipe: [
          { ingredient: rice._id, quantityNeeded: 150 },
          { ingredient: vegetables._id, quantityNeeded: 50 },
          { ingredient: butter._id, quantityNeeded: 10 }
        ]
      },
      {
        name: "Veg Biryani",
        category: "rice",
        price: 180,
        recipe: [
          { ingredient: rice._id, quantityNeeded: 150 },
          { ingredient: vegetables._id, quantityNeeded: 100 },
          { ingredient: garamMasala._id, quantityNeeded: 5 },
          { ingredient: butter._id, quantityNeeded: 10 }
        ]
      },

      // SOUP
      {
        name: "Tomato Soup",
        category: "soup",
        price: 80,
        recipe: [
          { ingredient: tomatoes._id, quantityNeeded: 100 },
          { ingredient: garamMasala._id, quantityNeeded: 2 }
        ]
      },
      {
        name: "Manchow Soup",
        category: "soup",
        price: 100,
        recipe: [
          { ingredient: vegetables._id, quantityNeeded: 100 },
          { ingredient: garamMasala._id, quantityNeeded: 2 }
        ]
      }
    ];

    await MenuItem.deleteMany();
    await MenuItem.insertMany(menu);
    console.log("Menu seeded successfully with recipes");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

