const Order = require("../models/order");
const MenuItem = require("../models/menuitems");
const Inventory = require("../models/inventory");
const Table = require("../models/table");
const { updateOrderStatus } = require("../service/ooosss");
const { ORDER_STATUS } = require("../utils/orderStatus");
const createOrder = async (req, res) => {
    console.log("=== createOrder called ===");
    
    try {
        const userId = req.user._id;
        const { items } = req.body;

        console.log("User:", userId);
        console.log("Items to order:", items);

        
        const table = await Table.findOne({ 
            reservedBy: userId, 
            isAvailable: false 
        });
        
        console.log("Table found:", table);
        
        if (!table) {
            return res.status(400).json({ 
                message: "Reserve a table first before ordering" 
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                message: "No items provided" 
            });
        }

        let orderItems = [];
        let totalAmount = 0;

        
        for (let item of items) {
            const { menuItemId, quantity } = item;
            
            console.log(`Processing: ${menuItemId}, Quantity: ${quantity}`);
            
        
            const menuItem = await MenuItem.findById(menuItemId)
                .populate("recipe.ingredient");
            
            if (!menuItem) {
                return res.status(404).json({ 
                    message: `Menu item ${menuItemId} not found` 
                });
            }

            console.log(`Found menu item: ${menuItem.name}`);

        
            if (!menuItem.isAvailable) {
                return res.status(400).json({ 
                    message: `${menuItem.name} is out of stock` 
                });
            }

            
            for (let r of menuItem.recipe) {
                if (r.ingredient.quantity < (r.quantityNeeded * quantity)) {
                    return res.status(400).json({ 
                        message: `Insufficient ${r.ingredient.name} for ${menuItem.name}` 
                    });
                }
            }

        
            for (let r of menuItem.recipe) {
                r.ingredient.quantity -= (r.quantityNeeded * quantity);
                await r.ingredient.save();
            }

            
            const itemTotal = menuItem.price * quantity;
            totalAmount += itemTotal;

            orderItems.push({
                menuItems: menuItem._id,
                quantity,
                priceAtOrderTime: menuItem.price
            });
        }

        // Create order
        console.log("Creating order in database...");
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            status: "pending",
            table: table._id
        });

        console.log("✅ Order created successfully:", order._id);
        
        res.status(201).json({ 
            message: "Order placed successfully", 
            order: {
                id: order._id,
                totalAmount: order.totalAmount,
                status: order.status,
                itemsCount: order.items.length,
                tableNumber: table.tablenumber,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error("❌ Order Error:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            message: "Server error during order creation",
            error: error.message 
        });
    }
};
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await updateOrderStatus(
      orderId,
      ORDER_STATUS.CANCELLED
    );

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // <-- THIS answers your main question

    const order = await updateOrderStatus(orderId, status);

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = { createOrder, cancelOrder,
  updateOrderStatusController };