"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "../../DashboardLayout/DashboardLayout"
import Input from "@/components/UI/Input/Input"
import Select from "@/components/UI/Select/Select"
import styles from "./PatientConfig.module.scss"
import { getCurrentUser } from "../../../services/userService"

// Convierte DD/MM/YYYY → YYYY-MM-DD (para input type="date")
function toInputDate(ddmmyyyy: string): string {
  if (!ddmmyyyy || !ddmmyyyy.includes("/")) return ""
  const [day, month, year] = ddmmyyyy.split("/")
  return `${year}-${month}-${day}`
}

// Convierte YYYY-MM-DD → DD/MM/YYYY (para enviar al backend)
function toDDMMYYYY(yyyymmdd: string): string {
  if (!yyyymmdd) return ""
  const [year, month, day] = yyyymmdd.split("-")
  return `${day}/${month}/${year}`
}

type FormState = {
  fullName: string
  dni: string
  email: string
  phone: string
  birthDate: string
  gender: string
  insurance: string
  notifEmail: boolean
  notifSms: boolean
  notifWhatsapp: boolean
  passwordActual: string
  passwordNueva: string
  passwordNueva2: string
}

interface UserData {
  id: string
  userType: string
  fullName: string
  email: string
  state: boolean
  phone?: string
  dni?: string
  gender?: string
  insurance?: string
  birthDate?: string
  communication?: {
    email?: boolean
    sms?: boolean
    whatsapp?: boolean
  }
}

const PatientConfig = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [form, setForm] = useState<FormState>({
    fullName: "",
    dni: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    insurance: "",
    notifEmail: true,
    notifSms: false,
    notifWhatsapp: true,
    passwordActual: "",
    passwordNueva: "",
    passwordNueva2: "",
  })
  const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/150?img=12")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("No se encontró token de autenticación.")

      const data = await getCurrentUser(token)
      setUserData(data)

      // Definir avatar por defecto según gender
      let defaultAvatar = "https://i.pravatar.cc/150?img=12" // fallback genérico
      if (data.gender === "femenino") {
        defaultAvatar = "https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-linea_23-2151303097.jpg"
      } else if (data.gender === "masculino") {
        defaultAvatar = "https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-o-perfil-humano_23-2150671116.jpg"
      }

      setAvatarPreview(data.profilePicture || defaultAvatar)

      setForm((prev) => ({
        ...prev,
        fullName: data.fullName || "",
        dni: data.dni || "",
        email: data.email || "",
        phone: data.phone || "",
        birthDate: toInputDate(data.birthDate || ""),
        gender: data.gender || "",
        insurance: data.insurance || "",
        notifEmail: data.communication?.email ?? true,
        notifSms: data.communication?.sms ?? false,
        notifWhatsapp: data.communication?.whatsapp ?? true,
      }))
    } catch (error) {
      console.error("Error cargando usuario:", error)
      setMessage({ type: "error", text: "Error al cargar tus datos." })
    } finally {
      setLoading(false)
    }
  }
  fetchUserData()
}, [])

  const onChange = (k: keyof FormState, v: any) => setForm((prev) => ({ ...prev, [k]: v }))
  const onAvatar = (file?: File) => file && setAvatarPreview(URL.createObjectURL(file))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("No estás autenticado.")

      const updateData = {
        fullName: form.fullName,
        dni: form.dni,
        email: form.email,
        phone: form.phone,
        birthDate: toDDMMYYYY(form.birthDate),
        gender: form.gender,
        insurance: form.insurance,
        communication: {
          email: form.notifEmail,
          sms: form.notifSms,
          whatsapp: form.notifWhatsapp,
        },
      }

      if (form.passwordNueva && form.passwordNueva === form.passwordNueva2) {
        ;(updateData as any).password = form.passwordNueva
      }

      const response = await fetch("http://localhost:3000/users/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Datos actualizados correctamente" })
        setForm((prev) => ({
          ...prev,
          passwordActual: "",
          passwordNueva: "",
          passwordNueva2: "",
        }))
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Error al actualizar los datos." })
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error)
      setMessage({ type: "error", text: "Error al guardar los cambios." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout userType="cliente" userRole="cliente" userName="Cargando...">
        <div className={styles.loadingContainer}>
          <motion.div
            className={styles.loader}
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
          />
          <motion.p
            className={styles.loadingText}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          >
            Cargando configuración...
          </motion.p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="cliente" userRole="cliente" userName={userData?.fullName ?? "Usuario"}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <img src={avatarPreview || "/placeholder.svg"} alt={userData?.fullName ?? "Usuario"} />
              <label className={styles.avatarBtn}>
                <input type="file" accept="image/*" onChange={(e) => onAvatar(e.target.files?.[0])} />
                Cambiar
              </label>
            </div>
            <div className={styles.headInfo}>
              <h1>Configuración de Usuario</h1>
              <p>Gestioná tus datos personales y preferencias</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.btnSecondary} type="button">
              Cancelar
            </button>
            <button className={styles.btnPrimary} type="submit" form="patient-config-form" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </header>

        {message && (
          <motion.div
            className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.text}
          </motion.div>
        )}

        <form id="patient-config-form" className={styles.form} onSubmit={onSubmit}>
          <section className={styles.card}>
            <h2>Datos Personales</h2>
            <div className={styles.grid2}>
              <Input
                label="Nombre Completo"
                value={form.fullName}
                onChange={(e: any) => onChange("fullName", e.target.value)}
              />
              <Input label="DNI" value={form.dni} onChange={(e: any) => onChange("dni", e.target.value)} />
              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={form.birthDate}
                onChange={(e: any) => onChange("birthDate", e.target.value)}
              />
              <Select
                label="Género"
                value={form.gender}
                onChange={(v: string) => onChange("gender", v)}
                options={[
                  { value: "masculino", label: "Masculino" },
                  { value: "femenino", label: "Femenino" },
                  { value: "otro", label: "Otro" },
                ]}
              />
            </div>
          </section>

          <section className={styles.card}>
            <h2>Contacto</h2>
            <div className={styles.grid2}>
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e: any) => onChange("email", e.target.value)}
              />
              <Input
                label="Teléfono"
                type="tel"
                value={form.phone}
                onChange={(e: any) => onChange("phone", e.target.value)}
              />
            </div>
          </section>

          <section className={styles.card}>
            <h2>Obra Social</h2>
            <Select
              label="Obra Social"
              value={form.insurance}
              onChange={(v: string) => onChange("insurance", v)}
              options={[
                { value: "Jerárquicos Salud", label: "Jerárquicos Salud" },
                { value: "Swiss Medical", label: "Swiss Medical" },
                { value: "Medifé", label: "Medifé" },
                { value: "SanCor Salud", label: "SanCor Salud" },
                { value: "Otro", label: "Otro" },
                { value: "Ninguna", label: "Ninguna" },
              ]}
            />
          </section>

          <section className={styles.card}>
            <h2>Preferencias</h2>
            <div className={styles.grid3}>
              <label>
                <input
                  type="checkbox"
                  checked={form.notifEmail}
                  onChange={(e) => onChange("notifEmail", e.target.checked)}
                />{" "}
                Email
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.notifSms}
                  onChange={(e) => onChange("notifSms", e.target.checked)}
                />{" "}
                SMS
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.notifWhatsapp}
                  onChange={(e) => onChange("notifWhatsapp", e.target.checked)}
                />{" "}
                WhatsApp
              </label>
            </div>
          </section>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default PatientConfig
