import type { AppProps } from "next/app";
import Head from "next/head";
import "./globals.css";
import Header from "@/components/Header";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NixLabs Status</title>
        <meta
          name="description"
          content="NixLabs Networks statuspage showing all service stats in real time!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="https://nixlabs.dev/logo.svg"
          type="image/svg+xml"
        />
      </Head>
      <div className="antialiased flex flex-col items-center text-white lg:gap-8 py-4 bg-[#030303] dark min-h-screen">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  );
}
