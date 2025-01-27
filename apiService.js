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
  submitComplaint: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/complaints`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getComplaints: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/complain`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  submitComplaintReply: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/complaintsreply`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getComplaintReplies: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/complaintsreplies`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;