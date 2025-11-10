"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import PageHero from "../../components/UI/PageHero/PageHero";
import Button from "../../components/UI/Button/Button";
import hero from "./../../assets/images/appointmentBG.jpg";
import { useAuth } from "@/context/AuthContext";
import styles from "./Appointment.module.scss";

import { createAppointment, combineDateTime } from "@/services/appointmentService";

const Appointment = () => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [times, setTimes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn]);

  useEffect(() => {
    const day = selectedDate.getDay();
    const availableTimes =
      day === 1 || day === 3
        ? ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"]
        : ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
    setTimes(availableTimes);
    setSelectedTime("");
  }, [selectedDate]);

const handleSubmit = async () => {
  if (!selectedTime || !currentUser) {
    console.warn("⛔ No hay hora seleccionada o usuario no está definido:", { selectedTime, currentUser });
    return;
  }

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.warn("⚠️ No hay token de autenticación en localStorage");
    navigate("/login");
    return;
  }

  const datetimeISO = combineDateTime(selectedDate, selectedTime);

  // 🔍 Muestra exactamente lo que se enviará
  const payload = {
    clientId: currentUser.id,
    date: datetimeISO,
    reason: "consulta",
    state: "pendiente",
  };

  console.log("📤 Enviando turno al backend:", payload);

  setLoading(true);
  try {
    const response = await createAppointment(payload, authToken);
    console.log("✅ Respuesta del backend:", response);
    setShowModal(true);
  } catch (err: any) {
    console.error("❌ Error en la solicitud:", err);

    // Si Axios trae respuesta del backend, la mostramos también
    if (err.response) {
      console.error("📩 Respuesta del servidor:", err.response.data);
      console.error("📊 Status:", err.response.status);
    } else {
      console.error("🚫 Error sin respuesta del servidor:", err.message);
    }

    alert("Error al agendar el turno. Revisá la consola.");
  } finally {
    setLoading(false);
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/dashboard/paciente/turnos");
  };

  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const dayNames = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth()+1, 0).getDate();
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

  return (
    <div className={styles.appointmentPage}>
      <PageHero title="SACAR TURNO" subtitle="Agendá tu turno fácilmente" backgroundImage={hero} />

      <section className={styles.appointmentSection}>
        <div className={styles.container}>
          <div className={styles.leftPanel}>
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth()-1, 1))}><ChevronLeft size={20}/></button>
                <h3>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth()+1, 1))}><ChevronRight size={20}/></button>
              </div>
              <div className={styles.calendarGrid}>
                {dayNames.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
                {Array.from({length: firstDay}).map((_,i)=><div key={`empty-${i}`} className={styles.emptyDay}/>)}
                {Array.from({length: daysInMonth}).map((_,i)=>{
                  const day = i+1;
                  const isSelected = day === selectedDate.getDate();
                  return <button key={day} className={`${styles.day} ${isSelected ? styles.selected : ""}`} onClick={()=>setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}>{day}</button>
                })}
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.timeSelection}>
              <h3>Elegí una hora</h3>
              <div className={styles.timeList}>
                {times.map(t => <button key={t} className={`${styles.timeButton} ${selectedTime===t ? styles.selected : ""}`} onClick={()=>setSelectedTime(t)}>{t}</button>)}
              </div>
            </div>

            <div className={styles.bookButton}>
              <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Agendando..." : "AGENDAR"}</Button>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <CheckCircle size={60} color="#4caf50"/>
            <h2>¡Turno agendado!</h2>
            <p>Tu turno fue registrado para <strong>{selectedDate.toLocaleDateString("es-AR", { timeZone:"America/Argentina/Buenos_Aires" })}</strong> a las <strong>{selectedTime}</strong>.</p>
            <Button variant="primary" onClick={handleCloseModal}>Ir a mi perfil</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
