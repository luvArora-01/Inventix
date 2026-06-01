import { useEffect, useState } from "react";

import OrderForm from "../components/OrderForm.jsx";
import api from "../services/api.js";
import styles from "../styles/Pages.module.css";

const emptyForm = {
  customer_id: "",
  items: [{ product_id: "", quantity: 1 }],
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get("/orders"), api.get("/customers"), api.get("/products")])
      .then(([ordersResponse, customersResponse, productsResponse]) => {
        setOrders(ordersResponse.data);
        setCustomers(customersResponse.data);
        setProducts(productsResponse.data);
      })
      .catch((err) => setError(err.response?.data?.detail || "Unable to load order data"))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleCustomerChange = (event) => {
    setForm((current) => ({ ...current, customer_id: event.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [...current.items, { product_id: "", quantity: 1 }],
    }));
  };

  const removeItem = (index) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    const payload = {
      customer_id: Number(form.customer_id),
      items: form.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    try {
      await api.post("/orders", payload);
      setForm(emptyForm);
      setMessage("Order created successfully");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteOrder = async (id) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/orders/${id}`);
      setMessage("Order cancelled successfully");
      setSelectedOrder(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to cancel order");
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Orders</h2>
          <p>Create orders, inspect line items, and keep stock synchronized.</p>
        </div>
      </div>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <OrderForm
        customers={customers}
        products={products}
        form={form}
        onCustomerChange={handleCustomerChange}
        onItemChange={handleItemChange}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <div className={styles.tablePanel}>
        {loading ? (
          <div className={styles.notice}>Loading orders...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer.full_name}</td>
                  <td>${Number(order.total_amount).toFixed(2)}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td className={styles.rowActions}>
                    <button type="button" onClick={() => setSelectedOrder(order)}>
                      Details
                    </button>
                    <button type="button" className={styles.danger} onClick={() => deleteOrder(order.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div className={styles.detailsPanel}>
          <div className={styles.detailsHeader}>
            <h3>Order #{selectedOrder.id}</h3>
            <button type="button" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
          <p>
            <strong>Customer:</strong> {selectedOrder.customer.full_name}
          </p>
          <ul>
            {selectedOrder.items.map((item) => (
              <li key={item.id}>
                {item.product.product_name} - {item.quantity} x ${Number(item.unit_price).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Orders;
