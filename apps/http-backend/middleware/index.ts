import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "../src/config";

interface Payload extends JwtPayload {
  userId: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.headers.authorization) {
      res.status(403).json({ message: "Auth Token Missing" });
      return;
    }

    const header = req.headers["authorization"];

    const decoded = jwt.verify(header as string, JWT_PASSWORD) as Payload;

    req.userId = decoded.userId;

    next();
  } catch (e: any) {
    res.status(403).json({ message: "Access Denied", error: e.message });
  }
}
