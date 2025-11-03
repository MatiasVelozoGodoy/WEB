"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Instagram,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";
import Button from "@/components/UI/Button/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
  getPasswordStrength,
} from "../../schemas/auth";
import { registerUser } from "@/services/authService";
import styles from "./Register.module.scss";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      dni: "",
      email: "",
      phone: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
      gender: "",
      insurance: "",
    },
  });

  const password = watch("password");
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMsg(null);

      const userData = {
        fullName: data.fullName,
        dni: data.dni,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        insurance: data.insurance,
        password: data.password,
      };

      await registerUser(userData);
      setShowSuccess(true);
      reset();

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Error al registrar usuario:", err);
      const message =
        err.response?.data?.message || "Error al registrar el usuario";
      setErrorMsg(message);
    }
  };

  return (
    <div className={styles.registerPage}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.leftPanel}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
          </div>
          <h1 className={styles.welcome}>¡Unite a nosotros!</h1>
          <p className={styles.description}>
            Creá tu cuenta y comenzá a disfrutar de una experiencia odontológica moderna y personalizada
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/lavalle.odontologia/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.rightPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Crear Cuenta</h2>
            <p className={styles.subtitle}>Completá tus datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Nombre Completo"
                      placeholder="Juan Pérez"
                      leftIcon={<User size={20} />}
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>

              <div className={styles.field}>
                <Controller
                  name="dni"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="DNI"
                      placeholder="43747511"
                      leftIcon={<Shield size={20} />}
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      leftIcon={<Mail size={20} />}
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>

              <div className={styles.field}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Teléfono"
                      type="tel"
                      placeholder="3794532535"
                      leftIcon={<Phone size={20} />}
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      leftIcon={<Calendar size={20} />}
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Género"
                      name={field.name}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      options={[
                        { value: "masculino", label: "Masculino" },
                        { value: "femenino", label: "Femenino" },
                        { value: "otro", label: "Otro" },
                      ]}
                      error={fieldState.error?.message}
                      required
                    />
                  )}
                />
              </div>

              <div className={styles.field}>
                <Controller
                  name="insurance"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Obra Social"
                      name={field.name}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      options={[
                        { value: "jersal", label: "Jerárquicos Salud" },
                        { value: "swiss", label: "Swiss Medical" },
                        { value: "medife", label: "Medifé" },
                        { value: "sancor", label: "SanCor Salud" },
                        { value: "ospim", label: "OSPIM" },
                        { value: "galeno", label: "Galeno" },
                        { value: "issunne", label: "ISSUNNE" },
                        { value: "ospjn", label: "OSPJN" },
                        { value: "otro", label: "Otro" },
                        { value: "ninguna", label: "Ninguna" },
                      ]}
                      error={fieldState.error?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <div className={styles.passwordField}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className={styles.inputWrapper}>
                        <Input
                          label="Contraseña"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          error={fieldState.error?.message}
                          required
                          {...field}
                        />
                        <button
                          type="button"
                          className={styles.eyeButton}
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    )}
                  />
                </div>

                {passwordStrength && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div
                        className={styles.strengthFill}
                        style={{
                          width: `${(passwordStrength.strength / 3) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span
                      className={styles.strengthLabel}
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.passwordField}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className={styles.inputWrapper}>
                        <Input
                          label="Confirmar Contraseña"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          error={fieldState.error?.message}
                          required
                          {...field}
                        />
                        <button
                          type="button"
                          className={styles.eyeButton}
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          aria-label={
                            showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                          }
                        >
                          {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={styles.loadingText}>
                  <span className={styles.spinner}></span>
                  Registrando...
                </span>
              ) : (
                "Crear Cuenta"
              )}
            </Button>

            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

            <p className={styles.loginLink}>
              ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión aquí</Link>
            </p>
          </form>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
            />
            <motion.div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className={styles.modalIcon}>
                <CheckCircle size={32} />
              </div>
              <h3 id="modal-title" className={styles.modalTitle}>
                ¡Registro Exitoso!
              </h3>
              <p className={styles.modalBody}>
                Tu cuenta ha sido creada correctamente. Ya podés iniciar sesión y comenzar a gestionar tus turnos.
              </p>
              <div className={styles.modalActions}>
                <Link to="/login">
                  <Button variant="primary">Ir a Iniciar Sesión</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
