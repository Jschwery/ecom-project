import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export function authorizeRole(role: Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.header("Authorization");
    if (!bearerHeader) {
      return res.status(401).send("Access Denied");
    }
    const token = bearerHeader.split(" ")[1];
    try {
      const verified: any = jwt.verify(token, process.env.JWT_SECRET as string);

      if (verified.role !== role) {
        return res.status(403).send("Forbidden");
      }

      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  };
}
