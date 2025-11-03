"use client"

import PatientTreatmentSection from "@/components/Patient/PatientTreatmentSection/PatientTreatmentSection"

const AdminPatientTreatment = () => {
  return (
    <section style={{ padding: 0, background: "transparent" }}>
      <PatientTreatmentSection isAdmin />
    </section>
  )
}

export default AdminPatientTreatment