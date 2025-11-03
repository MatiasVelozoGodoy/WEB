import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./DashboardLayout.module.scss";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "cliente" | "admin";
  userName: string;
  userRole: string;
  userAvatar?: string;
}

const DashboardLayout = ({ children, userType, userName, userRole, userAvatar }: DashboardLayoutProps) => {
  const { pathname } = useLocation();

  const getTitle = () => {
    if (pathname.startsWith("/dashboard/admin")) {
      const seg = pathname.replace(/\/+$/, "").split("/")[3] || "";
      const map: Record<string, string> = {
        turnos: "Turnos",
        pacientes: "Lista de Pacientes",
        stock: "Gestión de Stock",
        estadisticas: "Estadísticas",
        recordatorios: "Recordatorios",
        mensajes: "Mensajes",
        pagos: "Pagos",
        "": "Tablero General",
      };
      return map[seg] ?? "Tablero General";
    }
    if (pathname.startsWith("/dashboard/paciente")) {
      const seg = pathname.replace(/\/+$/, "").split("/")[3] || "";
      const map: Record<string, string> = {
        turnos: "Mis Turnos",
        tratamiento: "Mi Tratamiento Actual",
        historia: "Mi Historia Clínica",
        mensajes: "Mensajes",
        "": "Inicio",
      };
      return map[seg] ?? "Inicio";
    }
    return "Dashboard";
  };

  const title = getTitle();

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar userType={userType} userName={userName} userRole={userRole} userAvatar={userAvatar} />
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.crumb}>
            <HomeIcon size={16} />
            <span>Inicio</span>
          </div>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
