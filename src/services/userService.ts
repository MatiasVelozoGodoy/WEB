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

export const getUsers = async (token: string) => {
  const res = await axios.get(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (id: string, data: any, token: string) => {
  const res = await axios.put(`${API_BASE_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (id: string, token: string) => {
  const res = await axios.put(`${API_BASE_URL}/users/delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


