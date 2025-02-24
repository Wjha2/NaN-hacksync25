// src/app/layout.tsx
import { Inter } from "next/font/google";
import { Metadata } from "next";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mental Health & Wellness Platform",
  description:
    "Your personalized journey to mental wellness and personal growth",
  keywords: "mental health, wellness, personal growth, meditation, mindfulness",
  themeColor: "#6D28D9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
