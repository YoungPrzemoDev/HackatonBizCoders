import { UserInteraction } from "@/app/interfaces/User";
import axios from "axios";
const BASE_URL = "http://172.19.0.129:5041";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
});

export const getRecommendation = async (userId) => {
  try {
    // Wysyłamy `userId` jako parametr zapytania
    console.log("pbieram");
    const response = await axios.get(`${BASE_URL}/recommendation`, {
      params: { userId },
      timeout: 100000,
    });
    //console.log(response.data)
    return response.data; // Oczekujemy tablicy strins
  } catch (error) {
    console.error("Błąd przy pobieraniu rekomendacji:", error);
    throw error;
  }
};

export const sendUser = async (userId) => {
  try {
    console.log("wyslanie user id do backendu", userId);
    const response = await axios.post(`${BASE_URL}/about/${userId}`);
  } catch (error) {
    throw error;
  }
};
export const sendInterraction = async (interaction: UserInteraction) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/userInteraction/`,
      interaction
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending interaction:", error);
  }
};
