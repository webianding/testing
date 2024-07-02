import { Request, Response } from "express";
import prisma from "../PrismaClient";
import { validateRUT } from "../lib/util";

export const addDoctor = async (req: Request, res: Response) => {
  console.log(req.body);
  const {
    name,
    rut,
    medicalRegistryNumber,
    specialty,
    phone,
    address,
    commune,
    city,
  } = req.body;

  try {
    // check if RUT is valid
    if (!validateRUT(rut)) {
      throw Error("Enter a valid RUT");
    }

    const newDoctor = await prisma.doctor.create({
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
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};
