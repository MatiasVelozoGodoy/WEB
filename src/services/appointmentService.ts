// src/services/appointmentService.ts
import API_BASE_URL from "../config/api";

export interface AppointmentData {
  date: string; // ISO string
  time: string; // "HH:mm"
  file: File;
  userId?: string;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  id?: string;
}

// Crear turno con comprobante
export const bookAppointment = async (
  data: AppointmentData,
  token: string // 🔹 ahora obligatorio para enviar token
): Promise<AppointmentResponse> => {
  try {
    if (!token) throw new Error("Token de autenticación requerido");

    const formData = new FormData();
    formData.append("date", data.date);
    formData.append("time", data.time);
    formData.append("file", data.file);

    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al crear turno");

    return { success: true, message: "Turno agendado correctamente", id: result.id };
  } catch (error: any) {
    console.error("AppointmentService.bookAppointment:", error);
    return { success: false, message: error.message };
  }
};

// Traer todos los turnos (ocupados) para bloquear horarios
export const getAppointments = async (): Promise<Array<{ date: string; time: string }>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al obtener turnos");
    return data; // Debe retornar array [{ date: string, time: string }]
  } catch (error: any) {
    console.error("AppointmentService.getAppointments:", error);
    return [];
  }
};

// Traer turnos del usuario logueado
export const getUserAppointments = async (token: string): Promise<Array<{ date: string; time: string }>> => {
  try {
    if (!token) throw new Error("Token de autenticación requerido");

    const res = await fetch(`${API_BASE_URL}/appointments/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al obtener turnos");
    return data;
  } catch (error: any) {
    console.error("AppointmentService.getUserAppointments:", error);
    return [];
  }
};
