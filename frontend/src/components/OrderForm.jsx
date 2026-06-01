import styles from "../styles/Forms.module.css";

function OrderForm({ customers, products, form, onCustomerChange, onItemChange, onAddItem, onRemoveItem, onSubmit, submitting }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <label>
          Customer
          <select name="customer_id" value={form.customer_id} onChange={onCustomerChange} required>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.itemsHeader}>
        <strong>Order Items</strong>
        <button type="button" className={styles.secondary} onClick={onAddItem}>
          Add Item
        </button>
      </div>

      {form.items.map((item, index) => (
        <div className={styles.itemRow} key={index}>
          <label>
            Product
            <select value={item.product_id} onChange={(event) => onItemChange(index, "product_id", event.target.value)} required>
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name} ({product.quantity_in_stock} in stock)
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              step="1"
              value={item.quantity}
              onChange={(event) => onItemChange(index, "quantity", event.target.value)}
              required
            />
          </label>
          {form.items.length > 1 && (
            <button type="button" className={styles.danger} onClick={() => onRemoveItem(index)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <div className={styles.actions}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Order"}
        </button>
      </div>
    </form>
  );
}

export default OrderForm;
