import express from "express";
import { login, signUp,getProfile, updateProfile, setQrPassword, checkQrPassword, forgotPassword, resetPassword } from "../controllers/user.controller";
import { requierAuth } from "../middleware/RequireAuth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile/",requierAuth,  getProfile);
router.put("/profile/",requierAuth,  updateProfile);    
router.put("/profile/qr",requierAuth,  setQrPassword);    
router.post("/profile/qr/:id",  checkQrPassword);    
router.post("/profile/forgotpassword",  forgotPassword);    
router.post("/profile/resetpassword", resetPassword);    

export default router;
