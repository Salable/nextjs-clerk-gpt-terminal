import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import {TerminalController} from "../components/TerminalUI"


const SignupLink = () => (
  <Link href="/sign-up">
    <a className={styles.cardContent}>
      <img alt="Sign up" src="/icons/user-plus.svg" />
      <div>
        <h3>Sign up for an account</h3>
        <p>Sign up and sign in to explore all the features provided by Clerk out-of-the-box</p>
      </div>
      <div className={styles.arrow}>
        <img src="/icons/arrow-right.svg" />
      </div>
    </a>
  </Link>
);


const Main = () => (
  <main className={styles.main}>
    <SignedOut>
      <p className={styles.description}>Sign up for an account to get started</p>
    </SignedOut>
      <SignedIn>        
          <TerminalController id="terminal"/>
      </SignedIn>
      <SignedOut>
        <div className={styles.card}>
          <SignupLink />
        </div>
      </SignedOut>
  </main>
    
);

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
  </footer>
);

const Home = () => (
  <Main />
);

export default Home;
