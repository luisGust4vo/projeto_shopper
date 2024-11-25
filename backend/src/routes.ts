import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const client = new Client({});
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? "default-key";

client
  .directions({
    params: {
      origin: "São Paulo, SP",
      destination: "Rio de Janeiro, RJ",
      key: GOOGLE_API_KEY,
    },
  })
  .then((response) => {
    console.log("Resposta da API", response.data);
  })
  .catch((error) => {
    console.error("Erro", error.response ? error.response.data : error.message);
  });
