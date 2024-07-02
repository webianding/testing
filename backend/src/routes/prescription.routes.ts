import express from "express";
import {
  addPrescription,
  deletePrescription,
  getPrescriptions,
  getQRPrescriprion,
  getSinglePrescription,
  updatePrescription,
} from "../controllers/prescription.controller";
import { requierAuth } from "../middleware/RequireAuth";
import { RequireQRAuth } from "../middleware/RequreQRAuth";

const router = express.Router();
router.post("/", requierAuth, addPrescription);
router.get("/", requierAuth, getPrescriptions);
router.get("/qr/:id", RequireQRAuth, getQRPrescriprion);
router.get("/p/:prescriptionId", getSinglePrescription);
router.delete("/p/:prescriptionId", deletePrescription);
router.put("/p/:id", requierAuth, updatePrescription);  
export default router;
