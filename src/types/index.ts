export interface Testimonial {
  id: string
  name: string
  date: string
  text: string
  avatar: string
}

export interface Service {
  id: string
  title: string
  description: string
  image: string
}

export interface InsuranceProvider {
  id: string
  name: string
  logo: string
}

export interface PaymentMethod {
  id: string
  name: string
  logo: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface NewsletterFormData {
  email: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  fullName: string
  dni: string
  gender: string
  email: string
  phone: string
  birthDate: string
  password: string
  confirmPassword: string
  insurance: string
}

export interface AppointmentFormData {
  date: string
  time: string
  notification: boolean
  file?: File
}

export interface DetailedService {
  id: string
  title: string
  description: string
  image: string
  category: "estetica" | "cirugia" | "tratamiento de conducto" | "otros"
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
}

export interface Appointment {
  id: string
  date: string
  time: string
  reason: string
  insurance: string
  payment: string
  status: "Completado" | "Pendiente" | "Cancelado"
  receipt?: string
}

export interface Patient {
  id: string
  fullName: string
  dni: string
  phone: string
  email: string
  insurance: string
  lastVisit: string
  status: "Activo" | "Inactivo"
}

export interface Treatment {
  patientName: "Francisco"
  dni: string
  gender: string
  weight: number
  age: number
  bmi: number
  height: number
  conditions: MedicalCondition[]
  medications: Medication[]
}

export interface MedicalCondition {
  name: string
  diagnosis: string
  date: string
}

export interface Medication {
  name: string
  dosage: string
}

export interface Message {
  id: string
  sender: string
  avatar: string
  text: string
  timestamp: string
  isOwn: boolean
}

export interface Notification {
  id: string
  type: "appointment" | "message" | "reminder"
  title: string
  description: string
  time: string
}

export interface StockItem {
  id: string
  product: string
  category: string
  quantity: number
  unit: string
  price: number
  lastUpdate: string
}

export interface DashboardStats {
  label: string
  value: number | string
  icon: string
}
