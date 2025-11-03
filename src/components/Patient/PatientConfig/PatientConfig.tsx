"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../../DashboardLayout/DashboardLayout"
import Input from "@/components/UI/Input/Input"
import Select from "@/components/UI/Select/Select"
import Button from "@/components/UI/Button/Button"
import styles from "./PatientConfig.module.scss"
import { patientTreatment } from "../../../data/dashboardData"
import { getCurrentUser } from "../../../services/userService" // Asegúrate de tener este servicio

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
  darkMode: boolean
  passwordActual: string
  passwordNueva: string
  passwordNueva2: string
}

interface UserData {
  id: string;
  userType: string;
  fullName: string;
  email: string;
  state: boolean;
  phone?: string;
  dni?: string;
  gender?: string;
  insurance?: string;
  birthDate?: string;
  communication?: {
    email?: boolean;
    sms?: boolean;
    whatsapp?: boolean;
  };
}

const PatientConfig = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("https://i.pravatar.cc/150?img=12")
  
  const baseName = patientTreatment.patientName ?? "Usuario"
  
  const [form, setForm] = useState<FormState>({
    fullName: baseName,
    dni: String(patientTreatment.dni ?? ""),
    email: "",
    phone: "",
    birthDate: "",
    gender: String(patientTreatment.gender ?? ""),
    insurance: "",
    notifEmail: true,
    notifSms: false,
    notifWhatsapp: true,
    darkMode: false,
    passwordActual: "",
    passwordNueva: "",
    passwordNueva2: "",
  })

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          console.error('No token found')
          return
        }

        const data = await getCurrentUser(token)
        setUserData(data)
        
        // Llenar el formulario con los datos de la API
        setForm(prev => ({
          ...prev,
          fullName: data.fullName || baseName,
          dni: data.dni || String(patientTreatment.dni ?? ""),
          email: data.email || "",
          phone: data.phone || "",
          birthDate: data.birthDate || "",
          gender: data.gender || String(patientTreatment.gender ?? ""),
          insurance: data.insurance || "",
          notifEmail: data.communication?.email ?? true,
          notifSms: data.communication?.sms ?? false,
          notifWhatsapp: data.communication?.whatsapp ?? true,
        }))
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [baseName])

  const onChange = (k: keyof FormState, v: any) => setForm(prev => ({ ...prev, [k]: v }))
  
  const onAvatar = (file?: File) => { 
    if (file) setAvatarPreview(URL.createObjectURL(file)) 
  }

  // Enviar datos actualizados a la API
  const onSubmit = async (e: React.FormEvent) => { 
    e.preventDefault()
    setSaving(true)
    
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('No estás autenticado')
        return
      }

      // Preparar datos para enviar a la API
      const updateData = {
        fullName: form.fullName,
        dni: form.dni,
        email: form.email,
        phone: form.phone,
        birthDate: form.birthDate,
        gender: form.gender,
        insurance: form.insurance,
        communication: {
          email: form.notifEmail,
          sms: form.notifSms,
          whatsapp: form.notifWhatsapp
        }
      }

      // Si hay nueva contraseña, agregarla
      if (form.passwordNueva && form.passwordNueva === form.passwordNueva2) {
        (updateData as any).password = form.passwordNueva
      }

      // Llamar a la API para actualizar
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        alert('Datos actualizados correctamente')
        // Limpiar campos de contraseña
        setForm(prev => ({
          ...prev,
          passwordActual: "",
          passwordNueva: "",
          passwordNueva2: ""
        }))
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar los datos')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout userType="cliente" userRole="cliente" userName="Cargando...">
        <div className={styles.wrap}>
          <p>Cargando configuración...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      userType="cliente" 
      userRole="cliente" 
      userName={userData?.fullName ?? baseName}
    >
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <img src={avatarPreview} alt={userData?.fullName ?? baseName} />
              <label className={styles.avatarBtn}>
                <input type="file" accept="image/*" onChange={e => onAvatar(e.target.files?.[0])} />
                Cambiar
              </label>
            </div>
            <div className={styles.headInfo}>
              <h1>Configuración de Usuario</h1>
              <p>Gestioná tus datos personales y preferencias</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.btnSecondary} type="button">Cancelar</button>
            <button 
              className={styles.btnPrimary} 
              type="submit" 
              form="patient-config-form"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </header>

        <form id="patient-config-form" className={styles.form} onSubmit={onSubmit}>
          <section className={styles.card}>
            <h2>Datos Personales</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Nombre Completo</label>
                <Input  
                  name="Nombre Completo" 
                  value={form.fullName} 
                  onChange={(e:any)=>onChange("fullName", e.target.value)} 
                  placeholder="Nombre y apellido" 
                />
              </div>
              <div className={styles.field}>
                <label>DNI</label>
                <Input  
                  name="DNI" 
                  value={form.dni} 
                  onChange={(e:any)=>onChange("dni", e.target.value)} 
                  placeholder="43747511" 
                />
              </div>
              <div className={styles.field}>
                <label>Fecha de Nacimiento</label>
                <Input 
                  name="Fecha de Nacimiento" 
                  type="date" 
                  value={form.birthDate} 
                  onChange={(e:any)=>onChange("birthDate", e.target.value)} 
                />
              </div>
              <div className={styles.field}>
                <Select
                  label="Género"
                  name="gender"
                  value={form.gender}
                  onChange={(v:string)=>onChange("gender", v)}
                  options={[
                    { value: "masculino", label: "Masculino" },
                    { value: "femenino", label: "Femenino" },
                    { value: "otro", label: "Otro" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Contacto</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Email</label>
                <Input 
                  name="Email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e:any)=>onChange("email", e.target.value)} 
                  placeholder="tucorreo@ejemplo.com" 
                />
              </div>
              <div className={styles.field}>
                <label>Teléfono</label>
                <Input 
                  name="Teléfono" 
                  type="tel" 
                  value={form.phone} 
                  onChange={(e:any)=>onChange("phone", e.target.value)} 
                  placeholder="3794..." 
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Obra Social</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <Select
                  label="Obra Social"
                  name="insurance"
                  value={form.insurance}
                  onChange={(v:string)=>onChange("insurance", v)}
                  options={[
                    { value: "jersal", label: "Jerárquicos Salud" },
                    { value: "swiss", label: "Swiss Medical" },
                    { value: "medife", label: "Medifé" },
                    { value: "sancor", label: "SanCor Salud" },
                    { value: "ospim", label: "OSPIM" },
                    { value: "galeno", label: "Galeno" },
                    { value: "issunne", label: "ISSUNNE" },
                    { value: "ospjn", label: "OSPJN" },
                    { value: "otro", label: "Otro" },
                    { value: "ninguna", label: "Ninguna" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Seguridad</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Nueva contraseña</label>
                <Input 
                  name="Nueva contraseña" 
                  type="password" 
                  value={form.passwordNueva} 
                  onChange={(e:any)=>onChange("passwordNueva", e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>
              <div className={styles.field}>
                <label>Repetir nueva contraseña</label>
                <Input 
                  name="Repetir nueva contraseña" 
                  type="password" 
                  value={form.passwordNueva2} 
                  onChange={(e:any)=>onChange("passwordNueva2", e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            {form.passwordNueva && form.passwordNueva !== form.passwordNueva2 && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Las contraseñas no coinciden
              </p>
            )}
          </section>

          <section className={styles.card}>
            <h2>Preferencias</h2>
            <div className={styles.grid3}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={form.notifEmail} 
                  onChange={e=>onChange("notifEmail", e.target.checked)} 
                />
                <span>Email</span>
              </label>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={form.notifSms} 
                  onChange={e=>onChange("notifSms", e.target.checked)} 
                />
                <span>SMS</span>
              </label>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={form.notifWhatsapp} 
                  onChange={e=>onChange("notifWhatsapp", e.target.checked)} 
                />
                <span>WhatsApp</span>
              </label>
            </div>
          </section>

          <div className={styles.actionsBottom}>
            <button className={styles.btnSecondary} type="button">Cancelar</button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default PatientConfig