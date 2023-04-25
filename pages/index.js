import styles from "/styles/Shared.module.css";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";


import React, { createContext, useContext, useState, useEffect } from 'react';

// Create UserContext with a default value
const SalableContext = createContext(null);

const SalableProvider = ({ children }) => {
  const [capabilities, setCapabilities] = useState([]);
  const [licensed, setLicensed] = useState(null);
  const updateCapabilities = (capbitliesArray) => {
    setCapabilities(capbitliesArray);
  };

  // Query salable api to return capabilities in useEffect
  useEffect( () => {
    const makeQuery = async () => {
      try {
        const res = await fetch("/api/salable");
        const body = await res.json();
        setCapabilities(body["capabilities"])
        if (body.capabilities.includes("usage")) {
          setLicensed(true)
        } else {
          setLicensed(false)
        }
      } catch (e) {
        console.log("// There was an error with the request");    
        console.dir(e)
      }
    }
    makeQuery()   
  }, [])


  return (
    <SalableContext.Provider value={{ capabilities, licensed, setCapabilities }}>
      {children}
    </SalableContext.Provider>
  );
};

// Create a custom hook to use the UserContext
const useSalable = () => {
  return useContext(SalableContext);
};

const IsLicensed = ({children}) => {
  const { licensed } = useSalable();
  return licensed !== null && licensed === true ? children : null;
}

const IsNotLicensed = ({children}) => {
  const { licensed } = useSalable();
  return licensed !== null && licensed === false ? children : null;
}

const SignupLink = () => (
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

const Main = () => {
  return (
    <main className={styles.main}>
      <SignedOut> 
        <p className={styles.description}>Sign in to get started</p>
      </SignedOut>
      <SignedOut>
        <div className={styles.card}>
          <SignupLink />
        </div>
      </SignedOut>            
      <IsNotLicensed>
        <h1>Please purchase AdaGPT</h1>
        <p>AdaGPT is a GPT-3 powered chatbot that can be used to generate text, images, and audio. AdaGPT is a great way to explore the capabilities of GPT-3 and to get started with Salable.</p>
        <Link href="/purchase">Purchase AdaGPT</Link>
      </IsNotLicensed>
      <IsLicensed>
        <h1>Thank you for purchasing AdaGPT</h1>
        <Link href="/chat">Launch Terminal</Link>
      </IsLicensed>      
    </main>
  );
} 

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
  </footer>
);

// Home component
// Render with the SalableProvider to make the SalableContext available
const Home = () => (
  <SalableProvider>
    <Main />
  </SalableProvider>
  
);

export default Home;
