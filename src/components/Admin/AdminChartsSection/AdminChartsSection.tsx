"use client"

import { useMemo, useState } from "react"
import { Users, ClipboardList, SquarePen } from "lucide-react"
import { adminStats } from "../../../data/dashboardData"
import styles from "./AdminChartsSection.module.scss"
import Button from "@/components/UI/Button/Button"

const weeks = ["1era Semana", "2da Semana", "3ra Semana", "4ta Semana"]

const dataByFilter: Record<string, number[][]> = {
  "Nuevos Pacientes": [
    [120, 145, 170, 125],
    [95, 130, 148, 150],
    [110, 125, 140, 165],
  ],
  Ingresos: [
    [150, 135, 160, 180],
    [130, 120, 150, 175],
    [140, 145, 155, 185],
  ],
  Consultas: [
    [185, 145, 170, 125],
    [155, 130, 148, 145],
    [172, 125, 148, 175],
  ],
  "Obras Sociales": [
    [95, 110, 120, 130],
    [80, 90, 105, 115],
    [100, 98, 110, 120],
  ],
  Servicios: [
    [70, 85, 92, 105],
    [60, 75, 80, 95],
    [78, 82, 88, 100],
  ],
}

const months = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

const AdminChartsSection = () => {
  const [active, setActive] = useState<keyof typeof dataByFilter>("Consultas")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  const patients = adminStats.find((s) => s.icon === "users")?.value ?? "-"
  const consultas = adminStats.find((s) => s.icon === "calendar")?.value ?? "-"
  const ingresosRaw = adminStats.find((s) => s.icon === "dollar")?.value
  const ingresos =
    typeof ingresosRaw === "number"
      ? `$${ingresosRaw.toLocaleString()}`
      : String(ingresosRaw ?? "-")

  const series = useMemo(() => {
    const base = dataByFilter[active] ?? dataByFilter["Consultas"]
    const f = (1 + ((month + 1) % 6) * 0.05) * (1 + ((year % 5) - 2) * 0.01)
    return base.map(arr => arr.map(v => Math.round(v * f)))
  }, [active, month, year])

  const maxValue = 200
  const years = Array.from({ length: 8 }, (_, i) => now.getFullYear() - 5 + i)

  return (
    <section id="charts" className={styles.section}>
      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.mcIcon}><Users size={22} /></div>
            <span className={styles.mcLabel}>Total de Pacientes</span>
          </div>
          <strong className={styles.mcValue}>{patients}</strong>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.mcIcon}><ClipboardList size={22} /></div>
            <span className={styles.mcLabel}>Total de Consultas (Mes)</span>
          </div>
          <strong className={styles.mcValue}>{consultas}</strong>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.mcIcon}><Users size={22} /></div>
            <span className={styles.mcLabel}>Total de Ingresos (Mes)</span>
          </div>
          <strong className={styles.mcValue}>{ingresos}</strong>
        </div>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span>{active}</span>
            <button className={styles.editBtn} type="button" aria-label="Editar" onClick={() => setIsEditOpen(true)}>
              <SquarePen size={18} />
            </button>
          </div>

          <div className={styles.chartArea}>
            <div className={styles.yAxis}>
              {[200, 150, 100, 50].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className={styles.plot}>
              <div className={styles.groups}>
                {weeks.map((w, idx) => (
                  <div key={w} className={styles.group}>
                    <div
                      className={`${styles.bar} ${styles.c1}`}
                      style={{ height: `${(series[0][idx] / maxValue) * 100}%` }}
                    />
                    <div
                      className={`${styles.bar} ${styles.c2}`}
                      style={{ height: `${(series[1][idx] / maxValue) * 100}%` }}
                    />
                    <div
                      className={`${styles.bar} ${styles.c3}`}
                      style={{ height: `${(series[2][idx] / maxValue) * 100}%` }}
                    />
                    <span className={styles.xLabel}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.filterPanel}>
          <div className={styles.filterHeader}>FILTROS</div>
          <div className={styles.filterList}>
            {Object.keys(dataByFilter).map((k) => (
              <button
                key={k}
                type="button"
                className={`${styles.filterItem} ${active === k ? styles.active : ""}`}
                onClick={() => setActive(k as keyof typeof dataByFilter)}
              >
                {k}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {isEditOpen && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsEditOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3>Filtrar gráfico</h3>
              <button className={styles.closeBtn} type="button" onClick={() => setIsEditOpen(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.field}>
                <span>Mes</span>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {months.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>Año</span>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" size="small" type="button" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button variant="primary" size="small" type="button" onClick={() => setIsEditOpen(false)}>Aplicar</Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminChartsSection
