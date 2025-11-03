"use client";

import styles from "./ClinicHistory.module.scss";

export type HistoryRecord = {
  date?: string;
  condition?: string;
  diagnosis?: string;
  medication?: string;
  provider?: string;
  place?: string;
};

type Props = {
  records: HistoryRecord[];
  title?: string;
};

const monthsES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function parseDMY(input?: string): Date | null {
  if (!input) return null;
  const m = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  let year = Number(y);
  if (year < 100) year += 1900;
  const dt = new Date(year, Number(mo) - 1, Number(d));
  return isNaN(dt.getTime()) ? null : dt;
}

export default function ClinicHistory({
  records,
  title = "Historia clínica",
}: Props) {
  type AugmentedRecord = HistoryRecord & {
    dt: Date | null;
    year: string;
    month: string;
  };

  const grouped = (records ?? [])
    .map((r) => {
      const dt = parseDMY(r.date);
      return {
        ...r,
        dt,
        year: dt ? String(dt.getFullYear()) : "Sin fecha",
        month: dt ? monthsES[dt.getMonth()] : "",
      } as AugmentedRecord;
    })
    .sort((a, b) => (b.dt?.getTime() ?? 0) - (a.dt?.getTime() ?? 0))
    .reduce<Record<string, AugmentedRecord[]>>((acc, r) => {
      (acc[r.year] ||= []).push(r);
      return acc;
    }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.filters}>
          <button className={`${styles.pill} ${styles.active}`} type="button">
            Por fecha
          </button>
          <button className={styles.pill} type="button">
            Por condición
          </button>
          <button className={styles.pill} type="button">
            Por tipo
          </button>
        </div>
      </div>

      <div className={styles.timeline}>
        {years.map((year) => (
          <div key={year} className={styles.yearGroup}>
            <div className={styles.yearHeader}>
              <div className={styles.yearDot} />
              <span className={styles.yearLabel}>{year}</span>
              <button className={styles.yearAction} type="button">
                Ver resumen anual
              </button>
            </div>

            <div className={styles.items}>
              {grouped[year].map((item: AugmentedRecord, idx: number) => (
                <div key={idx} className={styles.item}>
                  <div className={styles.rail} />
                  <div className={styles.monthBadge}>{item.month}</div>

                  <div className={styles.card}>
                    <h4 className={styles.cardTitle}>
                      {item.condition || "Consulta"}
                    </h4>
                    {(item.provider || item.place) && (
                      <p className={styles.sub}>
                        {item.provider || "Profesional"} ·{" "}
                        {item.place || "Consultorio"}
                      </p>
                    )}
                    {item.diagnosis && (
                      <p className={styles.textMuted}>{item.diagnosis}</p>
                    )}
                    <div className={styles.cardFooter}>
                      <span className={styles.dateTag}>{item.date || "—"}</span>
                      {item.medication && (
                        <span className={styles.pillLight}>
                          {item.medication}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
