import "/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import Layout from "/components/Layout";

const NextApp = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>{process.env["NEXT_PUBLIC_PRODUCT_TITLE"]}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default NextApp;
