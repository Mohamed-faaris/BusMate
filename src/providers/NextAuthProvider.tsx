"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface NextAuthProviderProps {
  children: ReactNode;
}

export function NextAuthProvider({ children }: NextAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
