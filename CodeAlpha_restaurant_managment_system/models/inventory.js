const mongoose = require("mongoose");

const inverntory= new mongoose.Schema({
    name:{ type:String, required:true},
    category:String,
    quantity:{type:Number, required:true},
    unit:{ type:String, default:"grams"},
 }, {timestamps:true}
);
module.exports=mongoose.model("Inventory", inverntory);