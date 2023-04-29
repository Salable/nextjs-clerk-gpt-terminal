import styles from "/styles/Shared.module.css";
import Link from "next/link";

export const PurchaseLink = () => (
    <Link href="/purchase">
      <a className={styles.cardContent}>
        <img alt="Sign up" src="/icons/shield-check.svg" />
        <div>
          <h2>Purchase a Subscription</h2>
        </div>
        <div className={styles.arrow}>
          <img src="/icons/arrow-right.svg" />
        </div>
      </a>
    </Link>
  );