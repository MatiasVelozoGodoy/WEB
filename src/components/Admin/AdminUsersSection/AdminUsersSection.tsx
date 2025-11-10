"use client";

import { useMemo, useState, useEffect } from "react";
import { Eye, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/UI/Button/Button";
import DataTable from "../../DataTable/DataTable";
import { motion } from "framer-motion";
import styles from "./AdminUsersSection.module.scss";
import { getUsers, updateUser, deleteUser } from "@/services/userService";

const AdminUsersSection = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editDraft, setEditDraft] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const authToken = localStorage.getItem("authToken");

  // 🔹 Cargar solo clientes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(authToken!);
        const clientes = data.filter((u: any) => u.userType === "cliente");
        setUsers(clientes);
      } catch (err) {
        console.error("Error cargando usuarios", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [authToken]);

  const columns = [
    { key: "fullName", label: "Nombre" },
    { key: "dni", label: "DNI" },
    { key: "phone", label: "Teléfono" },
    { key: "insurance", label: "Obra Social" },
    { key: "treatment", label: "Tratamiento Actual" },
    { key: "history", label: "Historia Clínica" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.fullName, u.dni, u.phone, u.email, u.insurance]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, query]);

  const tableData = useMemo(
    () =>
      filtered.map((u) => ({
        id: u.id,
        __raw: u,
        fullName: (
          <div className={styles.nameCell}>
            <span className={styles.nameText}>{u.fullName}</span>
          </div>
        ),
        dni: u.dni || "-",
        phone: u.phone || "-",
        insurance: u.insurance || "-",
        treatment: (
          <button
            type="button"
            className={styles.linkCell}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/admin/pacientes/${u.id}/tratamiento`, {
                state: { mode: "admin" },
              });
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
              e.stopPropagation();
              navigate(`/dashboard/admin/pacientes/${u.id}/historia`, {
                state: { mode: "admin" },
              });
            }}
          >
            IR A HISTORIA CLÍNICA
          </button>
        ),
      })),
    [filtered, navigate]
  );

  const actions = [
    {
      icon: <Eye />,
      label: "Ver",
      onClick: (row: any) => setViewUser(row.__raw),
    },
    {
      icon: <Edit />,
      label: "Editar",
      onClick: (row: any) => {
        const u = row.__raw;
        setEditDraft(u);
        setEditUser(u);
      },
    },
    {
      icon: <Trash2 />,
      label: "Eliminar",
      onClick: (row: any) => {
        setDeleteTarget(row.__raw);
      },
    },
  ];

  const saveEdit = async () => {
    if (!editUser) return;
    try {
      await updateUser(editUser.id, editDraft, authToken!);
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...editDraft } : u))
      );
      setEditUser(null);
    } catch (err) {
      console.error("Error actualizando usuario", err);
    }
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id, authToken!);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error eliminando usuario", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loader}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.p
          className={styles.loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Cargando usuarios...
        </motion.p>
      </div>
    );
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

      <DataTable columns={columns} data={tableData} actions={actions} selectable />

      {/* Modal Ver */}
      {viewUser && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setViewUser(null)}
          />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ver Usuario</h3>
              <button
                className={styles.closeX}
                onClick={() => setViewUser(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Nombre</span>
                <span>{viewUser.fullName}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>DNI</span>
                <span>{viewUser.dni}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Email</span>
                <span>{viewUser.email}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Teléfono</span>
                <span>{viewUser.phone}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Obra Social</span>
                <span>{viewUser.insurance}</span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setViewUser(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal Editar */}
      {editUser && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setEditUser(null)}
          />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Usuario</h3>
              <button
                className={styles.closeX}
                onClick={() => setEditUser(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Nombre Completo</span>
                  <input
                    value={editDraft.fullName ?? ""}
                    onChange={(e) =>
                      setEditDraft((d: any) => ({ ...d, fullName: e.target.value }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>DNI</span>
                  <input
                    value={editDraft.dni ?? ""}
                    onChange={(e) =>
                      setEditDraft((d: any) => ({ ...d, dni: e.target.value }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>Teléfono</span>
                  <input
                    value={editDraft.phone ?? ""}
                    onChange={(e) =>
                      setEditDraft((d: any) => ({ ...d, phone: e.target.value }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    value={editDraft.email ?? ""}
                    onChange={(e) =>
                      setEditDraft((d: any) => ({ ...d, email: e.target.value }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>Obra Social</span>
                  <input
                    value={editDraft.insurance ?? ""}
                    onChange={(e) =>
                      setEditDraft((d: any) => ({ ...d, insurance: e.target.value }))
                    }
                  />
                </label>
              </div>
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setEditUser(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={saveEdit}>
                Guardar
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal Eliminar Usuario */}
      {deleteTarget && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setDeleteTarget(null)}
          />
          <div className={styles.modalDelete} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Eliminar Usuario</h3>
              <button
                className={styles.iconButton}
                onClick={() => setDeleteTarget(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                ¿Seguro que quieres eliminar a{" "}
                <strong>{deleteTarget.fullName}</strong>?
              </p>
              <div className={styles.modalActions}>
                <Button
                  variant="secondary"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" onClick={performDelete}>
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminUsersSection;
