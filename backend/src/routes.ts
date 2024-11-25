import express, { Request, Response } from "express";
import { Client } from "@googlemaps/google-maps-services-js";

const app = express();
const client = new Client({});

app.use(express.json());

const GOOGLE_API_KEY = "Sua-Chave-API-Google-Maps-Aqui"; // Substitua pela sua chave de API

// Simulação de motoristas disponíveis
const drivers = [
  {
    id: "1",
    name: "Motorista A",
    description: "Motorista experiente",
    car: "Carro 1",
    rating: 4.5,
    minDistance: 5,
    pricePerKm: 2.0,
  },
  {
    id: "2",
    name: "Motorista B",
    description: "Motorista rápido",
    car: "Carro 2",
    rating: 4.8,
    minDistance: 3,
    pricePerKm: 2.5,
  },
  {
    id: "3",
    name: "Motorista C",
    description: "Motorista amigável",
    car: "Carro 3",
    rating: 4.0,
    minDistance: 10,
    pricePerKm: 1.8,
  },
];

app.post("/ride/estimate", async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination) {
    return res
      .status(400)
      .json({ error: "customer_id, origin, and destination are required." });
  }

  try {
    // Chama a API de direções do Google Maps
    const response = await client.directions({
      params: {
        origin: origin, // Aqui o 'origin' pode ser uma string ou LatLng
        destination: destination, // Aqui o 'destination' pode ser uma string ou LatLng
        key: GOOGLE_API_KEY,
      },
    });

    // Pega a primeira rota retornada
    const route = response.data.routes[0];
    const leg = route.legs[0];
    const distance = leg.distance.value / 1000; // Distância em km
    const duration = leg.duration.text;

    const availableDrivers = drivers.filter(
      (driver) => driver.minDistance <= distance
    );

    // Calcula o valor total da corrida para cada motorista
    const driverList = availableDrivers.map((driver) => {
      const totalCost = distance * driver.pricePerKm;
      return {
        id: driver.id,
        name: driver.name,
        description: driver.description,
        car: driver.car,
        rating: driver.rating,
        total_cost: totalCost.toFixed(2), // valor total formatado
      };
    });

    // Ordena os motoristas pelo valor total (mais barato primeiro)
    const sortedDrivers = driverList.sort(
      (a, b) => parseFloat(a.total_cost) - parseFloat(b.total_cost)
    );

    // Retorna a resposta conforme solicitado
    return res.json({
      customer_id,
      origin,
      destination,
      origin_latitude: leg.start_location.lat,
      origin_longitude: leg.start_location.lng,
      destination_latitude: leg.end_location.lat,
      destination_longitude: leg.end_location.lng,
      distance: leg.distance.text,
      duration,
      drivers: sortedDrivers,
      google_route_response: route, // Retorna a resposta completa da API do Google Maps
    });
  } catch (error) {
    console.error("Erro ao calcular a rota:", error);
    return res.status(500).json({ error: "Erro ao calcular a rota." });
  }
});

app.listen(3333, () => {
  console.log("Server running on port 3333");
});
