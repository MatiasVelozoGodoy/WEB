"use client"

import { useMemo, useState } from "react"
import styles from "./PatientHistorySection.module.scss"

type HistoryEntry = {
  id: string
  fecha: string
  hora: string
  titulo: string
  descripcion: string
  notas?: string
  adjuntos?: string[]
  odontograma?: boolean
}

type Archivo = {
  id: string
  nombre: string
  fechaInicio: string
  fechaFin?: string
  entradas: HistoryEntry[]
  tipo: "tratamiento" | "general"
}

type Tratamiento = {
  id: string
  nombre: string
  fechaInicio: string
  fechaFin?: string
  archivos: Archivo[]
  prescripcion?: string
  documentosClinicos?: string[]
  planTratamiento?: string
  diagnosticoBucal?: string
  progreso: number
}

type HistoryRecord = {
  date: string
  time?: string
  title?: string
  condition?: string
  diagnosis?: string
  medication?: string
  notes?: string
}

interface PatientHistoryProps {
  isAdmin?: boolean
  patientName?: string
  records?: HistoryRecord[]
}

const PatientHistorySection = ({ isAdmin = false, patientName = "Paciente", records = [] }: PatientHistoryProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTratamiento, setExpandedTratamiento] = useState<string | null>(null)
  const [expandedArchivo, setExpandedArchivo] = useState<string | null>(null)
  const [showAddTratamientoModal, setShowAddTratamientoModal] = useState(false)
  const [showAddArchivoModal, setShowAddArchivoModal] = useState(false)
  const [showAddEntradaModal, setShowAddEntradaModal] = useState(false)
  const [showTutorModal, setShowTutorModal] = useState(false)

  const tratamientos: Tratamiento[] = [
    {
      id: "t1",
      nombre: "Tratamiento de Caries",
      fechaInicio: "2024-01-15",
      fechaFin: "2024-03-10",
      progreso: 100,
      archivos: [
        {
          id: "a1",
          nombre: "Consultas Iniciales",
          fechaInicio: "2024-01-15",
          fechaFin: "2024-02-01",
          tipo: "tratamiento",
          entradas: [
            {
              id: "e1",
              fecha: "2024-01-15",
              hora: "10:00",
              titulo: "Consulta Inicial",
              descripcion: "Examen oral completo y diagnóstico de caries en piezas 16 y 24",
              notas: "Paciente presenta sensibilidad al frío. Se recomienda tratamiento inmediato.",
              odontograma: true,
            },
            {
              id: "e2",
              fecha: "2024-02-01",
              hora: "14:30",
              titulo: "Empaste Pieza #16",
              descripcion: "Procedimiento de empaste con resina compuesta",
              notas: "Procedimiento exitoso. Paciente toleró bien la anestesia local.",
              adjuntos: ["radiografia-16.jpg", "foto-post-empaste.jpg"],
              odontograma: true,
            },
          ],
        },
        {
          id: "a2",
          nombre: "Tratamiento Corona",
          fechaInicio: "2024-02-20",
          fechaFin: "2024-03-10",
          tipo: "tratamiento",
          entradas: [
            {
              id: "e3",
              fecha: "2024-02-20",
              hora: "11:00",
              titulo: "Preparación Corona #24",
              descripcion: "Preparación de pieza dental y colocación de corona temporal",
              notas: "Se tomaron impresiones para corona de porcelana. Paciente debe evitar alimentos duros.",
              odontograma: true,
            },
            {
              id: "e4",
              fecha: "2024-03-10",
              hora: "10:00",
              titulo: "Colocación Corona Permanente #24",
              descripcion: "Instalación de corona de porcelana permanente",
              notas: "Corona ajustada perfectamente. Paciente satisfecho con el resultado estético.",
              adjuntos: ["corona-final.jpg"],
              odontograma: true,
            },
          ],
        },
      ],
      prescripcion: "Ibuprofeno 400mg cada 8 horas por 3 días",
      planTratamiento: "Tratamiento en dos fases: empaste y corona",
      diagnosticoBucal: "Caries profunda en piezas 16 y 24",
    },
    {
      id: "t2",
      nombre: "Tratamiento de Endodoncia",
      fechaInicio: "2024-04-05",
      progreso: 40,
      archivos: [
        {
          id: "a3",
          nombre: "Fase 1 - Diagnóstico",
          fechaInicio: "2024-04-05",
          tipo: "tratamiento",
          entradas: [
            {
              id: "e5",
              fecha: "2024-04-05",
              hora: "09:30",
              titulo: "Evaluación Endodóntica",
              descripcion: "Evaluación de pieza #45 con dolor persistente",
              notas: "Radiografía muestra infección en raíz. Se programa endodoncia.",
              adjuntos: ["radiografia-45.jpg"],
              odontograma: true,
            },
          ],
        },
      ],
      planTratamiento: "Endodoncia en 2-3 sesiones",
      diagnosticoBucal: "Pulpitis irreversible pieza #45",
    },
  ]

  const defaultGenerales: Archivo[] = [
    {
      id: "g1",
      nombre: "Consultas Generales 2024",
      fechaInicio: "2024-01-01",
      tipo: "general",
      entradas: [
        {
          id: "eg1",
          fecha: "2024-01-10",
          hora: "15:00",
          titulo: "Limpieza Dental",
          descripcion: "Profilaxis y limpieza dental completa",
          notas: "Higiene oral buena. Se recomienda continuar con cepillado 3 veces al día.",
        },
        {
          id: "eg2",
          fecha: "2024-06-15",
          hora: "11:00",
          titulo: "Control Semestral",
          descripcion: "Revisión general y control de salud bucal",
          notas: "Sin novedades. Próximo control en 6 meses.",
        },
      ],
    },
  ]

  const consultasGenerales: Archivo[] = useMemo(() => {
    if (!records || records.length === 0) return defaultGenerales
    return [
      {
        id: "g-records",
        nombre: "Consultas Generales",
        fechaInicio: records[0]?.date ?? "",
        tipo: "general",
        entradas: records.map((r, i): HistoryEntry => ({
          id: `rec-${i}`,
          fecha: r.date ?? "-",
          hora: r.time ?? "-",
          titulo: r.title ?? r.condition ?? "Consulta",
          descripcion: r.diagnosis ? `Diagnóstico: ${r.diagnosis}` : r.medication ? `Medicación: ${r.medication}` : "Consulta",
          notas: r.notes,
        })),
      },
    ]
  }, [records])

  const filteredTratamientos = tratamientos.filter((t) => {
    const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    if (selectedFilter === "todos") return matchesSearch
    if (selectedFilter === "activos") return !t.fechaFin && matchesSearch
    if (selectedFilter === "completados") return t.fechaFin && matchesSearch
    return matchesSearch
  })

  const totalTratamientos = tratamientos.length
  const tratamientosCompletados = tratamientos.filter((t) => t.fechaFin).length
  const totalEntradas =
    tratamientos.reduce((sum, t) => sum + t.archivos.reduce((s, a) => s + a.entradas.length, 0), 0) +
    consultasGenerales.reduce((s, a) => s + a.entradas.length, 0)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Historia Clínica</h1>
          <p className={styles.subtitle}>Registro completo de tratamientos dentales de {patientName}</p>
        </div>
        {isAdmin && (
          <div className={styles.headerActions}>
            <button className={styles.addBtn} onClick={() => setShowTutorModal(true)}>+ Agregar Historia Clínica TUTOR</button>
          </div>
        )}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>{totalTratamientos}</h3>
            <p>Tratamientos Totales</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>{tratamientosCompletados}</h3>
            <p>Tratamientos Completados</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>{totalEntradas}</h3>
            <p>Entradas Registradas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <h3>{tratamientos[0]?.fechaInicio || "N/A"}</h3>
            <p>Última Consulta</p>
          </div>
        </div>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar tratamientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            inputMode="search"
          />
        </div>
        <div className={styles.filters}>
          {["todos", "activos", "completados"].map((filter) => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${selectedFilter === filter ? styles.active : ""}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tratamientosSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tratamientos</h2>
          {isAdmin && (
            <button className={styles.addBtn} onClick={() => setShowAddTratamientoModal(true)}>+ Nuevo Tratamiento</button>
          )}
        </div>

        {filteredTratamientos.map((tratamiento) => (
          <div key={tratamiento.id} className={styles.tratamientoCard}>
            <div
              className={styles.tratamientoHeader}
              role="button"
              tabIndex={0}
              aria-expanded={expandedTratamiento === tratamiento.id}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpandedTratamiento(expandedTratamiento === tratamiento.id ? null : tratamiento.id)}
              onClick={() => setExpandedTratamiento(expandedTratamiento === tratamiento.id ? null : tratamiento.id)}
            >
              <div className={styles.tratamientoTitle}>
                <h3>{tratamiento.nombre}</h3>
                <div className={styles.tratamientoMeta}>
                  <span>Inicio: {tratamiento.fechaInicio}</span>
                  {tratamiento.fechaFin && <span>• Fin: {tratamiento.fechaFin}</span>}
                </div>
              </div>
              <div className={styles.tratamientoActions}>
                <div className={styles.progressIndicator}>
                  <div className={styles.progressCircle}>
                    <svg viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#667eea" strokeWidth="3" strokeDasharray={`${tratamiento.progreso}, 100`} />
                    </svg>
                    <span>{tratamiento.progreso}%</span>
                  </div>
                </div>
                <span className={styles.expandIcon}>{expandedTratamiento === tratamiento.id ? "▼" : "▶"}</span>
              </div>
            </div>

            {expandedTratamiento === tratamiento.id && (
              <div className={styles.tratamientoDetails}>
                <div className={styles.tratamientoDocuments}>
                  <div className={styles.documentItem}>
                    <strong>Plan de Tratamiento:</strong>
                    <p>{tratamiento.planTratamiento || "No especificado"}</p>
                  </div>
                  <div className={styles.documentItem}>
                    <strong>Diagnóstico Bucal:</strong>
                    <p>{tratamiento.diagnosticoBucal || "No especificado"}</p>
                  </div>
                  {tratamiento.prescripcion && (
                    <div className={styles.documentItem}>
                      <strong>Prescripción:</strong>
                      <p>{tratamiento.prescripcion}</p>
                    </div>
                  )}
                </div>

                <div className={styles.archivosSection}>
                  <div className={styles.archivosSectionHeader}>
                    <h4>Archivos</h4>
                    {isAdmin && (
                      <button className={styles.addSmallBtn} onClick={() => setShowAddArchivoModal(true)}>+ Nuevo Archivo</button>
                    )}
                  </div>

                  {tratamiento.archivos.map((archivo) => (
                    <div key={archivo.id} className={styles.archivoCard}>
                      <div
                        className={styles.archivoHeader}
                        role="button"
                        tabIndex={0}
                        aria-expanded={expandedArchivo === archivo.id}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpandedArchivo(expandedArchivo === archivo.id ? null : archivo.id)}
                        onClick={() => setExpandedArchivo(expandedArchivo === archivo.id ? null : archivo.id)}
                      >
                        <div>
                          <h5>{archivo.nombre}</h5>
                          <span className={styles.archivoMeta}>
                            {archivo.fechaInicio} {archivo.fechaFin && `- ${archivo.fechaFin}`} • {archivo.entradas.length} entradas
                          </span>
                        </div>
                        <span className={styles.expandIconSmall}>{expandedArchivo === archivo.id ? "▼" : "▶"}</span>
                      </div>

                      {expandedArchivo === archivo.id && (
                        <div className={styles.entradasList}>
                          {isAdmin && (
                            <button className={styles.addEntryBtn} onClick={() => setShowAddEntradaModal(true)}>+ Agregar Entrada</button>
                          )}
                          {archivo.entradas.map((entrada) => (
                            <div key={entrada.id} className={styles.entradaCard}>
                              <div className={styles.entradaHeader}>
                                <div>
                                  <h6>{entrada.titulo}</h6>
                                  <span className={styles.entradaFecha}>{entrada.fecha} • {entrada.hora}</span>
                                </div>
                                {isAdmin && entrada.odontograma && <span className={styles.odontogramaBadge}>🦷 Odontograma</span>}
                              </div>
                              <p className={styles.entradaDescripcion}>{entrada.descripcion}</p>
                              {entrada.notas && (
                                <div className={styles.entradaNotas}>
                                  <strong>Notas:</strong> {entrada.notas}
                                </div>
                              )}
                              {entrada.adjuntos && entrada.adjuntos.length > 0 && (
                                <div className={styles.entradaAdjuntos}>
                                  <strong>Adjuntos:</strong>
                                  {entrada.adjuntos.map((adj, i) => (
                                    <span key={i} className={styles.adjuntoTag}>📎 {adj}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.generalSection}>
        <h2 className={styles.sectionTitle}>Consultas Generales</h2>
        {consultasGenerales.map((archivo) => (
          <div key={archivo.id} className={styles.archivoCard}>
            <div
              className={styles.archivoHeader}
              role="button"
              tabIndex={0}
              aria-expanded={expandedArchivo === archivo.id}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpandedArchivo(expandedArchivo === archivo.id ? null : archivo.id)}
              onClick={() => setExpandedArchivo(expandedArchivo === archivo.id ? null : archivo.id)}
            >
              <div>
                <h5>{archivo.nombre}</h5>
                <span className={styles.archivoMeta}>{archivo.entradas.length} consultas</span>
              </div>
              <span className={styles.expandIconSmall}>{expandedArchivo === archivo.id ? "▼" : "▶"}</span>
            </div>

            {expandedArchivo === archivo.id && (
              <div className={styles.entradasList}>
                {archivo.entradas.map((entrada) => (
                  <div key={entrada.id} className={styles.entradaCard}>
                    <div className={styles.entradaHeader}>
                      <div>
                        <h6>{entrada.titulo}</h6>
                        <span className={styles.entradaFecha}>{entrada.fecha} • {entrada.hora}</span>
                      </div>
                    </div>
                    <p className={styles.entradaDescripcion}>{entrada.descripcion}</p>
                    {entrada.notas && (
                      <div className={styles.entradaNotas}>
                        <strong>Notas:</strong> {entrada.notas}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddTratamientoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddTratamientoModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Nuevo Tratamiento</h2>
              <button className={styles.closeBtn} onClick={() => setShowAddTratamientoModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Nombre del Tratamiento</label>
                <input type="text" placeholder="Ej: Tratamiento de Ortodoncia" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Fecha de Inicio</label>
                <input type="date" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Plan de Tratamiento</label>
                <textarea placeholder="Descripción del plan de tratamiento" className={styles.textarea} rows={3}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Diagnóstico Bucal</label>
                <textarea placeholder="Diagnóstico inicial" className={styles.textarea} rows={3}></textarea>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowAddTratamientoModal(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={() => setShowAddTratamientoModal(false)}>Crear Tratamiento</button>
            </div>
          </div>
        </div>
      )}

      {showAddArchivoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddArchivoModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Nuevo Archivo</h2>
              <button className={styles.closeBtn} onClick={() => setShowAddArchivoModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Nombre del Archivo</label>
                <input type="text" placeholder="Ej: Consultas Enero 2024" className={styles.input} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fecha de Inicio</label>
                  <input type="date" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Fecha de Fin (opcional)</label>
                  <input type="date" className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Tipo</label>
                <select className={styles.input}>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowAddArchivoModal(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={() => setShowAddArchivoModal(false)}>Crear Archivo</button>
            </div>
          </div>
        </div>
      )}

      {showAddEntradaModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddEntradaModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Nueva Entrada</h2>
              <button className={styles.closeBtn} onClick={() => setShowAddEntradaModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Título</label>
                <input type="text" placeholder="Ej: Limpieza dental" className={styles.input} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fecha</label>
                  <input type="date" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Hora</label>
                  <input type="time" className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea placeholder="Descripción del procedimiento" className={styles.textarea} rows={3}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Notas Adicionales</label>
                <textarea placeholder="Notas del profesional" className={styles.textarea} rows={2}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Adjuntar Archivos</label>
                <div className={styles.fileUpload}>
                  <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
                  <p>📎 Arrastra archivos aquí o haz clic para seleccionar</p>
                </div>
              </div>
              {isAdmin && (
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span>Incluir Odontograma (solo visible para administradores)</span>
                  </label>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowAddEntradaModal(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={() => setShowAddEntradaModal(false)}>Agregar Entrada</button>
            </div>
          </div>
        </div>
      )}

      {showTutorModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTutorModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Nueva Historia Clínica TUTOR</h2>
              <button className={styles.closeBtn} onClick={() => setShowTutorModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>Crea una historia clínica para un tutelado (hijo, familiar a cargo, etc.)</p>
              <div className={styles.formGroup}>
                <label>Nombre del Tutelado</label>
                <input type="text" placeholder="Nombre completo" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>DNI</label>
                <input type="text" placeholder="Número de documento" className={styles.input} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Género</label>
                  <select className={styles.input}>
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Edad</label>
                  <input type="number" placeholder="Edad" className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Obra Social</label>
                <input type="text" placeholder="Nombre de la obra social" className={styles.input} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowTutorModal(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={() => setShowTutorModal(false)}>Crear Historia Clínica TUTOR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientHistorySection
