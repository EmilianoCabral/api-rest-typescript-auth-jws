import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/userModel";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(404).json({ message: "El email es obligatorio" });
    }
    if (!password) {
      res.status(404).json({ message: "El password es obligatorio" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (error: any) {
    if (error?.code === "p2002" && error?.meta?.target?.includes("email")) {
      res.status(404).json({ message: "El mail ingresado ya existe" });
    }
    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe mas tarde" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(500).json({ error: "El usuario no fue encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe mas tarde" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { email, password } = req.body;
  try {
    let dataToUpdate: any = { ...req.body };
    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });
    res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "p2002" && error?.meta?.includes("email")) {
      res.status(400).json({ error: "El email ingresado ya existe" });
    } else if (error?.code == "p2025") {
      res.status(404).json("Usuario no encontrado");
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error, pruebe mas tarde" });
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.delete({
      where: {
        id: userId,
      },
    });
    res
      .status(200)
      .json({
        message: " El usuario a sido eliminado",
      })
      .end();
  } catch (error: any) {
    if (error?.code == "p2025") {
        res.status(404).json("Usuario no encontrado");
      } else {
        console.log(error);
        res.status(500).json({ error: "Hubo un error, pruebe mas tarde" });
      }
  }
};
