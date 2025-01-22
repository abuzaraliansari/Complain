import axios from 'axios';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const apiService = {
  login: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  signup: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;