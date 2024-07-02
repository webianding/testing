import express from "express";
import { addDoctor } from "../controllers/doctors.controller";



const router = express.Router();
router.post("/", addDoctor);
// router.get("/", getDoctors);

export default router;
