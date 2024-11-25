import express, { Request, Response } from "express";
import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";

// Carregar variáveis de ambiente teste
dotenv.config();

const app = express();
const client = new Client({});
app.use(express.json());

// Variáveis de ambiente para segurança
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? "default-key";

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
        key: GOOGLE_API_KEY, // Chave de API
      },
    });

    // Pega a primeira rota retornada
    const route = response.data.routes[0];
    const leg = route.legs[0];
    const distance = leg.distance.value / 1000; // Distância em km
    const duration = leg.duration.text;

    // Latitude e longitude de origem e destino
    const originLat = leg.start_location.lat;
    const originLng = leg.start_location.lng;
    const destinationLat = leg.end_location.lat;
    const destinationLng = leg.end_location.lng;

    // Filtra motoristas disponíveis com base na distância
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
      origin_latitude: originLat,
      origin_longitude: originLng,
      destination_latitude: destinationLat,
      destination_longitude: destinationLng,
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
