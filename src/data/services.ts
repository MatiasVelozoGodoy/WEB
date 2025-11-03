import type { Service } from "../types"
import reason from "../assets/images/reasons.png";
import reason2 from "../assets/images/reasons2.png";
import reason3 from "../assets/images/reason3.png";

export const services: Service[] = [
  {
    id: "1",
    title: "NO ESPERES A SENTIR DOLOR",
    description: "Ningún dolor es normal. Una visita al odontólogo cada seis meses puede ahorrar tratos raros.",
    image: reason,
  },
  {
    id: "2",
    title: "PREVENCIÓN",
    description: "No es necesario tener un plan de tratamiento para cuidar tu salud bucal: la prevención es tu mejor aliado.",
    image: reason2,
  },
  {
    id: "3",
    title: "LIMPIEZA PROFESIONAL",
    description:
      "Aunque mantengas una buena higiene bucal diaria, una limpieza profesional es clave para prevenir enfermedades.",
    image: reason3,
  },
]
