// src/app.ts
import express from "express";
import { estimateRide } from "./controllers/RideController";

const app = express();
app.use(express.json());

app.post("/ride/estimate", estimateRide);

export default app;
