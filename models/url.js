const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;


const mongoose = require('mongoose');
const urlschema= new mongoose.Schema(
  {
    shortId:{
      type:string,
      reqired:true,
    },
    redirectURL:{

    },
    visitHistory:[{timestamp:{type:Number}}],
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users",
    }
    
  }
)
