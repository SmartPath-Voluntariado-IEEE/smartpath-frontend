import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SmartPath — Rutas de aprendizaje basadas en el mercado tech peruano",
  description: "SmartPath analiza el mercado laboral tech peruano y genera un roadmap personalizado de habilidades para practicantes de últimos ciclos.",
  authors: [{ name: "SmartPath" }],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} font-sans scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container antialiased min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 w-full">
          {children}
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}