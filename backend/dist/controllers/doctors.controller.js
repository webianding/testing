"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDoctor = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const util_1 = require("../lib/util");
const addDoctor = async (req, res) => {
    console.log(req.body);
    const { name, rut, medicalRegistryNumber, specialty, phone, address, commune, city, } = req.body;
    try {
        // check if RUT is valid
        if (!(0, util_1.validateRUT)(rut)) {
            throw Error("Enter a valid RUT");
        }
        const newDoctor = await PrismaClient_1.default.doctor.create({
            data: {
                name,
                rut,
                medicalRegistryNumber,
                specialty,
                phone,
                address,
                commune,
                city,
            },
        });
        res.status(201).json(newDoctor);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.addDoctor = addDoctor;
