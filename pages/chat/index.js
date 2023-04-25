import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {TerminalController} from "/components/TerminalUI"


import React, { createContext, useContext, useState, useEffect } from 'react';

// Create UserContext with a default value
const SalableContext = createContext(null);

// Create a UserProvider component
const SalableProvider = ({ children }) => {
  const [capabilities, setCapabilities] = useState([]);
  const [licensed, setLicensed] = useState(null);
  
  // Function to change the user's role
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
  const { capabilities, licensed } = useSalable();
  console.log(capabilities)
  console.log(licensed)
  return (
    <main className={styles.main}>
    <SignedOut>
      <p className={styles.description}>Sign in to get started</p>
      <div className={styles.card}>
          <SignupLink />
      </div>      
    </SignedOut>
    <SignedIn> 
      <IsLicensed>
        <TerminalController key="terminal"/>
      </IsLicensed>               
      <IsNotLicensed>
        <h3>Purchase AdaGPT today</h3>
        <Link href="/purchase">Purchase AdaGPT</Link>
      </IsNotLicensed>
    </SignedIn>
    </main>
  )
}
  

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
  </footer>
);

const Home = () => (
  <SalableProvider>
    <Main />
  </SalableProvider>
);

export default Home;
