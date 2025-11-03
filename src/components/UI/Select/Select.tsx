"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./Select.module.scss"

interface SelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
}

const Select = ({ label, name, value, onChange, options, error, required }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={styles.selectWrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.selectContainer}>
        <button
          type="button"
          className={`${styles.select} ${error ? styles.error : ""} ${isOpen ? styles.open : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? styles.selected : styles.placeholder}>
            {selectedOption ? selectedOption.label : "Seleccionar"}
          </span>
          <ChevronDown className={styles.icon} />
        </button>
        {isOpen && (
          <ul className={styles.dropdown} role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.option} ${value === option.value ? styles.active : ""}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}

export default Select
