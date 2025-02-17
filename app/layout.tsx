import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import type React from "react"; // Added import for React

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizy - AI quiz app",
  description: "AI Quiz Application to help students better practice math",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={publicSans.className}>{children}</body>
    </html>
  );
}
