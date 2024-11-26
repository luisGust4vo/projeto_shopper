import { Client } from "@googlemaps/google-maps-services-js";
import { AppDataSource } from "../data-source";
import { Driver } from "../entities/Driver";
import { RideEstimateDTO } from "../dtos/RideEstimateDTO";

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
  const distance = leg.distance.value / 1000; // Convertendo para quilômetros
  const duration = leg.duration.text; // A duração da viagem

  // Buscando motoristas no banco de dados que têm uma distância mínima adequada
  const availableDrivers = await AppDataSource.getRepository(Driver)
    .createQueryBuilder("driver")
    .where("driver.minDistance <= :distance", { distance })
    .getMany();

  // Calculando o custo total para cada motorista e retornando a lista
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

  // Ordenando os motoristas pelo custo total de menor para maior
  const sortedDrivers = driverList.sort(
    (a, b) => parseFloat(a.total_cost) - parseFloat(b.total_cost)
  );

  // Retornando os dados da estimativa de viagem e motoristas disponíveis
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
