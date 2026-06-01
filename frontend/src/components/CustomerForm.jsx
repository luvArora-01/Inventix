import styles from "../styles/Forms.module.css";

function CustomerForm({ form, onChange, onSubmit, submitting }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <label>
          Full Name
          <input name="full_name" value={form.full_name} onChange={onChange} placeholder="Aarav Mehta" required />
        </label>
        <label>
          Email Address
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="aarav@example.com" required />
        </label>
        <label>
          Phone Number
          <input name="phone_number" value={form.phone_number} onChange={onChange} placeholder="+91 98765 43210" required />
        </label>
      </div>
      <div className={styles.actions}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add Customer"}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
