const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// Registration route
router.post("/register", userController.register);

// Login route
router.post("/login", userController.login);

// Get users
router.get("/users", userController.geAllUsers);

// Update the password
router.post("/update-password", verifyToken, userController.updatePassword);

module.exports = router;
