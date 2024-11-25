// src/services/RideService.ts
import { Client } from "@googlemaps/google-maps-services-js";
import { RideEstimateDTO } from "../dtos/RideEstimateDTO";

const client = new Client({});
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

export const calculateRideEstimate = async (
  data: RideEstimateDTO,
  googleApiKey: string
) => {
  const { origin, destination } = data;

  const response = await client.directions({
    params: {
      origin,
      destination,
      key: googleApiKey,
    },
  });

  const route = response.data.routes[0];
  const leg = route.legs[0];
  const distance = leg.distance.value / 1000;
  const duration = leg.duration.text;

  const availableDrivers = drivers.filter(
    (driver) => driver.minDistance <= distance
  );

  const driverList = availableDrivers.map((driver) => {
    const totalCost = distance * driver.pricePerKm;
    return {
      id: driver.id,
      name: driver.name,
      description: driver.description,
      car: driver.car,
      rating: driver.rating,
      total_cost: totalCost.toFixed(2),
    };
  });

  const sortedDrivers = driverList.sort(
    (a, b) => parseFloat(a.total_cost) - parseFloat(b.total_cost)
  );

  return {
    origin_latitude: leg.start_location.lat,
    origin_longitude: leg.start_location.lng,
    destination_latitude: leg.end_location.lat,
    destination_longitude: leg.end_location.lng,
    distance: leg.distance.text,
    duration,
    drivers: sortedDrivers,
    google_route_response: route,
  };
};
