import styles from "/styles/Shared.module.css";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import React from "react";


async function getData(userId, url) {
  console.log("Getting data for user:", userId)
  const response = await fetch('https://winter-night-9989.fly.dev/?url='+url);
  const data = await response.json()
  return data;
}
async function mockGetPosts(userId, url) {
  const data = await getData(userId,url);
  console.log("Data from mockGetPosts: ", data)
  return data
};

export const getServerSideProps = async ({ req, query }) => {
  const { userId } = getAuth(req);
  const url = query["url"];
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  const scraperResponse = await mockGetPosts(user.id, url);
  return { props: {  user: user, scraperResponse: scraperResponse} };
};

function SSRDemoPage ({scraperResponse}) {

  const { isSignedIn, isLoaded } = useUser();
  // Code hightlighting
  React.useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Data on</h1>
        <p className={styles.description}>
          {scraperResponse.metadata.text}
        </p>
      </main>
    </div>
  );
};

export default SSRDemoPage;
