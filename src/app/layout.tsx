import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImmersaAI | AI Cinematic 3D Website Generator",
  description: "Generate premium, cinematic, animated 3D websites from a simple prompt. The future of AI web design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-black text-white min-h-screen selection:bg-primary/30`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
