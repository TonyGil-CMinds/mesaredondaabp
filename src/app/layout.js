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
  title: "Registro Mesas Redondas | Áreas de Bioprosperidad",
  description: "Descubre nuestro trabajo sobre Áreas de Bioprosperidad ",
  openGraph: {
    images: '/public/images/seo/seo-image.png',
  }
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
