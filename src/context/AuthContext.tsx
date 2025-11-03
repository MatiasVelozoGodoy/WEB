import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { loginUser, registerUser } from "../services/authService";

// Tipos
interface User {
  id: string;
  email: string;
  userType: "admin" | "cliente";
  fullName: string;
  phone?: string;
  dni?: string;
  gender?: string;
  insurance?: string;
  [key: string]: any;
}

interface RegisterData {
  email: string;
  password: string;
  [key: string]: any;
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateCurrentUser: (updatedUserData: Partial<User>) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isClient: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; token?: string; user?: User; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; data?: string; id?: string; error?: string }>;
  logout: () => Promise<{ success: boolean }>;
  error: string | null;
}

// Context: inicializado con undefined, para forzar usar useAuth()
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

// En tu login function del AuthContext, asegúrate de guardar todos los datos:
const login = async (email: string, password: string) => {
  try {
    const data = await loginUser(email, password);
    
    // Guardar TODOS los datos del usuario
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("authToken", data.token);
    
    setCurrentUser(data.user);
    return { success: true, token: data.token, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

  const register = async (userData: RegisterData) => {
    try {
      const response = await registerUser(userData);
      setError(null);
      return { 
        success: true, 
        data: response.message, 
        id: response.id 
      };
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al registrarse";
      setError(message);
      return { 
        success: false, 
        error: message 
      };
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setError(null);
    return { success: true };
  };

  const updateCurrentUser = (updatedUserData: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      
      const updatedUser = { ...prev, ...updatedUserData };
      
      // Actualizar también en localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return updatedUser;
    });
  };

  const value: AuthContextType = {
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.userType === "admin",
    isClient: currentUser?.userType === "cliente",
    login,
    register,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export default AuthContext;