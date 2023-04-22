import styles from "/styles/Shared.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, {useState} from "react";
import Link from "next/link";
import Terminal, { ColorMode, TerminalOutput, TerminalInput } from 'react-terminal-ui';

async function getData(prompt) {

  try {
    const res = await fetch("/api/getAuthenticatedUserId?prompt="+prompt);
    const body = await res.json();
    console.log(JSON.stringify(body, null, "  "));
    return body["output"]
  } catch (e) {
    console.log("// There was an error with the request. Please contact support@clerk.dev");
    console.dir(e)
    return {"oh" : "no"}
  }  
}


const TerminalController = (props = {}) => {
  const { user } = useUser();
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Welcome {user.firstName}...</TerminalOutput>
  ]);

  const onInput = async function(input) {
    let ld = [...terminalLineData];
    ld.push(<TerminalInput>{input}</TerminalInput>);
    setTerminalLineData(ld)
    const resp = await getData(input)
    console.dir(resp)
    ld.push(<TerminalOutput>{resp}</TerminalOutput>);
    setTerminalLineData(ld);
  }
  // Terminal has 100% width by default so it should usually be wrapped in a container div
  return (
    <div className="container">
      <Terminal name='AdaGPT' colorMode={ ColorMode.Dark }  prompt=">" onInput={onInput} >
        { terminalLineData }
      </Terminal>
    </div>          
  )
};


const ClerkFeatures = () => (
  <Link href="/user">
    <a className={styles.cardContent}>
      <img alt="Explore Clerk components" src="/icons/layout.svg" />
      <div>
        <h3>Explore features provided by Clerk</h3>
        <p>Interact with the user button, user profile, and more to preview what your users will see</p>
      </div>
      <div className={styles.arrow}>
        <img src="/icons/arrow-right.svg" />
      </div>
    </a>
  </Link>
);

const SSRDemoLink = () => (
      <div>
        <img alt="SSR demo" src="/icons/sparkles.svg" />

        <h3>Visit the SSR demo page</h3>
        <input type="text" id="url-to-scrape" placeholder="Enter a URL to scrape"></input>
        <button onClick={() => {
          const url = document.getElementById("url-to-scrape");
          window.location.href = "/ssr-demo?url=" + url.value;
        }}>Scrape</button>
      </div>
);

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

const apiSample = `
import { getAuth } from "@clerk/nextjs/server";

export default function handler(req, res) {
  const { sessionId, userId } = getAuth(req);

  if (!sessionId) {
    return res.status(401).json({ id: null });
  }
  return res.status(200).json({ id: userId });
};
`.trim();

// Main component using <SignedIn> and <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering
// depending on whether or not a visitor is signed in.
//
// https://clerk.dev/docs/component-reference/signed-in
const Main = () => (
  <main className={styles.main}>
    <SignedOut>
      <p className={styles.description}>Sign up for an account to get started</p>
    </SignedOut>
      <SignedIn>        
          <TerminalController />
      </SignedIn>
      <SignedOut>
        <div className={styles.card}>
          <SignupLink />
        </div>
      </SignedOut>
  </main>
    
);

const APIRequest = () => {
  React.useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  });
  const [response, setResponse] = React.useState("// Click above to run the request");
  const makeRequest = async () => {
    setResponse("// Loading...");

    try {
      const res = await fetch("/api/getAuthenticatedUserId");
      const body = await res.json();
      setResponse(JSON.stringify(body, null, "  "));
    } catch (e) {
      setResponse("// There was an error with the request. Please contact support@clerk.dev");
    }
  };
  return (
    <div className={styles.backend}>
      <h2>API request example</h2>
      <div className={styles.card}>
        <button target="_blank" rel="noopener" className={styles.cardContent} onClick={() => makeRequest()}>
          <img src="/icons/server.svg" />
          <div>
            <h3>fetch('/api/getAuthenticatedUserId')</h3>
            <p>Retrieve the user ID of the signed in user, or null if there is no user</p>
          </div>
          <div className={styles.arrow}>
            <img src="/icons/download.svg" />
          </div>
        </button>
      </div>
      <h4>
        Response
        <em>
          <SignedIn>You are signed in, so the request will return your user ID</SignedIn>
          <SignedOut>You are signed out, so the request will return null</SignedOut>
        </em>
      </h4>
      <pre>
        <code className="language-js">{response}</code>
      </pre>
      <h4>pages/api/getAuthenticatedUserId.js</h4>
      <pre>
        <code className="language-js">{apiSample}</code>
      </pre>
    </div>
  );
};

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
  </footer>
);

const Home = () => (
  <Main />
);

export default Home;
