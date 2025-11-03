"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Send } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { patientMessagesSecond as seed } from "../../../data/dashboardData";
import styles from "./PatientMessagesSection.module.scss";

type Msg = {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
  to?: string;
};

const CLINIC_SENDER = "Equipo Lavalle";
const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const PatientMessagesSection = () => {
  const [messages, setMessages] = useState<Msg[]>(
    (seed as Msg[]).map((m) =>
      m.isOwn
        ? { ...m, sender: "Tú", to: CLINIC_SENDER }
        : { ...m, sender: CLINIC_SENDER }
    )
  );
  const [query, setQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const thread = useMemo(
    () => messages.filter((m) => m.isOwn || m.sender === CLINIC_SENDER),
    [messages]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return thread;
    return thread.filter((m) => m.text.toLowerCase().includes(q));
  }, [thread, query]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [filtered.length]);

  const send = () => {
    if (!messageText.trim()) return;
    const newMsg: Msg = {
      id: String(Date.now()),
      sender: "Tú",
      text: messageText.trim(),
      timestamp: timeNow(),
      isOwn: true,
      to: CLINIC_SENDER,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");
  };

  return (
    <DashboardLayout userType="cliente" userRole="patient" userName="Usuario">
      <section id="messages" className={styles.section}>
        <div className={styles.header}>
          <div className={styles.search}>
            <Search size={16} />
            <input
              placeholder="Buscar mensaje…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.chatCard}>
          <div className={styles.chatHeader}>
            <div className={styles.avatarLg}>{CLINIC_SENDER[0]}</div>
            <span className={styles.chatName}>Administrador</span>
          </div>

          <div className={styles.timeline} ref={timelineRef}>
            <div className={styles.dayChip}>Hoy</div>
            {filtered.map((m) => (
              <div key={m.id} className={`${styles.bubble} ${m.isOwn ? styles.own : ""}`}>
                <p>{m.text}</p>
                <span className={styles.stamp}>{m.timestamp}</span>
              </div>
            ))}
          </div>

          <div className={styles.inputRow}>
            <input
              placeholder={`Escribe un mensaje a ${CLINIC_SENDER}`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button type="button" size="small" onClick={send}>
              <Send size={17} />
            </Button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default PatientMessagesSection;
