import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useState, useEffect } from 'react';
import {SalablePricingTableReact} from "@salable/react-sdk";
import {SignupLink} from "/components/SignUp";
import { LicenseBlock } from "../../components/Salable/LicenseStatus";
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
          <div className={styles.card}>
            <SignupLink />
          </div>
        </SignedOut>
        <SignedIn>
          <IsNotLicensed capabilitiesCheckValue={"free"}>
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
          <IsLicensed capabilitiesCheckValue={"free"}>
            <h1>Thank you for purchasing AdaGPT</h1>
            <div>
            {licenses.map((license, i) => {
              return license.status === "ACTIVE" ?  
              <div key={i}>
                <LicenseBlock id={license.uuid} plan={license.plan.displayName} status= {license.status} />
              </div> : <></>
            })}
            </div>
          </IsLicensed>   
        </SignedIn>              
      </main>
    );
  }
  
} 

// Home component
// Render with the SalableProvider to make the SalableContext available
const Home = () => (
  <SalableProvider>
    <Main />
  </SalableProvider>
  
);

export default Home;
