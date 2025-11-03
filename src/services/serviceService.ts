import axios, { AxiosResponse } from "axios";
import API_BASE_URL from "../config/api";
import type { DetailedService } from "../types";

export interface Service {
  id?: string;
  title: string;
  description: string;
  category: string;
  image: string;
  benefits?: string[];
  features?: string[];
  state?: boolean;
}

export async function getAllServices(): Promise<Service[]> {
  const response: AxiosResponse<Service[]> = await axios.get(`${API_BASE_URL}/service`);
  return response.data;
}

export const getActiveServices = async (): Promise<DetailedService[]> => {
  const response = await axios.get<DetailedService[]>(`${API_BASE_URL}/service?state=true`);
  return response.data; // ya viene con category como string
};

export const updateService = async (
  authToken: string,
  serviceId: string,
  serviceData: Partial<Service>
): Promise<Service> => {
  const response: AxiosResponse<Service> = await axios.put(
    `${API_BASE_URL}/service/${serviceId}`,
    serviceData,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
};

export const newService = async (
  authToken: string,
  serviceData: Service
): Promise<Service> => {
  const response: AxiosResponse<Service> = await axios.post(
    `${API_BASE_URL}/service/`,
    serviceData,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
};

export const deleteService = async (
  authToken: string,
  serviceId: string
): Promise<any> => {
  const response: AxiosResponse<any> = await axios.put(
    `${API_BASE_URL}/service/deleted/${serviceId}`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
};
