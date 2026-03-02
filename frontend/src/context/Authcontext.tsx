import { createContext, useState, useEffect,useContext } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
  };

  const register = async (email: string, password: string) => {
    await apiRegister(email, password);
  };

  const logout = () => {
      localStorage.removeItem("token");
      setToken(null);
    };
    
   

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);