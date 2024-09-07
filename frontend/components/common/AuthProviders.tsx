'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain="dev-4gk99dh4.us.auth0.com"
      clientId="LkK8zYegz3xuSfiyWpyvLKPvqvBbDq0t"
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined
      }}
    >
      {children}
    </Auth0Provider>
  );
}