"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const RequireAuth_1 = require("../middleware/RequireAuth");
const router = express_1.default.Router();
router.post("/signup", user_controller_1.signUp);
router.post("/login", user_controller_1.login);
router.get("/profile/", RequireAuth_1.requierAuth, user_controller_1.getProfile);
router.put("/profile/", RequireAuth_1.requierAuth, user_controller_1.updateProfile);
router.put("/profile/qr", RequireAuth_1.requierAuth, user_controller_1.setQrPassword);
router.post("/profile/qr/:id", user_controller_1.checkQrPassword);
router.post("/profile/forgotpassword", user_controller_1.forgotPassword);
router.post("/profile/resetpassword", user_controller_1.resetPassword);
exports.default = router;
