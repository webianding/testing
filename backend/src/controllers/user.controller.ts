import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import {
  convertToISODate,
  generateJwtToken,
  generateQRJwtToken,
} from "../lib/util";
import prisma from "../PrismaClient";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const signUp = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    address,
    age,
    city,
    commune,
    dateOfBirth,
    phone,
    rut,
  } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Password not strong enough");
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // check if email is used
    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      throw Error("An account with the same email already exists");
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address,
        age,
        city,
        commune,
        dateOfBirth,
        phone,
        rut,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        address: true,
        age: true,
        city: true,
        commune: true,
        dateOfBirth: true,
        phone: true,
        rut: true,
        createdAt: true,
        qrPassword: true,
      },
    });

    const token = generateJwtToken({
      email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.send({
      user: {
        ...user,
        qrPasswordSet: user.qrPassword ? true : false,
        qrPassword: null,
      },
      token,
    });
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let errorCode = 400;
  try {
    if (!email || !password) {
      errorCode = 401;
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      errorCode = 401;
      throw Error("No account with that email");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      errorCode = 401;

      throw Error("Invalid password");
    }
    const token = generateJwtToken({
      email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.send({
      user: {
        ...user,
        password: null,
        qrPasswordSet: user.qrPassword ? true : false,
        qrPassword: null,
      },
      token,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(errorCode).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  // const { id } = req.params;

  // @ts-ignore
  const id = req.user.id;
  try {
    const profile = await prisma.user.findUnique({
      where: { id },
    });
    res.send(profile);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// update user profile
export const updateProfile = async (req: Request, res: Response) => {
  const id = req.user.id;

  const { updateProfile } = req.body;
  try {
    const rutExist = await prisma.user.findUnique({
      where: {
        rut: updateProfile.rut,
      },
    });

    if (
      rutExist?.rut === updateProfile.rut &&
      rutExist?.email !== updateProfile.email
    ) {
      throw Error("Rut already in use by another user");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateProfile,
        dateOfBirth: updateProfile.dateOfBirth
          ? convertToISODate(updateProfile.dateOfBirth)
          : null,
      },
    });
    res.send(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// set QR password

export const setQrPassword = async (req: Request, res: Response) => {
  const { qrPassword } = req.body;
  const id = req.user.id;
  try {
    if (qrPassword === null) {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          qrPassword,
        },
      });
      res.send({
        user: {
          ...user,
          password: null,
          qrPasswordSet: user.qrPassword ? true : false,
          qrPassword: null,
        },
      });
    } else {
      if (!qrPassword) {
        throw new Error("qrPassword is required");
      }

      const isStrongPassword = validator.isStrongPassword(qrPassword);

      if (!isStrongPassword) {
        throw Error("Password not strong enough");
      }

      const saltRounds = 10;
      const hashedQrPassword = await bcrypt.hash(qrPassword, saltRounds);

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          qrPassword: hashedQrPassword,
        },
      });
      res.send({
        user: {
          ...user,
          password: null,
          qrPasswordSet: user.qrPassword ? true : false,
          qrPassword: null,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// check qr password to confirm authenticity

export const checkQrPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, secured } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (secured === "false" && !user?.qrPassword) {
      const qrToken = await generateQRJwtToken({
        user: user?.email,
        name: `${user?.firstName} ${user?.lastName}`,
      });

      res.send({ authenticated: true, qrToken: qrToken });
    } else {
      if (user) {
        const passwordMatch = await bcrypt.compare(
          password,
          user.qrPassword ? user.qrPassword : ""
        );
        if (!passwordMatch) {
          // errorCode = 401;

          throw Error("Invalid password");
        }

        const qrToken = await generateQRJwtToken({
          user: user.email,
          name: `${user.firstName} ${user.lastName}`,
        });

        res.send({ authenticated: true, qrToken: qrToken });
      } else {
        throw Error("User does not exist");
      }
    }
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Initialize nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "henryhashemi04@gmail.com",
      pass: "xgixmgofafxyrgoo",
    },
  });

  // Secret key for JWT
  const JWT_SECRET = "your_secret_key";
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw Error("User not found");
    }

    // Generate reset token as a JWT
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    // Update user's reset token in the database
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        resetToken: resetToken,
      },
    });

    // Send reset password email
    const mailOptions = {
      from: "henryhashemi04@gmail,com",
      to: email,
      subject: "Reset your password",
      text: `A request was made to reset password for ${email}. Click this link to reset your password: https://recetalegal.cl/resetpassword?token=${resetToken}&email=${email}`,
    };

    const info = await transporter.sendMail(mailOptions);

    res.send({ success: true, info });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      throw Error("Token required");
    }

    if (!newPassword) {
      throw Error("New Password required");
    }

    const JWT_SECRET = "your_secret_key";

    // Verify JWT token

    const decoded = jwt.verify(token, JWT_SECRET);

    // @ts-ignore
    const email = decoded.email;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw Error("User not found");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password not strong enough");
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and clear reset token
    const updatedPassword = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
        resetToken: "",
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};
