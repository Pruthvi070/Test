const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt"); 
const registeredUsers = require("./models/registeredUsers");
const modelEmployeeRegister = require("./models/modelEmployeeRegister");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection
const mongoURI = "mongodb+srv://Test:55667788@demo.hagej.mongodb.net/?retryWrites=true&w=majority&appName=Demo";
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas..."))
    .catch((error) => console.log("Problem connecting to MongoDB Atlas:", error));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Public/Images'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

const upload = multer({ storage });

// Serve static files from the Public directory
app.use('/Public', express.static(path.join(__dirname, 'Public')));

// Registration form data handling with password hashing
app.post("/register", async (req, res) => {
    try {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 rounds of salting

        const dataForDB = new registeredUsers({
            email: req.body.email,
            cnfPassword: hashedPassword, // Store the hashed password
            ...req.body // Store other data
        });

        await dataForDB.save();
        res.json("Input stored in DB successfully.");
    } catch (error) {
        if (error.code === 11000) {
            res.json("Email already registered.");
        } else {
            console.error("Error during registration:", error);
            res.status(500).json("Data cannot be saved, problem at saving time.");
        }
    }
});

// Handling login action with bcrypt password comparison
app.post("/login", async (req, res) => {
    try {
        const user = await registeredUsers.findOne({ email: req.body.email });
        if (user) {
            // Compare hashed password with the password from the request
            const isMatch = await bcrypt.compare(req.body.password, user.cnfPassword);
            if (isMatch) {
                res.json({ "status": "success", "id": user._id });
            } else {
                res.json({ "status": "fail" }); // Incorrect password
            }
        } else {
            res.json({ "status": "noUser" }); // User not found
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ "status": "error", "message": "Server error" });
    }
});

// Respond data to the Dashboard component
app.get("/user/:ID", async (req, res) => {
    try {
        const user = await registeredUsers.findOne({ _id: req.params.ID });
        res.json(user.name);
    } catch (error) {
        console.error("Problem at retrieving user from Express:", error);
        res.status(500).json("Server error");
    }
});

// Storing create employee form data
app.post("/employees", upload.single("image"), async (req, res) => {
    try {
        const existingUser = await modelEmployeeRegister.findOne({ email: req.body.email });
        if (existingUser) {
            return res.json("Email already registered.");
        }

        const dataForDB = new modelEmployeeRegister({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            designation: req.body.designation,
            gender: req.body.gender,
            course: req.body.course,
            image: req.file.filename
        });

        await dataForDB.save();
        res.json("Input stored in DB successfully.");
    } catch (error) {
        console.error("Error saving employee:", error);
        res.status(500).json("Data cannot be saved, problem at saving time.");
    }
});

// Responding employee list
app.get("/employee-list", async (req, res) => {
    try {
        const employees = await modelEmployeeRegister.find();
        res.send(employees);
    } catch (error) {
        console.error("Error retrieving employee list:", error);
        res.status(500).send("Error retrieving employee list.");
    }
});

// Edit employee send data
app.get("/employee-list/:ID", async (req, res) => {
    try {
        const employee = await modelEmployeeRegister.findOne({ _id: req.params.ID });
        if (employee) {
            res.send(employee);
        } else {
            res.status(404).send("Employee not found.");
        }
    } catch (error) {
        console.error("Error retrieving employee:", error);
        res.status(500).send("Error retrieving employee.");
    }
});

// Edit employee update values
app.put("/employee-list/:ID", upload.single('image'), async (req, res) => {
    try {
        await modelEmployeeRegister.updateOne({ _id: req.params.ID }, req.body);
        res.send("Successfully updated data.");
    } catch (error) {
        console.error("Error at update API:", error);
        res.status(500).send("Error at update API.");
    }
});

// Delete employee
app.delete("/employee-list/:ID", async (req, res) => {
    try {
        await modelEmployeeRegister.deleteOne({ _id: req.params.ID });
        res.send("User deleted.");
    } catch (error) {
        console.error("Problem at deletion:", error);
        res.status(500).send("Problem at deletion.");
    }
});

app.listen(4001, () => {
    console.log("Server listening at 4001...");
});
