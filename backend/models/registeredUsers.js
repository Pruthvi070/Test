let mongoose = require("mongoose");

let schema1 = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    cnfPassword: String,
});

let registeredUsers = mongoose.model("registeredUsers1", schema1);

module.exports = registeredUsers;
