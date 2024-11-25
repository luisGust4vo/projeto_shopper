// src/controllers/RideController.ts
import { Request, Response } from "express";
import { calculateRideEstimate } from "../services/RideService";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? "default-key";

export const estimateRide = async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination) {
    return res
      .status(400)
      .json({ error: "customer_id, origin, and destination are required." });
  }

  try {
    const estimate = await calculateRideEstimate(
      { customer_id, origin, destination },
      GOOGLE_API_KEY
    );
    return res.json(estimate);
  } catch (error) {
    console.error("Erro ao calcular a rota:", error);
    return res.status(500).json({ error: "Erro ao calcular a rota." });
  }
};
