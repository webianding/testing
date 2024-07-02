import { Request, Response } from "express";
import prisma from "../PrismaClient";
import { convertToISODate } from "../lib/util";

// extend request object type to include userId property as string
// interface newRequest extends Request {
//   user: JwtPayload
// }

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        id: string;
      };
    }
  }
}

export const addPrescription = async (req: Request, res: Response) => {
  const id = req.user.id;

  const {
    administrationMethod,
    consumptionSchedule,
    dailyQuantity,
    medicationName,
    numberOfDailyDoses,
    diagnosis,
    treatmentGoal,
    expiryDate,
    issueDate,
    doctorRut,
  } = req.body;

  try {
    const doctorExist = await prisma.doctor.findUnique({
      where: {
        rut: doctorRut,
      },
    });

    if (!doctorExist) {
      throw Error(
        "Doctor does not exist. Please enter doctor's RUT that is in the database"
      );
    }

    const newPrescription = await prisma.prescription.create({
      data: {
        userId: id,
        doctorRut,
        administrationMethod,
        consumptionSchedule,
        dailyQuantity,
        diagnosis,
        expiryDate: convertToISODate(expiryDate),
        issueDate: convertToISODate(issueDate),
        medicationName,
        numberOfDailyDoses,
        treatmentGoal,
      },
    });

    res.send(newPrescription);
  } catch (error) {
    // @ts-ignore
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

// get prescriptions for a certain patient
export const getPrescriptions = async (req: Request, res: Response) => {
  const id = req.user.id;

  try {
    const prescription = await prisma.prescription.findMany({
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
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

export const getSinglePrescription = async (req: Request, res: Response) => {
  const { prescriptionId } = req.params;

  try {
    const prescription = await prisma.prescription.findUnique({
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
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

// update prescription

export const updatePrescription = async (req: Request, res: Response) => {
  const { id: prescriptionId } = req.params;

  const { prescription } = req.body;

  console.log(prescription);

  try {
    const updatedPrescription = await prisma.prescription.update({
      where: {
        id: parseInt(prescriptionId),
      },
      data: {
        ...prescription,
        issueDate: convertToISODate(prescription.issueDate),
        expiryDate: convertToISODate(prescription.expiryDate),
      },
    });

    res.send(updatedPrescription);
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

export const deletePrescription = async (req: Request, res: Response) => {
  const { prescriptionId } = req.params;

  try {
    const deletePrescription = await prisma.prescription.delete({
      where: { id: parseInt(prescriptionId) },
    });

    res.send(deletePrescription);
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

export const getQRPrescriprion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(id) },
      include: { user: true, doctor: true },
    });
    if (!prescription) {
      throw Error("Prescription not found");
    }

    res.send(prescription);
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};
