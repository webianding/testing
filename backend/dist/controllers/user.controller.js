"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.checkQrPassword = exports.setQrPassword = exports.updateProfile = exports.getProfile = exports.login = exports.signUp = void 0;
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("../lib/util");
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const signUp = async (req, res) => {
    const { email, password, firstName, lastName, address, age, city, commune, dateOfBirth, phone, rut, } = req.body;
    try {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }
        if (!validator_1.default.isEmail(email)) {
            throw new Error("Invalid email");
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw new Error("Password not strong enough");
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // check if email is used
        const exist = await PrismaClient_1.default.user.findUnique({
            where: { email },
        });
        if (exist) {
            throw Error("An account with the same email already exists");
        }
        const user = await PrismaClient_1.default.user.create({
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
        const token = (0, util_1.generateJwtToken)({
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
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    const { email, password } = req.body;
    let errorCode = 400;
    try {
        if (!email || !password) {
            errorCode = 401;
            throw new Error("Email and password are required");
        }
        const user = await PrismaClient_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            errorCode = 401;
            throw Error("No account with that email");
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            errorCode = 401;
            throw Error("Invalid password");
        }
        const token = (0, util_1.generateJwtToken)({
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
    }
    catch (error) {
        if (error instanceof Error)
            res.status(errorCode).json({ error: error.message });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    // const { id } = req.params;
    // @ts-ignore
    const id = req.user.id;
    try {
        const profile = await PrismaClient_1.default.user.findUnique({
            where: { id },
        });
        res.send(profile);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
};
exports.getProfile = getProfile;
// update user profile
const updateProfile = async (req, res) => {
    const id = req.user.id;
    const { updateProfile } = req.body;
    try {
        const rutExist = await PrismaClient_1.default.user.findUnique({
            where: {
                rut: updateProfile.rut,
            },
        });
        if (rutExist?.rut === updateProfile.rut &&
            rutExist?.email !== updateProfile.email) {
            throw Error("Rut already in use by another user");
        }
        const updatedUser = await PrismaClient_1.default.user.update({
            where: {
                id,
            },
            data: {
                ...updateProfile,
                dateOfBirth: updateProfile.dateOfBirth
                    ? (0, util_1.convertToISODate)(updateProfile.dateOfBirth)
                    : null,
            },
        });
        res.send(updatedUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
};
exports.updateProfile = updateProfile;
// set QR password
const setQrPassword = async (req, res) => {
    const { qrPassword } = req.body;
    const id = req.user.id;
    try {
        if (qrPassword === null) {
            const user = await PrismaClient_1.default.user.update({
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
        }
        else {
            if (!qrPassword) {
                throw new Error("qrPassword is required");
            }
            const isStrongPassword = validator_1.default.isStrongPassword(qrPassword);
            if (!isStrongPassword) {
                throw Error("Password not strong enough");
            }
            const saltRounds = 10;
            const hashedQrPassword = await bcrypt_1.default.hash(qrPassword, saltRounds);
            const user = await PrismaClient_1.default.user.update({
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
};
exports.setQrPassword = setQrPassword;
// check qr password to confirm authenticity
const checkQrPassword = async (req, res) => {
    const { id } = req.params;
    const { password, secured } = req.body;
    try {
        const user = await PrismaClient_1.default.user.findUnique({
            where: { id },
        });
        if (secured === "false" && !user?.qrPassword) {
            const qrToken = await (0, util_1.generateQRJwtToken)({
                user: user?.email,
                name: `${user?.firstName} ${user?.lastName}`,
            });
            res.send({ authenticated: true, qrToken: qrToken });
        }
        else {
            if (user) {
                const passwordMatch = await bcrypt_1.default.compare(password, user.qrPassword ? user.qrPassword : "");
                if (!passwordMatch) {
                    // errorCode = 401;
                    throw Error("Invalid password");
                }
                const qrToken = await (0, util_1.generateQRJwtToken)({
                    user: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                });
                res.send({ authenticated: true, qrToken: qrToken });
            }
            else {
                throw Error("User does not exist");
            }
        }
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.checkQrPassword = checkQrPassword;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // Initialize nodemailer transporter
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "henryhashemi04@gmail.com",
            pass: "xgixmgofafxyrgoo",
        },
    });
    // Secret key for JWT
    const JWT_SECRET = "your_secret_key";
    try {
        const user = await PrismaClient_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw Error("User not found");
        }
        // Generate reset token as a JWT
        const resetToken = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
        // Update user's reset token in the database
        await PrismaClient_1.default.user.update({
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // @ts-ignore
        const email = decoded.email;
        const user = await PrismaClient_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw Error("User not found");
        }
        if (!validator_1.default.isStrongPassword(newPassword)) {
            throw new Error("Password not strong enough");
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(newPassword, saltRounds);
        // Update user's password and clear reset token
        const updatedPassword = await PrismaClient_1.default.user.update({
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
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.resetPassword = resetPassword;
