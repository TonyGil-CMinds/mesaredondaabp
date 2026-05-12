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
  title: "Registro BPA",
  description: "Áreas de Bioprosperidad",
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
