import type {
  Appointment,
  Patient,
  Treatment,
  Message,
  Notification,
  StockItem,
  DashboardStats,
} from "../types";

// ---------------- Patient-facing ----------------
const patientAppointments: Appointment[] = [
    {
    id: "1",
    date: "15/11/2025",
    time: "14:30",
    reason: "Consulta",
    insurance: "Swiss Medical",
    payment: "Pendiente",
    status: "Pendiente",
  },
  {
    id: "2",
    date: "11/10/2025",
    time: "10:00",
    reason: "Limpieza",
    insurance: "Medifé",
    payment: "Completo",
    status: "Completado",
    receipt: "comprobante.pdf",
  },
  {
    id: "3",
    date: "20/10/2025",
    time: "09:00",
    reason: "Ortodoncia",
    insurance: "Sancor Salud",
    payment: "Cancelado",
    status: "Cancelado",
  },
];

const patientMessages: Message[] = [
  {
    id: "1",
    sender: "Simón Pérez",
    avatar: "/placeholder.svg?height=40&width=40",
    text:
      "Buenas tardes, quisiera consultar por el servicio de ortodoncia. ¿Qué sistemas utilizan y cuáles son los precios? Desde ya, muchas gracias.",
    timestamp: "14:30",
    isOwn: false,
  },
  {
    id: "2",
    sender: "Tú",
    avatar: "/placeholder.svg?height=40&width=40",
    text:
      "¡Hola, Mariel! En Lavalle Odontología Integral utilizamos una variedad de sistemas, dependiendo del caso. Para poder darte una respuesta más precisa, recomendamos generar una consulta. Cualquier duda, estamos a disposición",
    timestamp: "14:35",
    isOwn: true,
  },
];


const patientMessagesSecond: Message[] = [
    {
    id: "1",
    sender: "Tú",
    avatar: "/placeholder.svg?height=40&width=40",
    text: 
    "Buenas tardes, quisiera consultar por el servicio de ortodoncia. ¿Qué sistemas utilizan y cuáles son los precios? Desde ya, muchas gracias.",
    timestamp: "14:35",
    isOwn: true,
  },
  {
    id: "2",
    sender: "Administrador",
    avatar: "/placeholder.svg?height=40&width=40",
     text:
      "¡Hola, Mariel! En Lavalle Odontología Integral utilizamos una variedad de sistemas, dependiendo del caso. Para poder darte una respuesta más precisa, recomendamos generar una consulta. Cualquier duda, estamos a disposición",
   timestamp: "14:30",
    isOwn: false,
  },
];

const patientTreatment: Treatment = {
  patientName: "Francisco Santillán",
  dni: "35712025",
  gender: "Masculino",
  weight: 80,
  age: 25,
  bmi: 24.7,
  height: 180,
  conditions: [
  { name: "Caries dental en molar 1.6", diagnosis: "10/10/2025", date: "10/10/2025" },
  { name: "Gingivitis localizada",      diagnosis: "05/10/2025", date: "05/10/2025" },
  { name: "Bruxismo (desgaste incisal)", diagnosis: "24/09/2025", date: "24/09/2025" },
],
medications: [
  { name: "Ibuprofeno 400 mg",                 dosage: "1 tableta cada 8 h si dolor, por 3 días" },
  { name: "Amoxicilina 500 mg",                dosage: "1 cápsula cada 8 h por 7 días" },
  { name: "Enjuague de Clorhexidina 0,12%",    dosage: "15 ml, 2 veces al día por 7–10 días" },
  ],
};

// ---------------- Admin-facing ----------------
const adminStats: DashboardStats[] = [
  { label: "Pacientes Actuales", value: 154, icon: "users" },
  { label: "Turnos Semanales", value: 17, icon: "calendar" },
  { label: "Ingresos Mensuales", value: "$2,500,000", icon: "dollar" },
  { label: "Turnos Cancelados", value: 8, icon: "x" },
];

const adminPatients: Patient[] = [
  {
    id: "1",
    name: "Marcos Gonzalez",
    dni: "38654321",
    phone: "3794123456",
    email: "marcos@email.com",
    insurance: "ISSUNNE",
    lastVisit: "10/10/2025",
    status: "Activo",
  },
  {
    id: "2",
    name: "Agustin Ramirez",
    dni: "40123456",
    phone: "3794234567",
    email: "agustin@email.com",
    insurance: "PAMI",
    lastVisit: "12/10/2025",
    status: "Activo",
  },
  {
    id: "3",
    name: "Camila Rodriguez",
    dni: "39876543",
    phone: "3794345678",
    email: "camila@email.com",
    insurance: "Swiss Medical",
    lastVisit: "08/10/2025",
    status: "Activo",
  },
];

const adminStock: StockItem[] = [
  {
    id: "1",
    product: "Guantes de látex",
    category: "Insumos",
    quantity: 500,
    unit: "Unidades",
    price: 15000,
    lastUpdate: "10/10/2025",
  },
  {
    id: "2",
    product: "Mascarillas",
    category: "Insumos",
    quantity: 300,
    unit: "Unidades",
    price: 8000,
    lastUpdate: "10/10/2025",
  },
  {
    id: "3",
    product: "Anestesia local",
    category: "Medicamentos",
    quantity: 50,
    unit: "Unidades",
    price: 45000,
    lastUpdate: "09/10/2025",
  },
];

const adminReminders: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Próximo turno el 15/10/2025",
    description: "A las 14:30",
    time: "2h",
  },
  {
    id: "2",
    type: "message",
    title: "Simón Pérez te envió un mensaje",
    description: "Consulta sobre tratamiento",
    time: "5h",
  },
  {
    id: "3",
    type: "reminder",
    title: "Se acerca el Black Friday",
    description: "Crear promociones para Black Friday",
    time: "1d",
  },
];

const adminAppointments: Appointment[] = patientAppointments;

// ---------------- Exports ----------------
export {
  adminStats,
  adminAppointments,
  adminPatients,
  adminStock,
  adminReminders,
  patientAppointments,
  patientMessages,
  patientMessagesSecond,
  patientTreatment,
};
