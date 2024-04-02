require('dotenv').config()

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/v1/auth", require("./routes/authRoutes"));
app.use("/v1/locations", require("./routes/locationRoutes"));
app.use("/v1/products", require("./routes/productsRoutes"));
app.use("/v1/storages", require("./routes/storageRoutes"));

async function checkAndCreateAdminUser() {
  try {
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      const adminUser = new User({
        email: "admin@admin.com",
        password: "admin",
        roles: ["operator", "observer"]
      });
      await adminUser.save();
    }
  } catch (error) {
    console.error("Error verifying and creating admin user:", error);
  }
}

// Execute the method to check and create the administrator user when starting the application
checkAndCreateAdminUser();
module.exports = app;
