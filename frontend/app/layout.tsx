'use client';

import { Providers } from '../components/common/AuthProviders';

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
      <script src="https://cdn.tailwindcss.com"></script>      </head>
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>

    
  );
}