import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { CursorPhysics } from "@/components/CursorPhysics";

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-white text-black`}
        suppressHydrationWarning
      >
        {/* <CursorPhysics /> */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
