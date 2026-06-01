import styles from "../styles/Layout.module.css";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div>
        <p className={styles.kicker}>Track Smarter. Manage Better.</p>
        <h1>Inventix</h1>
      </div>
      <div className={styles.statusBadge}>Live Operations</div>
    </header>
  );
}

export default Navbar;
