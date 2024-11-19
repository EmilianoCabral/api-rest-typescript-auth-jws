import Express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userControllers";

const Router = Express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return 
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error en la autenticación: ", err);
      return res.status(403).json({ error: "No tienes acceso a este recurso" });
    }
    next();
  });
};

Router.post("/", authenticateToken, createUser);
Router.get("/", authenticateToken, getAllUsers);
Router.get("/:id", authenticateToken, getUserById);
Router.put("/:id", authenticateToken, updateUser);
Router.delete("/:id", authenticateToken, deleteUser);

export default Router;
