"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

type ValidationRules<T> = Partial<Record<keyof T, Array<(value: string) => boolean>>>

export const useForm = <T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationRules<T>,
  onSubmit: (values: T) => void | Promise<void>,
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name: keyof T, value: string): string | undefined => {
    const rules = validationRules[name]
    if (!rules) return undefined

    for (const rule of rules) {
      if (!rule(value)) {
        if (rule.name === "validateRequired") return "Este campo es requerido"
        if (rule.name === "validateEmail") return "Email inválido"
        if (rule.name === "validatePhone") return "Teléfono inválido"
        if (rule.name === "validateDNI") return "DNI inválido"
        return "Valor inválido"
      }
    }
    return undefined
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name as keyof T]) {
      const error = validateField(name as keyof T, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    const error = validateField(name as keyof T, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const setFieldValue = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors: Partial<Record<keyof T, string>> = {}
    let hasErrors = false

    Object.keys(values).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T])
      if (error) {
        newErrors[key as keyof T] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    if (!hasErrors) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
        setValues(initialValues)
        setTouched({})
        setErrors({})
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  }
}
