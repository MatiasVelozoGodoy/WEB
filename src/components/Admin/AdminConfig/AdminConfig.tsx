"use client"

import { useState } from "react"
import Input from "@/components/UI/Input/Input"
import Select from "@/components/UI/Select/Select"
import Button from "@/components/UI/Button/Button"
import styles from "./AdminConfig.module.scss"

type AdminForm = {
  nombre: string
  apellido: string
  email: string
  telefono: string
  notifSistema: boolean
  notifTurnos: boolean
  notifPacientes: boolean
  passwordActual: string
  passwordNueva: string
  passwordNueva2: string
}

const AdminConfig = () => {
  const [avatarPreview, setAvatarPreview] = useState<string>("https://i.pravatar.cc/150?img=5")
  const [form, setForm] = useState<AdminForm>({
    nombre: "Paula",
    apellido: "Cavaglia",
    email: "admin@example.com",
    telefono: "",
    notifSistema: true,
    notifTurnos: true,
    notifPacientes: true,
    passwordActual: "",
    passwordNueva: "",
    passwordNueva2: "",
  })

  const onChange = (k: keyof AdminForm, v: any) => setForm(prev => ({ ...prev, [k]: v }))
  const onAvatar = (file?: File) => { if (file) setAvatarPreview(URL.createObjectURL(file)) }
  const onSubmit = (e: React.FormEvent) => { e.preventDefault() }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar}>
            <img src={avatarPreview} alt="Admin" />
            <label className={styles.avatarBtn}>
              <input type="file" accept="image/*" onChange={e => onAvatar(e.target.files?.[0])} />
              +
            </label>
          </div>
          <div className={styles.headInfo}>
            <h1>Configuración del Administrador</h1>
            <p>Preferencias de cuenta y notificaciones del panel</p>
          </div>
        </div>
       
      </header>

      <form id="admin-config-form" className={styles.form} onSubmit={onSubmit}>
        <section className={styles.card}>
          <h2>Perfil</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Nombre</label>
              <Input name="Nombre" value={form.nombre} onChange={(e:any)=>onChange("nombre", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Apellido</label>
              <Input name="Apellido" value={form.apellido} onChange={(e:any)=>onChange("apellido", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <Input name="Email" type="email" value={form.email} onChange={(e:any)=>onChange("email", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Teléfono</label>
              <Input name="Teléfono" value={form.telefono} onChange={(e:any)=>onChange("telefono", e.target.value)} />
            </div>
           
           
          </div>
        </section>

        <section className={styles.card}>
          <h2>Notificaciones</h2>
          <div className={styles.grid3}>
            <label className={styles.switch}>
              <input type="checkbox" checked={form.notifSistema} onChange={e=>onChange("notifSistema", e.target.checked)} />
              <span>Alertas del sistema</span>
            </label>
            <label className={styles.switch}>
              <input type="checkbox" checked={form.notifTurnos} onChange={e=>onChange("notifTurnos", e.target.checked)} />
              <span>Turnos</span>
            </label>
            <label className={styles.switch}>
              <input type="checkbox" checked={form.notifPacientes} onChange={e=>onChange("notifPacientes", e.target.checked)} />
              <span>Pacientes</span>
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <h2>Seguridad</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Nueva contraseña</label>
              <Input name="Nueva contraseña" type="password" value={form.passwordNueva} onChange={(e:any)=>onChange("passwordNueva", e.target.value)} placeholder="••••••••" />
            </div>
            <div className={styles.field}>
              <label>Repetir nueva contraseña</label>
              <Input name="Repetir nueva contraseña" type="password" value={form.passwordNueva2} onChange={(e:any)=>onChange("passwordNueva2", e.target.value)} placeholder="••••••••" />
            </div>
          </div>
        </section>

        <div className={styles.actionsBottom}>
          <Button variant="secondary" type="button">Cancelar</Button>
          <Button variant="primary" type="submit">Guardar</Button>
        </div>
      </form>
    </div>
  )
}

export default AdminConfig
