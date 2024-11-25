import { Client } from "@googlemaps/google-maps-services-js";
import { RideEstimateDTO } from "../dtos/RideEstimateDTO";
import { AppDataSource } from "../data-source";
import { Driver } from "../entities/Driver";
import { LessThanOrEqual } from "typeorm";

const client = new Client({});

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

  // buscando motoristas no banco de dados
  const driverRepository = AppDataSource.getRepository(Driver);
  const availableDrivers = await driverRepository.find({
    where: {
      minDistance: LessThanOrEqual(distance),
    },
  });

  const driverList = availableDrivers.map((driver) => {
    const totalCost = distance * driver.pricePerKm;
    return {
      id: driver.id,
      name: driver.nome,
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
