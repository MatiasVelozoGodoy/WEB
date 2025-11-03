"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import PageHero from "../../components/UI/PageHero/PageHero";
import ServiceInfoModal from "../../components/ServiceInfoModal/ServiceInfoModal";
import type { DetailedService } from "../../types";
import {getActiveServices} from "../../services/serviceService"
import hero from "../../assets/images/servicesBG.png";
import styles from "./Services.module.scss";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DetailedService | null>(null);
  const [services, setServices] = useState<DetailedService[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "todos", label: "TODOS", icon: "🦷" },
    { id: "estetica", label: "ESTÉTICA", icon: "🌸" },
    { id: "cirugia", label: "CIRUGÍA", icon: "💉" },
    { id: "tratamiento de conducto", label: "ENDODONCIA", icon: "😁" },
    { id: "otros", label: "OTROS", icon: "💎" },
  ];

  // 🔹 Lógica para obtener servicios desde la API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getActiveServices();
        console.log("Servicios recibidos desde la API:", response); // <-- aquí lo vemos
        setServices(response);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices =
    selectedCategory === "todos"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const handleServiceClick = (service: DetailedService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

if (loading) {
  return (
    <div className={styles.loadingContainer}>
      <motion.div
        className={styles.loader}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        className={styles.loadingText}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Cargando servicios...
      </motion.p>
    </div>
  );
}

  return (
    <div className={styles.servicesPage}>
      <PageHero
        title="NUESTROS SERVICIOS"
        subtitle="Estamos a tu disposición para resolver cualquier duda"
        backgroundImage={hero}
      />

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>
              Descubrí y filtrá todos nuestros servicios en un click:
            </h3>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.servicesGrid}>
            {filteredServices.length === 0 ? (
              <p>No hay servicios disponibles en esta categoría.</p>
            ) : (
              filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onClick={() => handleServiceClick(service)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <ServiceInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

const ServiceCard = ({
  service,
  index,
  onClick,
}: {
  service: DetailedService;
  index: number;
  onClick: () => void;
}) => {
  return (
    <motion.div
      className={styles.serviceCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className={styles.imageWrapper}>
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className={styles.image}
        />
        <button className={styles.expandButton}>
          <Maximize2 size={20} />
        </button>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.serviceTitle}>{service.title}</h3>
        <p className={styles.serviceDescription}>{service.description}</p>
      </div>
    </motion.div>
  );
};

export default Services;
