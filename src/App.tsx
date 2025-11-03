"use client"

import type { ComponentType } from "react"
import { Suspense, lazy, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom"

import Header from "./components/UI/Header/Header"
import Footer from "./components/UI/Footer/Footer"

const Home = lazy(() => import("./pages/Home/Home"))
const Login = lazy(() => import("./pages/Login/Login"))
const Register = lazy(() => import("./pages/Register/Register"))
const Services = lazy(() => import("./pages/Services/Services"))
const Appointment = lazy(() => import("./pages/Appointment/Appointment"))
const ContactPage = lazy(() => import("./pages/ContactPage/ContactPage"))
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"))
const NotFound = lazy(() => import("./pages/NotFound/NotFound"))

const PatientHome = lazy(() => import("./components/Patient/PatientHome/PatientHome"))
const PatientAppointments = lazy(() => import("./components/Patient/PatientAppointmentSection/PatientAppointmentSection"))
const PatientMessages = lazy(() => import("./components/Patient/PatientMessagesSection/PatientMessagesSection"))
const PatientTreatment = lazy(() => import("./components/Patient/PatientTreatmentSection/PatientTreatmentSection"))
const PatientConfig = lazy(() => import("./components/Patient/PatientConfig/PatientConfig"))
const PatientSupport = lazy(() => import("./components/Patient/PatientSupport/PatientSupport"))

type PatientHistoryProps = {
  isAdmin?: boolean
  patientName?: string
  records?: Array<{
    date: string
    time?: string
    title?: string
    condition?: string
    diagnosis?: string
    medication?: string
    notes?: string
  }>
}

const PatientHistorySection = lazy<ComponentType<PatientHistoryProps>>(
  () => import("./components/Patient/PatientHistorySection/PatientHistorySection")
)

const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"))
const AdminStatsSection = lazy(() => import("./components/Admin/AdminHome/AdminHome"))
const AdminAppointmentsSection = lazy(() => import("./components/Admin/AdminAppointmentSection/AdminAppointmentsSection"))
const AdminUsersSection = lazy(() => import("./components/Admin/AdminUsersSection/AdminUsersSection"))
const AdminStockSection = lazy(() => import("./components/Admin/AdminStockSection/AdminStockSection"))
const AdminChartsSection = lazy(() => import("./components/Admin/AdminChartsSection/AdminChartsSection"))
const AdminRemindersSection = lazy(() => import("./components/Admin/AdminRemindersSection/AdminRemindersSection"))
const AdminMessagesSection = lazy(() => import("./components/Admin/AdminMessagesSection/AdminMessagesSection"))
const AdminSupport = lazy(() => import("./components/Admin/AdminSupport/AdminSupport"))
const AdminConfig = lazy(() => import("./components/Admin/AdminConfig/AdminConfig"))

import { patientTreatment } from "./data/dashboardData"
import ScrollToHash from "./utils/ScrollToHash"
import "./styles/globals.scss"
import AdminPatientHistory from "./components/Admin/AdminPatientHistory"
import AdminPatientTreatment from "./components/Admin/AdminPatientTreatment"
import { AuthProvider } from "./context/AuthContext" 

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  useEffect(() => {
    const run = (cb: () => void) => {
      const w = window as any
      if (w.requestIdleCallback) w.requestIdleCallback(cb)
      else setTimeout(cb, 1)
    }
    run(() => {
      import("./pages/Services/Services")
      import("./pages/ContactPage/ContactPage")
      import("./pages/AboutUs/AboutUs")
      import("./components/Admin/AdminHome/AdminHome")
      import("./components/Admin/AdminAppointmentSection/AdminAppointmentsSection")
      import("./components/Patient/PatientAppointmentSection/PatientAppointmentSection")
    })
  }, [])

  const historyRecords =
    (patientTreatment as any).history ??
    (patientTreatment.conditions?.map((c: any) => ({
      date: c.date ?? "-",
      condition: c.name,
      diagnosis: c.diagnosis ?? "-",
      medication: patientTreatment.medications?.[0]?.name ?? "-",
    })) ?? [])

  return (
    <AuthProvider> {/* AuthProvider añadido aquí */}
      <Router>
        <ScrollToTop />
        <ScrollToHash />
        <div className="app">
          <Header />
          <main>
            <Suspense fallback={<div className="page-loader" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/nosotros" element={<AboutUs />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/turno" element={<Appointment />} />

                <Route path="/dashboard/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminStatsSection />} />
                  <Route path="turnos" element={<AdminAppointmentsSection />} />
                  <Route path="pacientes" element={<AdminUsersSection />} />
                  <Route path="stock" element={<AdminStockSection />} />
                  <Route path="estadisticas" element={<AdminChartsSection />} />
                  <Route path="recordatorios" element={<AdminRemindersSection />} />
                  <Route path="mensajes" element={<AdminMessagesSection />} />
                  <Route path="pacientes/:id/historia" element={<AdminPatientHistory />} />
                  <Route path="pacientes/:id/tratamiento" element={<AdminPatientTreatment />} />
                  <Route path="soporte" element={<AdminSupport />} />
                  <Route path="configuracion" element={<AdminConfig />} />
                  <Route path="*" element={<Navigate to="." replace />} />
                </Route>

                <Route path="/dashboard/paciente" element={<Navigate to="/dashboard/paciente/inicio" replace />} />
                <Route path="/dashboard/paciente/inicio" element={<PatientHome />} />
                <Route path="/dashboard/paciente/turnos" element={<PatientAppointments />} />
                <Route path="/dashboard/paciente/mensajes" element={<PatientMessages />} />
                <Route path="/dashboard/paciente/tratamiento" element={<PatientTreatment />} />
                <Route path="/dashboard/paciente/configuracion" element={<PatientConfig />} />
                <Route path="/dashboard/paciente/soporte" element={<PatientSupport />} />
                <Route
                  path="/dashboard/paciente/historia"
                  element={
                    <PatientHistorySection
                      records={historyRecords}
                      patientName={patientTreatment.patientName ?? "Paciente"}
                    />
                  }
                />
                

                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App