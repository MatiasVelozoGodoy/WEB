"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import { Edit, Trash2, Plus, X } from "lucide-react"
import DataTable from "@/components/DataTable/DataTable"
import Button from "@/components/UI/Button/Button"
import styles from "./AdminStockSection.module.scss"
import {
  getStock,
  createStock,
  updateStock,
  deleteStock,
  StockItem,
} from "@/services/stockService"
import { useAuth } from "@/context/AuthContext"

const AdminStockSection = () => {
  const { isAdmin } = useAuth()
  const [stock, setStock] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [form, setForm] = useState<StockItem>({
    id: "",
    product: "",
    category: "",
    quantity: 0,
    unit: "Unidad",
    price: 0,
  })
  const [deleteTarget, setDeleteTarget] = useState<StockItem | null>(null)

  useEffect(() => {
    fetchStock()
  }, [])

  const fetchStock = async () => {
    setLoading(true)
    try {
      const data = await getStock()
      setStock(data)
    } catch (err) {
      console.error("Error al obtener stock:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ id: "", product: "", category: "", quantity: 0, unit: "Unidad", price: 0 })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }))
  }

  const openAdd = () => {
    resetForm()
    setIsAddOpen(true)
  }

  const saveAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return alert("No autorizado")
    try {
      const result = await createStock(form)
      if (result.isOK) {
        await fetchStock()
        setIsAddOpen(false)
        resetForm()
      } else {
        alert(result.message || "Error al crear producto")
      }
    } catch (err) {
      console.error("Error al crear stock:", err)
    }
  }

  const openEdit = (row: StockItem) => {
    const idx = stock.findIndex((s) => s.id === row.id)
    if (idx === -1) return
    setEditingIndex(idx)
    setForm(row)
    setIsEditOpen(true)
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin || !form.id) return alert("No autorizado o ID inválido")
    try {
      const result = await updateStock(form.id, form)
      if (result.isOK) {
        await fetchStock()
        setIsEditOpen(false)
        setEditingIndex(null)
        resetForm()
      } else {
        alert(result.message || "Error al actualizar producto")
      }
    } catch (err) {
      console.error("Error al editar stock:", err)
    }
  }

  const confirmDelete = (row: StockItem) => {
    setDeleteTarget(row)
  }

  const performDelete = async () => {
    if (!deleteTarget || !isAdmin) return
    try {
      const result = await deleteStock(deleteTarget.id!)
      if (result.isOK) {
        await fetchStock()
      } else {
        alert(result.message || "Error al eliminar producto")
      }
    } catch (err) {
      console.error("Error al eliminar stock:", err)
    } finally {
      setDeleteTarget(null)
    }
  }

  const columns = [
    { key: "product", label: "Producto" },
    { key: "category", label: "Categoría" },
    { key: "quantity", label: "Cantidad" },
    { key: "unit", label: "Unidad" },
    { key: "price", label: "Precio" },
  ]

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
          Cargando productos...
        </motion.p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div className={styles.searchWrap}>
          <input className={styles.searchInput} placeholder="Buscar stock..." onChange={() => {}} />
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={openAdd}>
            <Plus size={18} />
            Añadir Stock
          </Button>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando stock...</div>
      ) : (
        <DataTable
          columns={columns}
          data={stock}
          selectable
          onSelectionChange={() => {}}
          actions={[
            { icon: <Edit />, label: "Editar", onClick: (row) => openEdit(row as StockItem) },
            { icon: <Trash2 />, label: "Eliminar", onClick: (row) => confirmDelete(row as StockItem) },
          ]}
        />
      )}


      {isAddOpen && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsAddOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Añadir Stock</h3>
              <button className={styles.iconButton} onClick={() => setIsAddOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveAdd} className={styles.modalBody}>
              <div className={styles.modalGrid}>
                {["product", "category", "unit"].map((field) => (
                  <label className={styles.field} key={field}>
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    {field === "unit" ? (
                      <select name="unit" value={(form as any)[field]} onChange={handleChange}>
                        <option value="Unidad">Unidad</option>
                        <option value="Caja">Caja</option>
                        <option value="Pack">Pack</option>
                        <option value="ml">ml</option>
                        <option value="gr">gr</option>
                      </select>
                    ) : (
                      <input name={field} value={(form as any)[field]} onChange={handleChange} required />
                    )}
                  </label>
                ))}
                <label className={styles.field}>
                  <span>Cantidad</span>
                  <input name="quantity" type="number" min={0} value={form.quantity} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Precio</span>
                  <input name="price" type="number" min={0} step="0.01" value={form.price} onChange={handleChange} required />
                </label>
              </div>
              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="primary">Guardar</Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Modal Editar */}
      {isEditOpen && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsEditOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Stock</h3>
              <button className={styles.iconButton} onClick={() => setIsEditOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveEdit} className={styles.modalBody}>
              <div className={styles.modalGrid}>
                {["product", "category", "unit"].map((field) => (
                  <label className={styles.field} key={field}>
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    {field === "unit" ? (
                      <select name="unit" value={(form as any)[field]} onChange={handleChange}>
                        <option value="Unidad">Unidad</option>
                        <option value="Caja">Caja</option>
                        <option value="Pack">Pack</option>
                        <option value="ml">ml</option>
                        <option value="gr">gr</option>
                      </select>
                    ) : (
                      <input name={field} value={(form as any)[field]} onChange={handleChange} required />
                    )}
                  </label>
                ))}
                <label className={styles.field}>
                  <span>Cantidad</span>
                  <input name="quantity" type="number" min={0} value={form.quantity} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Precio</span>
                  <input name="price" type="number" min={0} step="0.01" value={form.price} onChange={handleChange} required />
                </label>
              </div>
              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="primary">Guardar cambios</Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Modal Eliminar */}
      {deleteTarget && (
        <>
          <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)} />
          <div className={styles.modalDelete} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Eliminar Producto</h3>
              <button className={styles.iconButton} onClick={() => setDeleteTarget(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>¿Seguro que quieres eliminar <strong>{deleteTarget.product}</strong>?</p>
              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
                <Button variant="primary" onClick={performDelete}>Eliminar</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminStockSection
