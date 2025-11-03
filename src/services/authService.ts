import axios, { AxiosResponse } from "axios";
import API_BASE_URL from "../config/api";

interface LoginResponse {
  token: string;
  user: any;
}

interface RegisterData {
  email: string;
  password: string;
  [key: string]: any;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password }
  );

  const { token, user } = response.data;

  // ✅ Guardamos el token en localStorage para usarlo luego
  if (token) {
    localStorage.setItem("authToken", token);
  }

  // ✅ Guardamos los datos del usuario actual (opcional)
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  return { token, user };
};

export const registerUser = async (userData: RegisterData): Promise<any> => {
  const response: AxiosResponse<any> = await axios.post(
    `${API_BASE_URL}/auth/register`,
    userData
  );
  return response.data;
};

export const forgotPass = async (email: string): Promise<any> => {
  const response: AxiosResponse<any> = await axios.post(
    `${API_BASE_URL}/auth/resetPassword`,
    { email }
  );
  return response.data;
};

// ✅ Nueva función: obtener el token guardado
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// ✅ Nueva función: limpiar la sesión
export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
};
