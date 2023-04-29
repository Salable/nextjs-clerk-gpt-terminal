import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SignupLink } from "/components/SignUp";
import { useRouter } from 'next/router';

// 
// TODO: Move to Salable React provider
//
const SalableContext = createContext(null);

const SalableProvider = ({ children }) => {
  const [capabilities, setCapabilities] = useState([]);
  const [licensed, setLicensed] = useState(null);
  const [userId, setUserId] = useState(null);
  const [licenses, setLicenses] = useState([])
  
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

const IsLicensed = ({children, capabilitiesCheckValue}) => {
  const { licensed, capabilities } = useSalable();
  if (capabilities.includes(capabilitiesCheckValue)) {
    return children
  } 
  return null;
}

const IsNotLicensed = ({children, capabilitiesCheckValue}) => {
  const { licensed, capabilities } = useSalable();
  if (capabilities.includes(capabilitiesCheckValue)) {
    return null
  } 
  return children;
}
//
// End Salable React Provider
//


// Main component
// This renders components based on the user's sign in status and licensed status
const Main = () => {
  const { isLoaded, user } = useUser()
  const router = useRouter();
  const {entitlement} = router.query
  return (
    isLoaded ?
    <main className={styles.main}>
      <SignedOut> 
        <IsNotLicensed capabilitiesCheckValue="free">
          <p className={styles.description}>Sign in to get started</p>
          <div className={styles.card}>
            <SignupLink />
          </div>
        </IsNotLicensed>
      </SignedOut>     
      <SignedIn>
        {entitlement}
      </SignedIn>     
    </main>
    : <></>
  );
} 

// Home component
// Render with the SalableProvider to make the SalableContext available
const Home = () => (
  <SalableProvider>
    <Main />
  </SalableProvider>
);

export default Home;
