import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function App({ Component, pageProps }) {
  return (
    <div className={`app ${sans.variable} ${mono.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
