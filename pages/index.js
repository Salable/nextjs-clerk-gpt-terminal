import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
const { SalableApi } = require("@salable/node-sdk");
import {SalablePricingTableReact} from "@salable/react-sdk"; 

export const getServerSideProps = async ({ req, query }) => {
  const { userId } = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  const api = new SalableApi(process.env["SALABLE_API_KEY"]);
  try {
    const capabilitiesCheck = await api.licenses.checkLicenses(
      process.env["SALABLE_PRODUCT_ID"],
      [user.id]
    );
    console.dir(capabilitiesCheck.capabilities)
    if (capabilitiesCheck.capabilities.includes("usage")) {
      console.log(`${user.id} is licensed`)
      return { props: {  user: user.id, licensed: true, capabilities: capabilitiesCheck.capabilities} };
    }
    return { props: {  user: user.id, licensed: false, capabilities: capabilitiesCheck.capabilities} };
  } catch (err) {
    console.log("Found an error!")
    console.error(err);
    return { props: {  user: userId, licensed: false} };
  }  
};


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


const Main = ({licensed, user, capabilities}) => (
  <main className={styles.main}>
  <SignedOut>
    <p className={styles.description}>Sign in to get started</p>
  </SignedOut>
  <SignedOut>
      <div className={styles.card}>
        <SignupLink />
      </div>
    </SignedOut>
    <SignedIn>        
        {licensed ? <h1>Thank you for purchasing AdaGPT</h1> : <h1>Please purchase AdaGPT</h1> }        
        {licensed ? <Link href="/chat">Launch Terminal</Link> : 
          <div>
            <p>AdaGPT is a GPT-3 powered chatbot that can be used to generate text, images, and audio. AdaGPT is a great way to explore the capabilities of GPT-3 and to get started with Salable.</p>  
          <SalablePricingTableReact 
          envConfig={{
            pricingTableUuid: '99d9fff3-83d4-4e95-94bf-18e8d5ea4845',
            apiKey: '85selEfohS2yQcF4ukLjo8UVVOtn8NZi56zeNxSR',
            globalPlanOptions: {
              granteeId: user,
              cancelUrl: 'https://example.com/cancel'
            },
            theme: "light"
          }}
          checkoutConfig={{
            member: 'example-member-123',
            customer: {
              email: "customer@company.com"
            }
          }}  
        />



          </div>}
    </SignedIn>
    <p>
      {licensed ? "You are licensed" : "You are not licensed"}
    </p>
  </main>
);

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
  </footer>
);

const Home = ({licensed, user, capabilities}) => (
  <Main licensed={licensed} user={user} capabilities={capabilities}/>
);

export default Home;
