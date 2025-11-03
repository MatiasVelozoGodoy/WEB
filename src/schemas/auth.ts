import { z } from "zod"

const GENDERS = ["masculino", "femenino", "otro"] as const
const INSURANCES = ["galeno", "swiss", "medife", "sancor", "ospim", "ospjn", "galeno", "issunne", "otro", "ninguna"] as const

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo electrónico es obligatorio")
    .email("Por favor, ingresá un correo electrónico válido")
    .toLowerCase(),
  password: z.string().min(1, "La contraseña es obligatoria").min(8, "La contraseña debe tener al menos 8 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "El nombre completo es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre es demasiado largo")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
    dni: z
      .string()
      .trim()
      .min(1, "El DNI es obligatorio")
      .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos sin puntos"),
    gender: z
      .string()
      .min(1, "Por favor, seleccioná tu género")
      .refine((v) => (GENDERS as readonly string[]).includes(v), {
        message: "Seleccioná una opción válida",
      }),
    email: z
      .string()
      .trim()
      .min(1, "El correo electrónico es obligatorio")
      .email("Por favor, ingresá un correo electrónico válido")
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .min(1, "El teléfono es obligatorio")
      .regex(/^\d{7,15}$/, "El teléfono debe tener entre 7 y 15 dígitos sin espacios"),
    birthDate: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine(
        (date) => {
          const birthDate = new Date(date)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          return age >= 18 && age <= 90
        },
        { message: "Debés tener al menos 18 años para registrarte" },
      ),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Por favor, confirmá tu contraseña"),
    insurance: z
      .string()
      .min(1, "Por favor, seleccioná tu obra social")
      .refine((v) => (INSURANCES as readonly string[]).includes(v), {
        message: "Seleccioná una opción válida",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { strength: 1, label: "Débil", color: "#e74c3c" }
  if (strength <= 4) return { strength: 2, label: "Media", color: "#f39c12" }
  return { strength: 3, label: "Fuerte", color: "#27ae60" }
}
