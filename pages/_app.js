import "@/styles/globals.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor} from "@/store";
import Head from "next/head";
import "font-awesome/css/font-awesome.min.css";

export default function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />{" "}
        <meta name="apple-mobile-web-app-capable" content="yes" />{" "}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#ffffff" />{" "}
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );

}
