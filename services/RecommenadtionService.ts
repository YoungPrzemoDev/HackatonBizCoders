import axios from 'axios';
const BASE_URL = 'http://172.25.161.17:5041';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
  });

  export const getRecommendation = async (userId) => {
    try {
      // Wysyłamy `userId` jako parametr zapytania
      console.log("pbieram")
      const response = await axios.get(`${BASE_URL}/recommendation`, {
        params: { userId },
        timeout: 100000,
      });
      //console.log(response.data)
      return response.data; // Oczekujemy tablicy strins
    } catch (error) {
      console.error('Błąd przy pobieraniu rekomendacji:', error);
      throw error;
    }
  };