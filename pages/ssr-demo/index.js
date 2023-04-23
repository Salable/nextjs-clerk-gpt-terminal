import styles from "/styles/Shared.module.css";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import React from "react";

export const getServerSideProps = async ({ req, query }) => {
  const { userId } = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  return { props: {  user: user, scraperResponse: scraperResponse} };
};

function SSRDemoPage ({scraperResponse}) {

  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Data on</h1>
        <p className={styles.description}>
        </p>
      </main>
    </div>
  );
};

export default SSRDemoPage;
