// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import "./globals.css";
import Header from "@/components/Header";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <Head>
          <title>NixLabs Status</title>
          <meta
            name="description"
            content="NixLabs Networks statuspage showing all service stats in real time!"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <div className="antialiased flex flex-col items-center bg-[#030303] text-white gap-12 py-4">
          <Header />
          <Component {...pageProps} />
        </div>
      </html>
    </>
  );
}
