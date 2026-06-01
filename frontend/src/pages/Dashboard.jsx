import { useEffect, useState } from "react";

import api from "../services/api.js";
import styles from "../styles/Pages.module.css";

const cards = [
  { key: "total_products", label: "Total Products" },
  { key: "total_customers", label: "Total Customers" },
  { key: "total_orders", label: "Total Orders" },
  { key: "low_stock_products", label: "Low Stock Products" },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((response) => setStats(response.data))
      .catch((err) => setError(err.response?.data?.detail || "Unable to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.notice}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Dashboard</h2>
          <p>Current operating snapshot across inventory, customers, and orders.</p>
        </div>
      </div>
      <div className={styles.statsGrid}>
        {cards.map((card) => (
          <article className={styles.statCard} key={card.key}>
            <span>{card.label}</span>
            <strong>{stats?.[card.key] ?? 0}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
