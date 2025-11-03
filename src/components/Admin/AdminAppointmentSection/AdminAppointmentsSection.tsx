"use client"

import { useMemo, useState } from "react"
import { Eye, Edit, Trash2, Calendar as CalIcon, Clock, Filter, Lock, Plus } from "lucide-react"
import DataTable from "@/components/DataTable/DataTable"
import Button from "@/components/UI/Button/Button"
import Modal from "@/components/UI/Modal/Modal"
import Input from "@/components/UI/Input/Input"
import Select from "@/components/UI/Select/Select"
import { adminAppointments } from "../../../data/dashboardData"
import styles from "./AdminAppointmentsSection.module.scss"

type FilterTab = "month" | "week" | "hour"

const months = [
  { value: "Todos", label: "Todos" },
  { value: "Enero", label: "Enero" },
  { value: "Febrero", label: "Febrero" },
  { value: "Marzo", label: "Marzo" },
  { value: "Abril", label: "Abril" },
  { value: "Mayo", label: "Mayo" },
  { value: "Junio", label: "Junio" },
  { value: "Julio", label: "Julio" },
  { value: "Agosto", label: "Agosto" },
  { value: "Septiembre", label: "Septiembre" },
  { value: "Octubre", label: "Octubre" },
  { value: "Noviembre", label: "Noviembre" },
  { value: "Diciembre", label: "Diciembre" },
]

const AdminAppointmentsSection = () => {
  const [filterTab, setFilterTab] = useState<FilterTab>("month")
  const [filterMonth, setFilterMonth] = useState("Todos")
  const [filterWeek, setFilterWeek] = useState("")
  const [filterHour, setFilterHour] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [blockOpen, setBlockOpen] = useState(false)
  const [blockDate, setBlockDate] = useState("")
  const [blockStartTime, setBlockStartTime] = useState("")
  const [blockEndTime, setBlockEndTime] = useState("")

  const [addOpen, setAddOpen] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newPatient, setNewPatient] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newInsurance, setNewInsurance] = useState("")
  const [newReason, setNewReason] = useState("")

  const [viewRow, setViewRow] = useState<any | null>(null)
  const [editRow, setEditRow] = useState<any | null>(null)
  const [, setSelectedRows] = useState<any[]>([])

  const appointmentColumns = [
    { key: "date", label: "Fecha" },
    { key: "time", label: "Hora" },
    { key: "reason", label: "Motivo" },
    { key: "insurance", label: "Obra Social" },
    { key: "status", label: "Estado" },
  ]

  const filteredData = useMemo(() => {
    let data = adminAppointments
    if (filterMonth !== "Todos") {
      const monthIndex = months.findIndex((m) => m.value === filterMonth) - 1
      data = data.filter((r: any) => {
        const d = new Date(r.date)
        return d.getMonth() === monthIndex
      })
    }
    if (filterWeek) {
      const [year, week] = filterWeek.split("-W").map(Number)
      const getWeek = (d: Date) => {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
        const dayNum = date.getUTCDay() || 7
        date.setUTCDate(date.getUTCDate() + 4 - dayNum)
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
        const wn = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
        return { year: date.getUTCFullYear(), week: wn }
      }
      data = data.filter((r: any) => {
        const d = new Date(r.date)
        const w = getWeek(d)
        return w.year === year && w.week === week
      })
    }
    if (filterHour) {
      data = data.filter((r: any) => (r.time || "").startsWith(filterHour))
    }
    return data
  }, [filterMonth, filterWeek, filterHour])

  return (
    <section id="appointments" className={styles.section}>
      <div className={styles.toolbar}>
        <div className={styles.filterCards}>
          <button className={styles.card} type="button" onClick={() => { setFilterTab("month"); setFiltersOpen(true) }}>
            <div className={styles.cardIcon}><CalIcon size={18} /></div>
            <div className={styles.cardText}>
              <span className={styles.cardLabel}>Mes</span>
              <span className={styles.cardValue}>{filterMonth || "Todos"}</span>
            </div>
          </button>
          <button className={styles.card} type="button" onClick={() => { setFilterTab("week"); setFiltersOpen(true) }}>
            <div className={styles.cardIcon}><Filter size={18} /></div>
            <div className={styles.cardText}>
              <span className={styles.cardLabel}>Semana</span>
              <span className={styles.cardValue}>{filterWeek || "Todas"}</span>
            </div>
          </button>
          <button className={styles.card} type="button" onClick={() => { setFilterTab("hour"); setFiltersOpen(true) }}>
            <div className={styles.cardIcon}><Clock size={18} /></div>
            <div className={styles.cardText}>
              <span className={styles.cardLabel}>Hora</span>
              <span className={styles.cardValue}>{filterHour || "Todas"}</span>
            </div>
          </button>
        </div>

        <div className={styles.rightActions}>
          <Button variant="secondary" onClick={() => setBlockOpen(true)}>
            <Lock size={16} /> Bloquear Hora
          </Button>
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Agregar Turno
          </Button>
        </div>
      </div>

      <DataTable
        columns={appointmentColumns}
        data={filteredData}
        selectable
        onSelectionChange={setSelectedRows}
        actions={[
          { icon: <Eye />, label: "Ver", onClick: (row) => setViewRow(row) },
          { icon: <Edit />, label: "Editar", onClick: (row) => setEditRow(row) },
          { icon: <Trash2 />, label: "Eliminar", onClick: () => {} },
        ]}
      />

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros de Turnos"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setFilterMonth("Todos"); setFilterWeek(""); setFilterHour(""); setFiltersOpen(false) }}>Limpiar</Button>
            <Button variant="primary" onClick={() => setFiltersOpen(false)}>Aplicar</Button>
          </>
        }
      >
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${filterTab === "month" ? styles.tabActive : ""}`} onClick={() => setFilterTab("month")}>Mes</button>
          <button className={`${styles.tab} ${filterTab === "week" ? styles.tabActive : ""}`} onClick={() => setFilterTab("week")}>Semana</button>
          <button className={`${styles.tab} ${filterTab === "hour" ? styles.tabActive : ""}`} onClick={() => setFilterTab("hour")}>Hora</button>
        </div>
        {filterTab === "month" && (
          <Select
            label="Mes"
            name="month"
            value={filterMonth}
            onChange={(v: string) => setFilterMonth(v)}
            options={months}
            required
          />
        )}
        {filterTab === "week" && (
          <Input
            type="text"
            name="week"
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value)}
            placeholder="YYYY-Www"
          />
        )}
        {filterTab === "hour" && (
          <Input
            type="time"
            name="hour"
            value={filterHour}
            onChange={(e) => setFilterHour(e.target.value)}
            placeholder="09:00"
          />
        )}
      </Modal>

      <Modal
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        title="Bloquear Horario"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBlockOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setBlockOpen(false)}>Guardar</Button>
          </>
        }
      >
        <div className={styles.grid3}>
          <Input type="date" name="blockDate" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} placeholder="" />
          <Input type="time" name="blockStartTime" value={blockStartTime} onChange={(e) => setBlockStartTime(e.target.value)} placeholder="" />
          <Input type="time" name="blockEndTime" value={blockEndTime} onChange={(e) => setBlockEndTime(e.target.value)} placeholder="" />
        </div>
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Agregar Turno"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setAddOpen(false)}>Guardar</Button>
          </>
        }
      >
        <div className={styles.grid2}>
          <Input type="date" name="newDate" value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="" />
          <Input type="time" name="newTime" value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="" />
        </div>
        <Input type="text" name="newPatient" value={newPatient} onChange={(e) => setNewPatient(e.target.value)} placeholder="Paciente" />
        <Input type="tel" name="newPhone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Teléfono" />
        <Select
          label="Obra Social"
          name="newInsurance"
          value={newInsurance}
          onChange={(v: string) => setNewInsurance(v)}
          options={[
            { value: "", label: "Seleccionar" },
            { value: "Medifé", label: "Medifé" },
            { value: "Swiss", label: "Swiss Medical" },
            { value: "OSPJN", label: "OSPJN" },
            { value: "Jerárquicos Salud", label: "Jerárquicos Salud" },
            { value: "OSPIM", label: "Ospim" },
            { value: "Galeno", label: "Galeno" },
             { value: "Otro", label: "Otro" },
            { value: "Ninguna", label: "Ninguna" },
          ]}
          required
        />
        <Input type="text" name="newReason" value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Motivo" />
      </Modal>

      <Modal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title="Detalle del Turno"
        footer={<Button variant="primary" onClick={() => setViewRow(null)}>Cerrar</Button>}
      >
        <div className={styles.detailGrid}>
          <div><span className={styles.detailLabel}>Fecha</span><span className={styles.detailValue}>{viewRow?.date}</span></div>
          <div><span className={styles.detailLabel}>Hora</span><span className={styles.detailValue}>{viewRow?.time}</span></div>
          <div><span className={styles.detailLabel}>Motivo</span><span className={styles.detailValue}>{viewRow?.reason}</span></div>
          <div><span className={styles.detailLabel}>Obra Social</span><span className={styles.detailValue}>{viewRow?.insurance}</span></div>
          <div><span className={styles.detailLabel}>Estado</span><span className={styles.detailValue}>{viewRow?.status}</span></div>
        </div>
      </Modal>

      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Editar Turno"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditRow(null)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setEditRow(null)}>Guardar</Button>
          </>
        }
      >
        <div className={styles.grid2}>
          <Input type="date" name="editDate" value={editRow?.date || ""} onChange={() => {}} placeholder="" />
          <Input type="time" name="editTime" value={editRow?.time || ""} onChange={() => {}} placeholder="" />
        </div>
        <Input type="text" name="editReason" value={editRow?.reason || ""} onChange={() => {}} placeholder="Motivo" />
        <Select
          label="Obra Social"
          name="editInsurance"
          value={editRow?.insurance || ""}
          onChange={() => {}}
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
          required
        />
      </Modal>
    </section>
  )
}

export default AdminAppointmentsSection
