import { useEffect, useState } from "react";

import ProductForm from "../components/ProductForm.jsx";
import api from "../services/api.js";
import styles from "../styles/Pages.module.css";

const emptyForm = {
  product_name: "",
  sku: "",
  price: "",
  quantity_in_stock: "",
};

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = () => {
    setLoading(true);
    api
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((err) => setError(err.response?.data?.detail || "Unable to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    const payload = {
      ...form,
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", payload);
        setMessage("Product added successfully");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      product_name: product.product_name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock,
    });
  };

  const deleteProduct = async (id) => {
    setError("");
    setMessage("");
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted successfully");
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete product");
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Products</h2>
          <p>Add, edit, and monitor stocked products.</p>
        </div>
      </div>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <ProductForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editing={Boolean(editingId)}
        submitting={submitting}
        onCancel={resetForm}
      />

      <div className={styles.tablePanel}>
        {loading ? (
          <div className={styles.notice}>Loading products...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.product_name}</td>
                  <td>{product.sku}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>{product.quantity_in_stock}</td>
                  <td className={styles.rowActions}>
                    <button type="button" onClick={() => editProduct(product)}>
                      Edit
                    </button>
                    <button type="button" className={styles.danger} onClick={() => deleteProduct(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Products;
