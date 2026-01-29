const Table = require("../models/table");

const reserveTable = async (req, res) => {
  console.log("=== reserveTable function called ===");
  console.log("req.params:", req.params);
  console.log("req.user:", req.user);
  
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log("ERROR: User not authenticated");
      return res.status(401).json({ 
        message: "Not authenticated",
        debug: { hasUser: !!req.user, userId: req.user?._id }
      });
    }

    const userId = req.user._id;
    const tableNumber = req.params.number;

    console.log("User ID:", userId);
    console.log("Table number from params:", tableNumber);
    console.log("Table number type:", typeof tableNumber);

    // Check if tableNumber is valid
    if (!tableNumber || isNaN(tableNumber)) {
      console.log("ERROR: Invalid table number");
      return res.status(400).json({ 
        message: "Invalid table number",
        received: tableNumber 
      });
    }

    const numTable = parseInt(tableNumber);
    console.log("Parsed table number:", numTable);

    // Log before database query
    console.log("Querying for table with:", { 
      tablenumber: numTable, 
      isAvailable: true 
    });

    // First, let's see what tables exist
    const allTables = await Table.find({});
    console.log("All tables in DB:", allTables.map(t => ({
      number: t.tablenumber,
      available: t.isAvailable
    })));

    const table = await Table.findOneAndUpdate(
      { tablenumber: numTable, isAvailable: true },
      { isAvailable: false, reservedBy: userId },
      { new: true }
    );

    console.log("FindOneAndUpdate result:", table);

    if (!table) {
      console.log("ERROR: Table not found or not available");
      const availableTables = allTables.filter(t => t.isAvailable).map(t => t.tablenumber);
      return res.status(400).json({
        message: "Table not available or does not exist",
        debug: {
          requestedTable: numTable,
          availableTables: availableTables,
          allTables: allTables.length
        }
      });
    }

    console.log("SUCCESS: Table reserved");
    res.status(200).json({
      message: "Table reserved successfully",
      table
    });

  } catch (error) {
    console.error("❌ CRITICAL ERROR in reserveTable:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { reserveTable };