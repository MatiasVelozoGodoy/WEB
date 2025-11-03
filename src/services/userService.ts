import axios, { AxiosResponse } from "axios";
import API_BASE_URL from "../config/api";

export const getCurrentUser = async (authToken: string) => {
  try {
    const response: AxiosResponse = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
