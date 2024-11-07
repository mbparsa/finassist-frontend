import axios from 'axios';

const API_URL = 'http://localhost:8000/users/';

export const createUser = async (user) => {
  return axios.post(API_URL, user);
};

export const getUsers = async (skip = 0, limit = 10) => {
    try {
      return await axios.get(API_URL, {
        params: { skip, limit },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;  // Propagate the error for further handling
    }
  };