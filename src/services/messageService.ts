import API_BASE_URL from "../config/api";

export interface Message {
  id: string;
  text: string;
  from: string; // UID del remitente
  to: string;   // UID del destinatario
  timestamp: string;
  isOwn: boolean;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data?: Message;
}

// Enviar mensaje
export const sendMessage = async (
  text: string,
  to: string,
  token: string
): Promise<SendMessageResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, to }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error enviando mensaje");

    return { success: true, message: data.message, data: data.data };
  } catch (error: any) {
    console.error("MessageService.sendMessage:", error);
    return { success: false, message: error.message };
  }
};

// Obtener mensajes de usuario logueado
export const getUserMessages = async (token: string): Promise<Message[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/message`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error obteniendo mensajes");
    return data.messages;
  } catch (error: any) {
    console.error("MessageService.getUserMessages:", error);
    return [];
  }
};
