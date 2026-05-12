import localFont from "next/font/local";
import "./globals.css";

const unbounded = localFont({
  src: "../../public/fonts/Unbounded/Unbounded-Bold.ttf",
  variable: "--font-unbounded",
});

const outfit = localFont({
  src: "../../public/fonts/Outfit/Outfit-SemiBold.ttf",
  variable: "--font-outfit",
});

const beiruti = localFont({
  src: "../../public/fonts/Beiruti/Beiruti-Bold.ttf",
  variable: "--font-beiruti",
});

export const metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: "Registro Mesas Redondas | Áreas de Bioprosperidad",
  description: "Descubre nuestro trabajo sobre Áreas de Bioprosperidad.",
  openGraph: {
    title: "Registro Mesas Redondas | Áreas de Bioprosperidad",
    description: "Descubre nuestro trabajo sobre Áreas de Bioprosperidad.",
    url: "/",
    siteName: "Áreas de Bioprosperidad",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Registro Mesas Redondas | Áreas de Bioprosperidad",
    description: "Descubre nuestro trabajo sobre Áreas de Bioprosperidad.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${outfit.variable} ${beiruti.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
