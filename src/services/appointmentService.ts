import axios, { AxiosResponse } from "axios";
import API_BASE_URL from "../config/api";

export type AppointmentPayload = {
  clientId: string;
  date: string; // ISO string
  insurance?: string;
  reason?: string;
  state?: "pendiente" | "completado" | "cancelado";
};

// Convierte fecha + hora a ISO
export const combineDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.toISOString();
};

export const createAppointment = async (data: AppointmentPayload, token: string) => {
  const res: AxiosResponse = await axios.post(`${API_BASE_URL}/appointments`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserAppointments = async (token: string) => {
  const res = await axios.get(`${API_BASE_URL}/appointments/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // asumimos que es un array de turnos
};

export const cancelAppointment = async (id: string, token: string) => {
  const res = await axios.put(
    `${API_BASE_URL}/appointments/cancel/${id}`,
    { state: "cancelado" }, // 👈 le mandamos sólo el campo que queremos cambiar
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};