"use client"

import { useMemo, useState } from "react"
import { Eye, Edit, Trash2, User, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/UI/Button/Button"
import DataTable from "../../DataTable/DataTable"
import { adminPatients as basePatients } from "../../../data/dashboardData"
import styles from "./AdminUsersSection.module.scss"

type Patient = typeof basePatients[number]

const AdminUsersSection = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>(basePatients)
  const [query, setQuery] = useState("")
  const [viewUser, setViewUser] = useState<Patient | null>(null)
  const [editUser, setEditUser] = useState<Patient | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Patient>>({})

  const patientColumns = [
    { key: "name", label: "Nombre" },
    { key: "dni", label: "DNI" },
    { key: "phone", label: "Teléfono" },
    { key: "insurance", label: "Obra Social" },
    { key: "treatment", label: "Tratamiento Actual" },
    { key: "history", label: "Historia Clínica" },
  ]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) =>
      [p.name, p.dni, p.phone, p.email, p.insurance, p.lastVisit]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [patients, query])

  const tableData = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.id,
        __raw: p,
        name: (
          <div className={styles.nameCell}>
            <span className={styles.avatar}><User size={18} /></span>
            <span className={styles.nameText}>{p.name}</span>
          </div>
        ),
        dni: p.dni,
        phone: p.phone,
        insurance: p.insurance,
        treatment: (
          <button
            type="button"
            className={styles.linkCell}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/admin/pacientes/${p.id}/tratamiento`, { state: { mode: "admin" } })
            }}
          >
            IR A TRATAMIENTO ACTUAL
          </button>
        ),
        history: (
          <button
            type="button"
            className={styles.linkCell}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/admin/pacientes/${p.id}/historia`, { state: { mode: "admin" } })
            }}
          >
            IR A HISTORIA CLÍNICA
          </button>
        ),
      })),
    [filtered, navigate]
  )

  const actions = [
    {
      icon: <Eye />,
      label: "Ver",
      onClick: (row: any) => setViewUser(row.__raw as Patient),
    },
    {
      icon: <Edit />,
      label: "Editar",
      onClick: (row: any) => {
        const u = row.__raw as Patient
        setEditDraft(u)
        setEditUser(u)
      },
    },
    {
      icon: <Trash2 />,
      label: "Eliminar",
      onClick: (row: any) => {
        const u = row.__raw as Patient
        if (confirm(`Eliminar ${u.name}?`)) {
          setPatients((prev) => prev.filter((x) => x.id !== u.id))
        }
      },
    },
  ]

  const saveEdit = () => {
    if (!editUser) return
    setPatients((prev) =>
      prev.map((p) => (p.id === editUser.id ? ({ ...p, ...editDraft } as Patient) : p))
    )
    setEditUser(null)
  }

  return (
    <section id="users" className={styles.section}>
      <div className={styles.headerLine}>
        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            placeholder="Buscar usuarios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={patientColumns}
        data={tableData}
        actions={actions}
        selectable
      />

      {viewUser && (
        <>
          <div className={styles.modalOverlay} onClick={() => setViewUser(null)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ver Usuario</h3>
              <button className={styles.closeX} onClick={() => setViewUser(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.viewRow}><span className={styles.viewLabel}>Nombre</span><span>{viewUser.name}</span></div>
              <div className={styles.viewRow}><span className={styles.viewLabel}>DNI</span><span>{viewUser.dni}</span></div>
              <div className={styles.viewRow}><span className={styles.viewLabel}>Teléfono</span><span>{viewUser.phone}</span></div>
              <div className={styles.viewRow}><span className={styles.viewLabel}>Email</span><span>{viewUser.email}</span></div>
              <div className={styles.viewRow}><span className={styles.viewLabel}>Obra Social</span><span>{viewUser.insurance}</span></div>
              <div className={styles.viewRow}><span className={styles.viewLabel}>Última Visita</span><span>{viewUser.lastVisit}</span></div>
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setViewUser(null)}>Cerrar</Button>
            </div>
          </div>
        </>
      )}

      {editUser && (
        <>
          <div className={styles.modalOverlay} onClick={() => setEditUser(null)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Usuario</h3>
              <button className={styles.closeX} onClick={() => setEditUser(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Nombre</span><input value={editDraft.name ?? ""} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} /></label>
                <label className={styles.field}><span>DNI</span><input value={editDraft.dni ?? ""} onChange={(e) => setEditDraft((d) => ({ ...d, dni: e.target.value }))} /></label>
                <label className={styles.field}><span>Teléfono</span><input value={editDraft.phone ?? ""} onChange={(e) => setEditDraft((d) => ({ ...d, phone: e.target.value }))} /></label>
                <label className={styles.field}><span>Email</span><input value={editDraft.email ?? ""} onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))} /></label>
                <label className={styles.field}><span>Obra Social</span><input value={editDraft.insurance ?? ""} onChange={(e) => setEditDraft((d) => ({ ...d, insurance: e.target.value }))} /></label>
                <label className={styles.field}><span>Última Visita</span><input value={editDraft.lastVisit ?? ""} onChange={(e) => setEditDraft((d) => ({ ...d, lastVisit: e.target.value }))} /></label>
              </div>
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setEditUser(null)}>Cancelar</Button>
              <Button variant="primary" onClick={saveEdit}>Guardar</Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminUsersSection
