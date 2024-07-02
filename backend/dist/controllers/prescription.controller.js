"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQRPrescriprion = exports.deletePrescription = exports.updatePrescription = exports.getSinglePrescription = exports.getPrescriptions = exports.addPrescription = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const util_1 = require("../lib/util");
const addPrescription = async (req, res) => {
    const id = req.user.id;
    const { administrationMethod, consumptionSchedule, dailyQuantity, medicationName, numberOfDailyDoses, diagnosis, treatmentGoal, expiryDate, issueDate, doctorRut, } = req.body;
    try {
        const doctorExist = await PrismaClient_1.default.doctor.findUnique({
            where: {
                rut: doctorRut,
            },
        });
        if (!doctorExist) {
            throw Error("Doctor does not exist. Please enter doctor's RUT that is in the database");
        }
        const newPrescription = await PrismaClient_1.default.prescription.create({
            data: {
                userId: id,
                doctorRut,
                administrationMethod,
                consumptionSchedule,
                dailyQuantity,
                diagnosis,
                expiryDate: (0, util_1.convertToISODate)(expiryDate),
                issueDate: (0, util_1.convertToISODate)(issueDate),
                medicationName,
                numberOfDailyDoses,
                treatmentGoal,
            },
        });
        res.send(newPrescription);
    }
    catch (error) {
        // @ts-ignore
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.addPrescription = addPrescription;
// get prescriptions for a certain patient
const getPrescriptions = async (req, res) => {
    const id = req.user.id;
    try {
        const prescription = await PrismaClient_1.default.prescription.findMany({
            where: {
                userId: id,
            },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                        id: true,
                    },
                },
                doctor: true,
            },
        });
        res.send(prescription);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.getPrescriptions = getPrescriptions;
const getSinglePrescription = async (req, res) => {
    const { prescriptionId } = req.params;
    try {
        const prescription = await PrismaClient_1.default.prescription.findUnique({
            where: {
                id: parseInt(prescriptionId),
            },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                        id: true,
                    },
                },
                doctor: true,
            },
        });
        res.send(prescription);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.getSinglePrescription = getSinglePrescription;
// update prescription
const updatePrescription = async (req, res) => {
    const { id: prescriptionId } = req.params;
    const { prescription } = req.body;
    console.log(prescription);
    try {
        const updatedPrescription = await PrismaClient_1.default.prescription.update({
            where: {
                id: parseInt(prescriptionId),
            },
            data: {
                ...prescription,
                issueDate: (0, util_1.convertToISODate)(prescription.issueDate),
                expiryDate: (0, util_1.convertToISODate)(prescription.expiryDate),
            },
        });
        res.send(updatedPrescription);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.updatePrescription = updatePrescription;
const deletePrescription = async (req, res) => {
    const { prescriptionId } = req.params;
    try {
        const deletePrescription = await PrismaClient_1.default.prescription.delete({
            where: { id: parseInt(prescriptionId) },
        });
        res.send(deletePrescription);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.deletePrescription = deletePrescription;
const getQRPrescriprion = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await PrismaClient_1.default.prescription.findUnique({
            where: { id: parseInt(id) },
            include: { user: true, doctor: true },
        });
        if (!prescription) {
            throw Error("Prescription not found");
        }
        res.send(prescription);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.getQRPrescriprion = getQRPrescriprion;
