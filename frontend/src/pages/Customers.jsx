import { useEffect, useState } from "react";

import CustomerForm from "../components/CustomerForm.jsx";
import api from "../services/api.js";
import styles from "../styles/Pages.module.css";

const emptyForm = {
  full_name: "",
  email: "",
  phone_number: "",
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCustomers = () => {
    setLoading(true);
    api
      .get("/customers")
      .then((response) => setCustomers(response.data))
      .catch((err) => setError(err.response?.data?.detail || "Unable to load customers"))
      .finally(() => setLoading(false));
  };

  useEffect(loadCustomers, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await api.post("/customers", form);
      setForm(emptyForm);
      setMessage("Customer added successfully");
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save customer");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCustomer = async (id) => {
    setError("");
    setMessage("");
    try {
      await api.delete(`/customers/${id}`);
      setMessage("Customer deleted successfully");
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete customer");
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Customers</h2>
          <p>Manage buyer profiles and contact records.</p>
        </div>
      </div>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <CustomerForm form={form} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} />

      <div className={styles.tablePanel}>
        {loading ? (
          <div className={styles.notice}>Loading customers...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.full_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone_number}</td>
                  <td className={styles.rowActions}>
                    <button type="button" className={styles.danger} onClick={() => deleteCustomer(customer.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Customers;
