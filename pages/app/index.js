import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SignupLink } from "/components/SignUp";
import { useRouter } from 'next/router';
import { LicenseBlock } from "/components/Salable/LicenseStatus";

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
const Main = ({entitlement}) => {
  const { isLoaded, user } = useUser()
  const [checkedLicenses, setLicenses] = useState([])
  const makeQuery = async () => {
    try {
      const res = await fetch("/api/salable/check?entitlement="+entitlement);
      const body = await res.json();
      setLicenses(body["licenses"])
    } catch (e) {
      console.log("// There was an error with the request");    
      console.dir(e)
    }
  }
  useEffect( () => {        
    console.dir(`${entitlement}, ${isLoaded}, ${checkedLicenses}`)
    if (entitlement && isLoaded && checkedLicenses !== []) {
      makeQuery() 
    }
  }, [user])
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
        {entitlement ? 
        <>
        {checkedLicenses.length > 0 ? <h3>Your user is licensed! Here's what's active.</h3> : <></>}
        {checkedLicenses.length === 0 && isLoaded && entitlement ? <h3>No licenses found  :( . </h3> : <></>}
        <div>
          {checkedLicenses.map((license, i) => {
            return license.status === "ACTIVE" ?  
            <div key={i}>
              <LicenseBlock id={license.uuid} plan={license.plan.displayName} status= {license.status}/>
            </div> : <></>
          })}
        </div>
        </> : <>
          <div>
            Tap your card to check your license!
            <p>
              Need a hand getting started? Try: using entitlement={user.id}
            </p>
          </div>
        </>}
      </SignedIn>     
    </main>
    : <></>
  );
} 

// Home component
// Render with the SalableProvider to make the SalableContext available
const Home = () => {
  const router = useRouter();
  const {entitlement} = router.query
  return <SalableProvider>
    <Main entitlement={entitlement}/>
  </SalableProvider>
};

export default Home;
