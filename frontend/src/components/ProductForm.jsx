import styles from "../styles/Forms.module.css";

function ProductForm({ form, onChange, onSubmit, editing, submitting, onCancel }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <label>
          Product Name
          <input
            name="product_name"
            value={form.product_name}
            onChange={onChange}
            placeholder="Wireless Keyboard"
            required
          />
        </label>
        <label>
          SKU / Code
          <input name="sku" value={form.sku} onChange={onChange} placeholder="INV-001" required />
        </label>
        <label>
          Price
          <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={onChange} required />
        </label>
        <label>
          Quantity In Stock
          <input
            name="quantity_in_stock"
            type="number"
            min="0"
            step="1"
            value={form.quantity_in_stock}
            onChange={onChange}
            required
          />
        </label>
      </div>
      <div className={styles.actions}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : editing ? "Update Product" : "Add Product"}
        </button>
        {editing && (
          <button type="button" className={styles.secondary} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
