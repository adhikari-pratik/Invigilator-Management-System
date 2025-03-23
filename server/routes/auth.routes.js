const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware.protect, authController.getMe);
router.post(
	"/change-password",
	authMiddleware.protect,
	authController.changePassword
);
router.put("/profile", authMiddleware.protect, authController.updateProfile);

module.exports = router;
