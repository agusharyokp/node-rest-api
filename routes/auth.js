const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");

const authController = require("../controllers/auth");

router.put("/signup", [
    body("name")
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters long"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("Email already exists.");
                }
            });
        })
        .normalizeEmail(),
    body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long"),
], authController.signup);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getStatus);
router.put("/status", isAuth, authController.updateStatus);

module.exports = router;
