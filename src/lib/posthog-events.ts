import posthog from 'posthog-js';

/**
 * PostHog Analytics Event Tracker for BusMate
 *
 * This module provides typed functions to track all custom events in the BusMate application.
 * All functions automatically capture relevant event properties for analytics.
 */

/**
 * Track user sign-up event
 */
export const trackUserSignUp = (props: {
  userId: string;
  email: string;
  boardingPointId?: string;
}) => {
  posthog.capture('user_signed_up', {
    userId: props.userId,
    email: props.email,
    boardingPointId: props.boardingPointId,
  });
};

/**
 * Track user login event and identify the user
 */
export const trackUserLoggedIn = (props: {
  userId: string;
  email: string;
}) => {
  posthog.capture('user_logged_in', {
    userId: props.userId,
    email: props.email,
  });

  // Identify the user to deanonymize and link previous events
  posthog.identify(props.email, {
    userId: props.userId,
    email: props.email,
  });
};

/**
 * Track when user starts selecting seats
 */
export const trackSeatSelectionStarted = (props: {
  userId: string;
  busId: string;
  boardingPointId: string;
}) => {
  posthog.capture('seat_selection_started', {
    userId: props.userId,
    busId: props.busId,
    boardingPointId: props.boardingPointId,
  });
};

/**
 * Track individual seat selection
 */
export const trackSeatSelected = (props: {
  userId: string;
  busId: string;
  seatId: string;
  gender: string;
  boardingPointId: string;
}) => {
  posthog.capture('seat_selected', {
    userId: props.userId,
    busId: props.busId,
    seatId: props.seatId,
    gender: props.gender,
    boardingPointId: props.boardingPointId,
  });
};

/**
 * Track seat booking attempt
 */
export const trackSeatBookingAttempt = (props: {
  userId: string;
  busId: string;
  seatId: string;
  status: 'success' | 'failure';
  failureReason?: string;
}) => {
  posthog.capture('seat_booking_attempt', {
    userId: props.userId,
    busId: props.busId,
    seatId: props.seatId,
    status: props.status,
    failureReason: props.failureReason,
  });
};

/**
 * Track successful seat booking completion
 */
export const trackSeatBookingCompleted = (props: {
  userId: string;
  busId: string;
  seatId: string;
  boardingPointId: string;
}) => {
  posthog.capture('seat_booking_completed', {
    userId: props.userId,
    busId: props.busId,
    seatId: props.seatId,
    boardingPointId: props.boardingPointId,
  });
};

/**
 * Track when user views a bus route
 */
export const trackBusRouteViewed = (props: {
  userId: string;
  boardingPointId: string;
  busId?: string;
}) => {
  posthog.capture('bus_route_viewed', {
    userId: props.userId,
    boardingPointId: props.boardingPointId,
    busId: props.busId,
  });
};

/**
 * Track admin model creation
 */
export const trackAdminModelCreated = (props: {
  adminUserId: string;
  modelId: string;
}) => {
  posthog.capture('admin_model_created', {
    adminUserId: props.adminUserId,
    modelId: props.modelId,
  });
};

/**
 * Track manual pageview (for SPA route changes)
 * Note: This is usually handled automatically by PostHog's SPA tracking,
 * but can be called manually if needed for specific cases.
 */
export const trackPageView = (props: { url: string; path?: string }) => {
  posthog.capture('$pageview', {
    url: props.url,
    path: props.path,
  });
};

/**
 * Identify a user in PostHog (called after authentication)
 * This deanonymizes the user and links their previous anonymous events
 */
export const identifyUser = (
  userId: string,
  properties?: Record<string, unknown>,
) => {
  posthog.identify(userId, {
    userId,
    ...properties,
  });
};

/**
 * Reset user identity (called on logout)
 * This resets PostHog to anonymous tracking
 */
export const resetUserIdentity = () => {
  posthog.reset();
};
