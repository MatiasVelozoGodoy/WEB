import axios from "axios";
import API_BASE_URL from "../config/api";
import { getAuthToken } from "./authService";

export interface StockItem {
  id?: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  state?: boolean;
}

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

export const getStock = async (): Promise<StockItem[]> => {
  const res = await axios.get(`${API_BASE_URL}/stock`, authHeaders());
  return res.data;
};

export const createStock = async (data: StockItem) => {
  const res = await axios.post(`${API_BASE_URL}/stock`, data, authHeaders());
  return res.data;
};

export const updateStock = async (id: string, data: StockItem) => {
  const res = await axios.put(`${API_BASE_URL}/stock/${id}`, data, authHeaders());
  return res.data;
};

export const deleteStock = async (id: string) => {
  const res = await axios.put(`${API_BASE_URL}/stock/delete/${id}`, {}, authHeaders());
  return res.data;
};
