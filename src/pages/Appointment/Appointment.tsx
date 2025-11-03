"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import PageHero from "../../components/UI/PageHero/PageHero";
import Button from "../../components/UI/Button/Button";
import hero from "./../../assets/images/appointmentBG.jpg";
import { useAuth } from "@/context/AuthContext";
import styles from "./Appointment.module.scss";

const Appointment = () => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [times, setTimes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth/login", { replace: true });
  }, [isLoggedIn]);

  // Generador de horarios según el día
  useEffect(() => {
    const day = selectedDate.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
    let availableTimes: string[];

    if (day === 1 || day === 3) {
      // Martes o Jueves: desde las 14:00
      availableTimes = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
    } else {
      // Otros días: desde las 9:00
      availableTimes = [
        "09:00","09:30","10:00","10:30","11:00","11:30",
        "12:00","12:30","13:00","13:30","14:00","14:30",
        "15:00","15:30","16:00","16:30","17:00",
      ];
    }

    setTimes(availableTimes);
    setSelectedTime(""); // resetear hora si cambia el día
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleSubmit = () => {
    if (!selectedTime) {
      alert("Debes seleccionar una hora.");
      return;
    }

    const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    storedAppointments.push({
      date: selectedDate.toISOString(),
      time: selectedTime,
    });
    localStorage.setItem("appointments", JSON.stringify(storedAppointments));

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/dashboard/paciente/turnos");
  };

  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const dayNames = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

  return (
    <div className={styles.appointmentPage}>
      <PageHero title="SACAR TURNO" subtitle="Agendá tu turno fácilmente" backgroundImage={hero} />

      <section className={styles.appointmentSection}>
        <div className={styles.container}>
          <div className={styles.leftPanel}>
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                <h3>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
                <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
              </div>
              <div className={styles.calendarGrid}>
                {dayNames.map(day => <div key={day} className={styles.dayName}>{day}</div>)}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className={styles.emptyDay} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === selectedDate.getDate();
                  return (
                    <button
                      key={day}
                      className={`${styles.day} ${isSelected ? styles.selected : ""}`}
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.timeSelection}>
              <h3>Elegí una hora</h3>
              <div className={styles.timeList}>
                {times.map(time => (
                  <button
                    key={time}
                    className={`${styles.timeButton} ${selectedTime === time ? styles.selected : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.bookButton}>
              <Button variant="primary" onClick={handleSubmit}>AGENDAR</Button>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <CheckCircle size={60} color="#4caf50" />
            <h2>¡Turno agendado!</h2>
            <p>
              Tu turno fue registrado para el <strong>{selectedDate.toLocaleDateString()}</strong> a las{" "}
              <strong>{selectedTime}</strong>.  
              <br />Revisa tu correo para más detalles.
            </p>
            <Button variant="primary" onClick={handleCloseModal}>
              Ir a mi perfil
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
