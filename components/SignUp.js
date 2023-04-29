import styles from "/styles/Shared.module.css";
import Link from "next/link";

export const SignupLink = () => (
    <Link href="/sign-up">
      <a className={styles.cardContent}>
        <img alt="Sign up" src="/icons/user-plus.svg" />
        <div>
          <h3>Sign in to get started</h3>
          <p>Sign up and sign in to explore all the wonder of GPT with Salable</p>
        </div>
        <div className={styles.arrow}>
          <img src="/icons/arrow-right.svg" />
        </div>
      </a>
    </Link>
  );