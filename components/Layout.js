import styles from "/styles/Shared.module.css";
import Header from "./Header";

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
    Copyright 2023
  </footer>
);

const Layout = ({ children }) => (
  <>
    <Header productTitle={process.env["NEXT_PUBLIC_PRODUCT_TITLE"]}/>
    <main className={styles.container}>{children}</main>
    <Footer />
  </>
);

export default Layout;
