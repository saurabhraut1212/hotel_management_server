import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthModel, IUser } from "../models/authModel"; 


export const isUser = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1]; 
  
  if (!token) {
    return res.status(400).json({ error: "Authentication token not found" });
  }

  try {
   
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string); 
    const user: IUser | null = await AuthModel.findById(decoded.id); 

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    
    req.user = user;
    next();  
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  
  if (!req.user || (req.user as IUser).role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  next(); 
};
