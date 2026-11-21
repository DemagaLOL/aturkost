import { Bricolage_Grotesque } from "next/font/google";
import "@/styles/globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`app ${bricolage.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
