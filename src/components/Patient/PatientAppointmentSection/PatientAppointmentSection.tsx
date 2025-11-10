"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  X,
  Ban,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import DataTable from "@/components/DataTable/DataTable";
import styles from "./PatientAppointmentSection.module.scss";
import Button from "@/components/UI/Button/Button";
import { getUserAppointments, cancelAppointment } from "@/services/appointmentService";

type Row = {
  id: string;
  date: string;
  time: string;
  reason: string;
  insurance?: string;
  payment?: string;
  status: "Completado" | "Pendiente" | "Cancelado";
};

const columns = [
  { key: "date", label: "Fecha" },
  { key: "time", label: "Hora" },
  { key: "reason", label: "Motivo" },
  { key: "payment", label: "Pago" },
  { key: "status", label: "Estado" },
];

const PatientAppointments = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCancel, setShowCancel] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] });
  const [viewRow, setViewRow] = useState<Row | null>(null);

  // --- Fetch appointments from API ---
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const data = await getUserAppointments(token);

        const formatted: Row[] = data.map((appt: any) => {
          const dateObj = new Date(appt.date);
          return {
            id: appt.id,
            date: dateObj.toLocaleDateString("es-AR"),
            time: dateObj.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
            reason: appt.reason || "Consulta",
            insurance: appt.insurance || "-",
            payment: appt.payment || "Pendiente",
            status:
              appt.state === "pendiente"
                ? "Pendiente"
                : appt.state === "completado"
                ? "Completado"
                : "Cancelado",
          };
        });

        setRows(formatted);
      } catch (err) {
        console.error("Error cargando turnos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // --- Cancel logic ---
  const handleCancel = async (ids: string[]) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      for (const id of ids) {
        await cancelAppointment(id, token);
      }

      // Actualiza la UI local
      setRows((prev) =>
        prev.map((r) =>
          ids.includes(r.id) ? { ...r, status: "Cancelado" } : r
        )
      );

      setSelectedIds([]);
      setShowCancel({ open: false, ids: [] });
    } catch (err) {
      console.error("Error cancelando turnos:", err);
    }
  };

  // --- Stats ---
  const stats = useMemo(() => {
    const completed = rows.filter((a) => a.status === "Completado").length;
    const pending = rows.filter((a) => a.status === "Pendiente").length;
    const cancelled = rows.filter((a) => a.status === "Cancelado").length;
    return { completed, pending, cancelled };
  }, [rows]);

  const openCancelSelected = () => {
    if (selectedIds.length === 0) return;
    setShowCancel({ open: true, ids: selectedIds });
  };

  return (
    <DashboardLayout userType="cliente" userRole="cliente" userName="Paciente">
      <div className={styles.page}>
        {/* --- Header --- */}
        <div className={styles.headerRow}>
          <button
            className={`${styles.cancelBulkBtn} ${selectedIds.length === 0 ? styles.disabled : ""}`}
            onClick={openCancelSelected}
            disabled={selectedIds.length === 0}
          >
            <Ban size={20} />
            <span>Cancelar Turno</span>
          </button>
        </div>

        {/* --- Summary cards --- */}
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <CheckCircle2 size={26} />
            <div className={styles.summaryNumber}>{stats.completed}</div>
            <div className={styles.summaryLabel}>Completos</div>
          </div>
          <div className={styles.summaryCard}>
            <Clock3 size={26} />
            <div className={styles.summaryNumber}>{stats.pending}</div>
            <div className={styles.summaryLabel}>Pendientes</div>
          </div>
          <div className={styles.summaryCard}>
            <XCircle size={26} />
            <div className={styles.summaryNumber}>{stats.cancelled}</div>
            <div className={styles.summaryLabel}>Cancelados</div>
          </div>
        </div>

        {/* --- Table --- */}
        <div className={styles.tableCard}>
          <DataTable
            columns={columns}
            data={rows}
            selectable
            loading={loading}
            onSelectionChange={(ids: string[]) => setSelectedIds(ids)}
            actions={[
              { icon: <Eye />, label: "Ver", onClick: (row: Row) => setViewRow(row) },
              { icon: <X />, label: "Cancelar", onClick: (row: Row) => setShowCancel({ open: true, ids: [row.id] }) },
            ]}
          />
        </div>

        {/* --- Modal ver detalle --- */}
        {viewRow && (
          <>
            <div className={styles.modalOverlay} onClick={() => setViewRow(null)} />
            <div className={styles.modalWrap}>
              <div className={styles.modal}>
                <div className={styles.modalHead}>
                  <h4>Detalle del Turno</h4>
                  <button className={styles.iconBtn} onClick={() => setViewRow(null)}>✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.field}><label>Fecha</label><div>{viewRow.date}</div></div>
                  <div className={styles.field}><label>Hora</label><div>{viewRow.time}</div></div>
                  <div className={styles.field}><label>Motivo</label><div>{viewRow.reason}</div></div>
                  <div className={styles.field}><label>Seguro</label><div>{viewRow.insurance}</div></div>
                  <div className={styles.field}><label>Pago</label><div>{viewRow.payment}</div></div>
                  <div className={styles.field}><label>Estado</label><div>{viewRow.status}</div></div>
                </div>
                <div className={styles.modalFoot}>
                  <Button onClick={() => setViewRow(null)}>Cerrar</Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- Modal cancelar --- */}
        {showCancel.open && (
          <>
            <div
              className={styles.modalOverlay}
              onClick={() => setShowCancel({ open: false, ids: [] })}
            />
            <div className={styles.modalWrap}>
              <div className={styles.modal}>
                <div className={styles.modalHead}>
                  <h4>Cancelar turno{showCancel.ids.length > 1 ? "s" : ""}</h4>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.note}>
                    Se marcarán como <strong>Cancelado</strong> {showCancel.ids.length} turno(s).
                  </div>
                </div>
                <div className={styles.modalFoot}>
                  <Button onClick={() => setShowCancel({ open: false, ids: [] })}>Volver</Button>
                  <Button onClick={() => handleCancel(showCancel.ids)}>Confirmar cancelación</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
