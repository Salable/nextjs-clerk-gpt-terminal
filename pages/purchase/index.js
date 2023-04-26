import styles from "/styles/Shared.module.css";
import { SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";


import React, { createContext, useContext, useState, useEffect } from 'react';

import {SalablePricingTableReact} from "@salable/react-sdk"; 
            
// Create UserContext with a default value
const SalableContext = createContext(null);

const SalableProvider = ({ children }) => {
  const [capabilities, setCapabilities] = useState([]);
  const [licensed, setLicensed] = useState(null);
  const [userId, setUserId] = useState(null);
  const [licenses, setLicenses] = useState([])
  const updateCapabilities = (capbitliesArray) => {
    setCapabilities(capbitliesArray);
  };
  // Query salable api to return capabilities in useEffect
  useEffect( () => {
    const makeQuery = async () => {
      try {
        const res = await fetch("/api/salable");
        const body = await res.json();
        console.dir(body)
        setCapabilities(body["capabilities"])
        setUserId(body["id"])
        setLicenses(body["licenses"])
        if (body.capabilities.includes("free")) {
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
    <SalableContext.Provider value={{ capabilities, licensed, setCapabilities, userId, licenses}}>
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


const deletePlan = async (licenseId) => {
  try {
    // const returnedLicenses = await api.licenses.getLicenses(userId);
    console.log(licenseId)
    console.log(process.env["SALABLE_API_KEY"])
    const res = await fetch("/api/salable/delete?licenseId="+licenseId, {
      method: "DELETE", 
      headers: {
        "x-api-key" : process.env["SALABLE_API_KEY"]
      }
    });
    const body = await res.json()
    window.location.reload(false);
  } catch (err) {
    console.error(err);
  }
}

const Main = () => {
  const {userId, licenses} = useSalable()
  const { isLoaded, isSignedIn, user } = useUser()
  console.dir(userId)
  console.dir(licenses)
  if (!isLoaded || !isSignedIn) {
    return null
  } else {
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
          <h1>Buy now!</h1>
          <SalablePricingTableReact 
          envConfig={{
              productUuid: 'fdcc8ebe-686a-40cc-90fb-82fd6b2983e3',
              apiKey: 'KdnPPzYaZqiHE0l7VUrT1k2gmURTgLd3EjXbxGT1',
              globalPlanOptions: {
              granteeId: userId,
              cancelUrl: '/purchase'
              },
              theme: "light"
          }}
          checkoutConfig={{
              member: user.emailAddresses[0].emailAddress,
              customer: {
              email: user.emailAddresses[0].emailAddress
              }
          }}  
          />
        </IsNotLicensed>
        <IsLicensed>
          <h1>Thank you for purchasing AdaGPT</h1>
          <div>
          {licenses.map((license, i) => {
            return <div key={i}>
              <p>
                License Key: {license.uuid}
              </p>
              <p>
                Plan: {license.plan.displayName}  
              </p>
              <p>
                Status: {license.status}
              </p>
              <button onClick={() => deletePlan(license.uuid)}>
                Cancel
              </button>
            </div> 
          })}
          </div>
          

          <Link href="/chat">Launch Terminal</Link>
        </IsLicensed>      
      </main>
    );
  }
  
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
