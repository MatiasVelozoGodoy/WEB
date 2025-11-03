"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Send } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import { patientMessages as seed } from "../../../data/dashboardData";
import styles from "./AdminMessagesSection.module.scss";

type Msg = {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
  to?: string;
};

type Conversation = {
  sender: string;
  last: Msg;
};

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AdminMessagesSection = () => {
  const [messages, setMessages] = useState<Msg[]>(seed as Msg[]);
  const initial = useMemo(
    () => (messages.find((m) => !m.isOwn) as Msg) || (messages[0] as Msg),
    [messages]
  );
  const [selected, setSelected] = useState<Msg>(initial);
  const [query, setQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const m = messages.find((mm) => !mm.isOwn && mm.sender === selected.sender);
    if (m && m.id !== selected.id) setSelected(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const conversations = useMemo<Conversation[]>(() => {
    const map = new Map<string, Msg>();
    for (const m of messages) {
      const key = m.isOwn ? m.to || "" : m.sender;
      if (!key) continue;
      const prev = map.get(key);
      if (!prev) map.set(key, m);
      else map.set(key, m);
    }
    const arr = Array.from(map.entries()).map(([sender, last]) => ({
      sender,
      last,
    }));
    const q = query.trim().toLowerCase();
    return q
      ? arr.filter(
          (c) =>
            c.sender.toLowerCase().includes(q) ||
            c.last.text.toLowerCase().includes(q)
        )
      : arr;
  }, [messages, query]);

  const thread = useMemo(
    () =>
      messages.filter(
        (m) => m.sender === selected.sender || (m.isOwn && m.to === selected.sender)
      ),
    [messages, selected.sender]
  );

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [thread.length, selected.sender]);

  const preview = (t: string) => (t.length > 42 ? `${t.slice(0, 42)}…` : t);

  const send = () => {
    if (!messageText.trim()) return;
    const newMsg: Msg = {
      id: String(Date.now()),
      sender: "Tú",
      text: messageText.trim(),
      timestamp: timeNow(),
      isOwn: true,
      to: selected.sender,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");
  };

  return (
    <section id="messages" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.tools}>
          <div className={styles.search}>
            <Search size={16} />
            <input
              placeholder="Buscar mensaje…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.list}>
          {conversations.map((c) => (
            <button
              key={c.sender}
              onClick={() => setSelected(c.last)}
              className={`${styles.item} ${
                selected.sender === c.sender ? styles.active : ""
              }`}
              type="button"
            >
              <div className={styles.avatar}>
                {(c.sender?.[0] || "?").toUpperCase()}
              </div>
              <div className={styles.meta}>
                <div className={styles.rowTop}>
                  <span className={styles.name}>{c.sender}</span>
                  <span className={styles.time}>{c.last.timestamp}</span>
                </div>
                <div className={styles.rowBottom}>{preview(c.last.text)}</div>
              </div>
              <span className={styles.badge} />
            </button>
          ))}
        </aside>

        <div className={styles.thread}>
          <div className={styles.threadHeader}>
            <div className={styles.threadUser}>
              <div className={styles.avatarLg}>
                {(selected.sender?.[0] || "?").toUpperCase()}
              </div>
              <span className={styles.threadName}>{selected.sender}</span>
            </div>
          </div>

          <div className={styles.timeline} ref={timelineRef}>
            {thread.map((m) => (
              <div
                key={m.id}
                className={`${styles.bubble} ${m.isOwn ? styles.own : ""}`}
              >
                <p>{m.text}</p>
                <span className={styles.stamp}>{m.timestamp}</span>
              </div>
            ))}
          </div>

          <div className={styles.inputRow}>
            <input
              placeholder={`Escribí un mensaje a ${selected.sender}`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button type="button" size="small" onClick={send}>
              <Send size={17} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminMessagesSection;
