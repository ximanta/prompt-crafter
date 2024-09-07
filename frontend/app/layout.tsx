'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Auth0Provider
        domain="dev-4gk99dh4.us.auth0.com"
        clientId="LkK8zYegz3xuSfiyWpyvLKPvqvBbDq0t"
        authorizationParams={{
          redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined
        }}
      >
        <body className={inter.className}>{children}</body>
      </Auth0Provider>
    </html>
  );
}
