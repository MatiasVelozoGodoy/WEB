"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, X } from "lucide-react"
import DataTable from "@/components/DataTable/DataTable"
import Button from "@/components/UI/Button/Button"
import { adminStock as initialStock } from "../../../data/dashboardData"
import styles from "./AdminStockSection.module.scss"

type StockRow = {
  product: string
  category: string
  quantity: number
  unit: string
  price: number
}

const AdminStockSection = () => {
  const [stock, setStock] = useState<StockRow[]>(initialStock)
  const [selectedRows, setSelectedRows] = useState<StockRow[]>([])
  const [query, setQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [form, setForm] = useState<StockRow>({
    product: "",
    category: "",
    quantity: 0,
    unit: "Unidad",
    price: 0,
  })

  const stockColumns = [
    { key: "product", label: "Producto" },
    { key: "category", label: "Categoría" },
    { key: "quantity", label: "Cantidad" },
    { key: "unit", label: "Unidad" },
    { key: "price", label: "Precio" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }))
  }

  const openAdd = () => {
    setForm({ product: "", category: "", quantity: 0, unit: "Unidad", price: 0 })
    setIsAddOpen(true)
  }

  const saveAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setStock((prev) => [form, ...prev])
    setIsAddOpen(false)
  }

  const openEdit = (row: StockRow) => {
    const idx = stock.indexOf(row)
    if (idx === -1) return
    setEditingIndex(idx)
    setForm(row)
    setIsEditOpen(true)
  }

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingIndex === null) return
    const next = [...stock]
    next[editingIndex] = form
    setStock(next)
    setIsEditOpen(false)
    setEditingIndex(null)
  }

  const removeRow = (row: StockRow) => {
    const idx = stock.indexOf(row)
    if (idx === -1) return
    setStock((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <section id="stock" className={styles.section}>
      <div className={styles.headerRow}>
           <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            placeholder="Buscar stock..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={18} />
          Añadir Stock
        </Button>
      </div>

      <DataTable
        columns={stockColumns}
        data={stock}
        selectable
        onSelectionChange={(rows) => setSelectedRows(rows as StockRow[])}
        actions={[
          { icon: <Edit />, label: "Editar", onClick: (row) => openEdit(row as StockRow) },
          { icon: <Trash2 />, label: "Eliminar", onClick: (row) => removeRow(row as StockRow) },
        ]}
      />

      {isAddOpen && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsAddOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Añadir Stock</h3>
              <button className={styles.iconButton} onClick={() => setIsAddOpen(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveAdd} className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <label className={styles.field}>
                  <span>Producto</span>
                  <input name="product" value={form.product} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Categoría</span>
                  <input name="category" value={form.category} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Cantidad</span>
                  <input name="quantity" type="number" min={0} value={form.quantity} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Unidad</span>
                  <select name="unit" value={form.unit} onChange={handleChange} required>
                    <option value="Unidad">Unidad</option>
                    <option value="Caja">Caja</option>
                    <option value="Pack">Pack</option>
                    <option value="ml">ml</option>
                    <option value="gr">gr</option>
                  </select>
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

      {isEditOpen && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsEditOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Stock</h3>
              <button className={styles.iconButton} onClick={() => setIsEditOpen(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveEdit} className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <label className={styles.field}>
                  <span>Producto</span>
                  <input name="product" value={form.product} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Categoría</span>
                  <input name="category" value={form.category} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Cantidad</span>
                  <input name="quantity" type="number" min={0} value={form.quantity} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  <span>Unidad</span>
                  <select name="unit" value={form.unit} onChange={handleChange} required>
                    <option value="Unidad">Unidad</option>
                    <option value="Caja">Caja</option>
                    <option value="Pack">Pack</option>
                    <option value="ml">ml</option>
                    <option value="gr">gr</option>
                  </select>
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
    </section>
  )
}

export default AdminStockSection
