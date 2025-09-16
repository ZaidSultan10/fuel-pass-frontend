'use client';

import { useHydrateAuth } from '@/store/auth.store';
import { ClientOnly } from './client-only';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <AuthHydrator>
        {children}
      </AuthHydrator>
    </ClientOnly>
  );
}

function AuthHydrator({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  return <>{children}</>;
}
