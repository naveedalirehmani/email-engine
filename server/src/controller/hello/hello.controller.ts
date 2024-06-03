import { Request, Response } from "express";
import prisma from "../../prisma/index";

export async function sayHello(_: Request, response: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.status(200).json({
      server: "healthy",
      database: "connected",
    });
  } catch (error) {
    response.status(500).json({
      server: "healthy",
      database: "disconnected",
      message: "Database connection failed",
    });
  }
}
