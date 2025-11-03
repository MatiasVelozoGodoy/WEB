import axios, { AxiosResponse } from "axios";
import API_BASE_URL from "../config/api";

export interface StockItem {
  id?: string;
  product: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  expirationDate?: string | null;
  state?: boolean;
}

// 🔑 Recupera el token almacenado para autorización
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken"); // ✅ consistente con AuthProvider
  if (!token) console.warn("No hay token guardado. Asegurate de loguearte primero.");
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

// 📦 Obtener stock (opcionalmente filtrado por categoría o modelo)
export const getStock = async (
  category?: string,
  model?: string
): Promise<StockItem[]> => {
  const params: Record<string, string> = {};
  if (category) params.category = category;
  if (model) params.model = model;

  try {
    const response = await axios.get(`${API_BASE_URL}/stock`, {
      ...getAuthHeader(),
      params,
    });
    console.log("🌐 [RESPONSE DATA]", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔥 [CATCH] Error al obtener stock: ", error);
    if (error.response) {
      console.log("🌐 [RESPONSE ERROR]", error.response.status, error.response.data);
    }
    throw error;
  }
};

// ➕ Crear nuevo producto (solo admin)
export const createStock = async (data: StockItem): Promise<any> => {
  const response: AxiosResponse<any> = await axios.post(
    `${API_BASE_URL}/stock`,
    data,
    getAuthHeader()
  );
  return response.data;
};

// ✏️ Actualizar producto por ID (solo admin)
export const updateStock = async (
  id: string,
  data: Partial<StockItem>
): Promise<any> => {
  const response: AxiosResponse<any> = await axios.put(
    `${API_BASE_URL}/stock/${id}`,
    data,
    getAuthHeader()
  );
  return response.data;
};

// ❌ Eliminar (borrado lógico)
export const deleteStock = async (id: string): Promise<any> => {
  const response: AxiosResponse<any> = await axios.put(
    `${API_BASE_URL}/stock/delete/${id}`,
    {},
    getAuthHeader()
  );
  return response.data;
};
