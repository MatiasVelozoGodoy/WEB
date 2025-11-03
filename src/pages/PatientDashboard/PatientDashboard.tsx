"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout"

import PatientHome from "../../components/Patient/PatientHome/PatientHome"
import PatientAppointments from "../../components/Patient/PatientAppointmentSection/PatientAppointmentSection"
import PatientMessages from "../../components/Patient/PatientMessagesSection/PatientMessagesSection"
import PatientTreatment from "../../components/Patient/PatientTreatmentSection/PatientTreatmentSection"
import PatientConfig from "../../components/Patient/PatientConfig/PatientConfig"
import PatientSupport from "../../components/Patient/PatientSupport/PatientSupport"

import type { ComponentType } from "react"
import { lazy } from "react"
const PatientHistorySection = lazy<ComponentType<any>>(
  () => import("../../components/Patient/PatientHistorySection/PatientHistorySection")
)

import pfp from "../../assets/images/profile.png"
import { patientTreatment } from "../../data/dashboardData"

const PatientDashboard = () => {
  const historyRecords =
    (patientTreatment as any).history ??
    (patientTreatment.conditions?.map((c: any) => ({
      date: c.date ?? "-",
      condition: c.name,
      diagnosis: c.diagnosis ?? "-",
      medication: patientTreatment.medications?.[0]?.name ?? "-",
    })) ?? [])

  return (
    <DashboardLayout userType="cliente" userName="Paciente" userRole="Paciente" userAvatar={pfp}>
      <Routes>
        <Route index element={<PatientHome />} />
        <Route path="turnos" element={<PatientAppointments />} />
        <Route path="mensajes" element={<PatientMessages />} />
        <Route path="tratamiento" element={<PatientTreatment />} />
        <Route
          path="historia"
          element={
            <PatientHistorySection
              records={historyRecords}
              patientName={patientTreatment.patientName ?? "Paciente"}
            />
          }
        />
        <Route path="configuracion" element={<PatientConfig />} />
        <Route path="soporte" element={<PatientSupport />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default PatientDashboard
