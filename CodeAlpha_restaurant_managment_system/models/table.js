const mongoose=require("mongoose");

const tableschema=new mongoose.Schema({
    tablenumber:{
        type:Number,
        required:true,
        unique:true
    },
    capacity:{
        type:Number,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    reservedBy:{type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

module.exports=mongoose.model("Table",tableschema);
