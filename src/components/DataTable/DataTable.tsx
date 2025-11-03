"use client"

import type { ReactNode } from "react"
import { useMemo, useState, useEffect } from "react"
import styles from "./DataTable.module.scss"

interface Column {
  key: string
  label: string
}

interface Action {
  icon: ReactNode
  label: string
  onClick: (row: any) => void
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  actions?: Action[]
  selectable?: boolean
  onSelectionChange?: (rows: any[]) => void
}

const DataTable = ({ columns, data, actions, selectable = false, onSelectionChange }: DataTableProps) => {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    const q1 = window.matchMedia("(max-width: 380px)")
    const q2 = window.matchMedia("(max-width: 640px)")
    const q3 = window.matchMedia("(max-width: 768px)")
    const update = () => {
      if (q1.matches) setPageSize(4)
      else if (q2.matches) setPageSize(4)
      else if (q3.matches) setPageSize(5)
      else setPageSize(8)
    }
    update()
    q1.addEventListener("change", update)
    q2.addEventListener("change", update)
    q3.addEventListener("change", update)
    return () => {
      q1.removeEventListener("change", update)
      q2.removeEventListener("change", update)
      q3.removeEventListener("change", update)
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const pageData = useMemo(() => data.slice(startIndex, startIndex + pageSize), [data, startIndex, pageSize])
  const pageIndices = useMemo(() => pageData.map((_, i) => startIndex + i), [pageData, startIndex])
  const allSelected = useMemo(() => pageIndices.length > 0 && pageIndices.every(i => selected.has(i)), [pageIndices, selected])
  const someSelected = useMemo(() => !allSelected && pageIndices.some(i => selected.has(i)), [pageIndices, selected, allSelected])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  const toggleAll = () => {
    const next = new Set(selected)
    if (allSelected) pageIndices.forEach(i => next.delete(i))
    else pageIndices.forEach(i => next.add(i))
    setSelected(next)
    onSelectionChange?.(Array.from(next).map(i => data[i]).filter(Boolean))
  }

  const toggleOne = (idxGlobal: number) => {
    const next = new Set(selected)
    if (next.has(idxGlobal)) next.delete(idxGlobal)
    else next.add(idxGlobal)
    setSelected(next)
    onSelectionChange?.(Array.from(next).map(i => data[i]).filter(Boolean))
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable && (
              <th className={styles.selectHeader}>
                <label className={styles.checkboxWrap}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleAll}
                    aria-label="Seleccionar página"
                  />
                  <span />
                </label>
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && actions.length > 0 && <th className={styles.actionsHeader}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => {
            const idxGlobal = startIndex + i
            return (
              <tr key={idxGlobal}>
                {selectable && (
                  <td className={styles.selectCell}>
                    <label className={styles.checkboxWrap}>
                      <input
                        type="checkbox"
                        checked={selected.has(idxGlobal)}
                        onChange={() => toggleOne(idxGlobal)}
                        aria-label="Seleccionar fila"
                      />
                      <span />
                    </label>
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
                {actions && actions.length > 0 && (
                  <td className={styles.actionsCell}>
                    <div className={styles.actions}>
                      {actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          className={styles.actionButton}
                          onClick={() => action.onClick(row)}
                          title={action.label}
                          type="button"
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.pagerButton}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Anterior"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
        <span className={styles.pageInfo}>{page} / {totalPages}</span>
        <button
          type="button"
          className={styles.pagerButton}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Siguiente"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
      </div>
    </div>
  )
}

export default DataTable
