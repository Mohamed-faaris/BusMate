"use client";

import { usePostHog } from "posthog-js/react";

/**
 * Custom hook to use PostHog in components
 * Returns the PostHog instance for direct access if needed
 */
export function usePostHogClient() {
  return usePostHog();
}
