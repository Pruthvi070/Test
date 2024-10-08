let mongoose = require("mongoose");

let schema1 = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true }, 
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String, required: true }, 
    course: { 
        type: [String], 
        default: []
    }
}, { timestamps: true }); 

let modelEmployeeRegister = mongoose.model("modelEmployeeRegister1", schema1);

module.exports = modelEmployeeRegister;
