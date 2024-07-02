"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prescription_controller_1 = require("../controllers/prescription.controller");
const RequireAuth_1 = require("../middleware/RequireAuth");
const RequreQRAuth_1 = require("../middleware/RequreQRAuth");
const router = express_1.default.Router();
router.post("/", RequireAuth_1.requierAuth, prescription_controller_1.addPrescription);
router.get("/", RequireAuth_1.requierAuth, prescription_controller_1.getPrescriptions);
router.get("/qr/:id", RequreQRAuth_1.RequireQRAuth, prescription_controller_1.getQRPrescriprion);
router.get("/p/:prescriptionId", prescription_controller_1.getSinglePrescription);
router.delete("/p/:prescriptionId", prescription_controller_1.deletePrescription);
router.put("/p/:id", RequireAuth_1.requierAuth, prescription_controller_1.updatePrescription);
exports.default = router;
