import axios from 'axios';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const apiService = {
  loginc: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/loginC`, data);
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
  sendOTP: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/sendOTP`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  verifyOTP: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verifyOTP`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  submitComplaint: async (data) => {
    try {
      console.log('Data being sent to API:', data);
      const response = await axios.post(`${API_URL}/auth/complaints`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  submitFiles: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/submitFiles`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateComplaintStatus: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/complaintsstatus`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateComplaintStatusOpen: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/complaintsstatusopen`, data);
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
  getAllComplaintsByDateRange: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/getAllComplaintsByDateRange`, data);
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
      console.error('Error in submitComplaintReply:', error.response ? error.response.data : error.message);
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
  checkMobileNumber: async (mobileNumber) => {
    try {
      const response = await axios.post(`${API_URL}/auth/checkMobile`, { mobileNumber });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getLocalities: async (data, token) => {
    try {
      const response = await axios.post(`${API_URL}/auth/Locality`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getColonies: async (data, token) => {
    try {
      const response = await axios.post(`${API_URL}/auth/Colony`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addColony: async (data, token) => {
    try {
      const response = await axios.post(`${API_URL}/auth/AddColony`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUsers: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/getUsers`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;