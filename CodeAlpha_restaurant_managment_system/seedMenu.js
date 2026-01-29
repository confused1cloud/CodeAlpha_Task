const mongoose = require("mongoose");
const MenuItem = require("./models/menuitems");
const Inventory = require("./models/inventory");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => {
  console.error("❌ Connection failed:", err);
  process.exit(1);
});

async function seedMenu() {
  console.log("🌱 Seeding database...");
  
  try {
    // 1. FIRST, CREATE SOME BASIC INVENTORY
    console.log("Creating inventory items...");
    
    const inventoryItems = [
      { name: "Paneer", category: "dairy", quantity: 10000, unit: "grams" },
      { name: "Butter", category: "dairy", quantity: 5000, unit: "grams" },
      { name: "Wheat", category: "grain", quantity: 20000, unit: "grams" },
      { name: "Rice", category: "grain", quantity: 15000, unit: "grams" },
      { name: "Vegetables", category: "vegetable", quantity: 8000, unit: "grams" }
    ];
    
    await Inventory.deleteMany({});
    const createdInventory = await Inventory.insertMany(inventoryItems);
    console.log(`✅ Created ${createdInventory.length} inventory items`);
    
    // Create a map to reference inventory IDs
    const invMap = {};
    createdInventory.forEach(item => {
      invMap[item.name] = item._id;
    });
    
    // 2. CREATE SIMPLE MENU ITEMS
    console.log("\nCreating menu items...");
    
    const menuItems = [
      // SIMPLE ITEMS - No complex recipes for testing
      {
        name: "Veg Burger",
        price: 120,
        category: "fast-food",
        isAvailable: true,
        recipe: [
          { ingredient: invMap["Vegetables"], quantityNeeded: 100 }
        ]
      },
      {
        name: "French Fries",
        price: 80,
        category: "snacks",
        isAvailable: true,
        recipe: [
          { ingredient: invMap["Vegetables"], quantityNeeded: 150 }
        ]
      },
      {
        name: "Paneer Tikka",
        price: 180,
        category: "starter",
        isAvailable: true,
        recipe: [
          { ingredient: invMap["Paneer"], quantityNeeded: 200 }
        ]
      },
      {
        name: "Butter Naan",
        price: 30,
        category: "bread",
        isAvailable: true,
        recipe: [
          { ingredient: invMap["Wheat"], quantityNeeded: 100 },
          { ingredient: invMap["Butter"], quantityNeeded: 10 }
        ]
      },
      {
        name: "Plain Rice",
        price: 100,
        category: "rice",
        isAvailable: true,
        recipe: [
          { ingredient: invMap["Rice"], quantityNeeded: 200 }
        ]
      }
    ];
    
    // Clear old menu items and create new ones
    await MenuItem.deleteMany({});
    const createdMenu = await MenuItem.insertMany(menuItems);
    
    console.log(`✅ Created ${createdMenu.length} menu items`);
    
    // Show what was created
    console.log("\n📋 MENU CREATED:");
    console.log("=================");
    createdMenu.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ₹${item.price} (${item.category})`);
      console.log(`   ID: ${item._id}`);
    });
    
    console.log("\n🎉 SEEDING COMPLETE!");
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Restart your server: Ctrl+C, then 'node server.js'");
    console.log("2. Check menu items: GET http://localhost:3000/menu-items");
    console.log("3. Reserve a table: PUT /table/reserve/1");
    console.log("4. Place order: POST /order with menu item IDs");
    
    mongoose.disconnect();
    
  } catch (error) {
    console.error("❌ Seeding error:", error);
    mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedMenu();