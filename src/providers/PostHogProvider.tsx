"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { env } from "@/env";

interface PostHogProviderWrapperProps {
  children: ReactNode;
}

export function PostHogProviderWrapper({
  children,
}: PostHogProviderWrapperProps) {
  useEffect(() => {
    // Initialize PostHog with your project key
    if(!env.NEXT_PUBLIC_POSTHOG_KEY || !env.NEXT_PUBLIC_POSTHOG_HOST) {
      console.warn("PostHog key or host is not defined. Skipping PostHog initialization.");
      return;
    }
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      // Enable automatic pageview tracking for SPA
      capture_pageview: true,
      capture_pageleave: true,
      // Session recording configuration (optional but recommended)
      session_recording: {
        maskAllInputs: true,
      },
      // Enable debug mode in development
      debug: process.env.NODE_ENV === "development",
    });

    // Cleanup function
    return () => {
      // PostHog cleanup is handled internally
    };
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
