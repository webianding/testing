"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requierAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requierAuth = async (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if (!token) {
            throw Error("Token required. Please sign in");
            // return res.status(401).json({ message: "Authorization token is missing" });
        }
        // Verify the token
        const decodedToken = await jsonwebtoken_1.default.verify(token, process.env.SECRET);
        // If verification is successful, attach the decoded payload to the request object
        //   @ts-ignore
        req.user = decodedToken;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
};
exports.requierAuth = requierAuth;
