import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requierAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      throw Error("Token required. Please sign in");
      // return res.status(401).json({ message: "Authorization token is missing" });
    }

    // Verify the token
    const decodedToken = await jwt.verify(token, process.env.SECRET as string);

    // If verification is successful, attach the decoded payload to the request object
    //   @ts-ignore
    req.user = decodedToken as JwtPayload;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};
