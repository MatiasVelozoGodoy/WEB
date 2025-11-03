import { Users, Calendar, DollarSign, X } from "lucide-react"
import styles from "./StatsCard.module.scss"

interface StatsCardProps {
  icon: "users" | "calendar" | "dollar" | "x"
  value: string | number
  label: string
  color: "primary" | "info" | "success" | "danger"
}

const iconMap = {
  users: Users,
  calendar: Calendar,
  dollar: DollarSign,
  x: X,
}

const StatsCard = ({ icon, value, label, color }: StatsCardProps) => {
  const IconComponent = iconMap[icon]

  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.iconWrapper}>
        <IconComponent className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.value}>{value}</h3>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  )
}

export default StatsCard
