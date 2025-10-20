# PostHog Quick Reference

## Import and Use

```tsx
import {
  trackUserSignUp,
  trackUserLoggedIn,
  trackSeatSelectionStarted,
  trackSeatSelected,
  trackSeatBookingAttempt,
  trackSeatBookingCompleted,
  trackBusRouteViewed,
  trackAdminModelCreated,
  resetUserIdentity,
} from "@/lib/posthog-events";
```

## Essential Integrations

### 1. Sign-Up Form

```tsx
trackUserSignUp({
  userId: newUser.id,
  email: newUser.email,
  boardingPointId: selectedBoardingPoint,
});
```

### 2. Sign-In Form (CRITICAL)

```tsx
trackUserLoggedIn({
  userId: session.user.id,
  email: session.user.email,
});
```

### 3. Logout Handler

```tsx
await signOut();
resetUserIdentity();
```

### 4. Seat Selection

```tsx
// Start
trackSeatSelectionStarted({ userId, busId, boardingPointId });

// Individual seat
trackSeatSelected({ userId, busId, seatId, gender, boardingPointId });

// Attempt
trackSeatBookingAttempt({ userId, busId, seatId, status, failureReason? });

// Complete
trackSeatBookingCompleted({ userId, busId, seatId, boardingPointId });
```

### 5. Bus Route View

```tsx
trackBusRouteViewed({ userId, boardingPointId, busId? });
```

### 6. Admin Action

```tsx
trackAdminModelCreated({ adminUserId, modelId });
```

## Environment Setup

```env
NEXT_PUBLIC_POSTHOG_KEY=your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Files Created/Modified

| File                                | Status      | Purpose                |
| ----------------------------------- | ----------- | ---------------------- |
| `src/env.js`                        | ✅ Modified | PostHog env vars       |
| `src/providers/PostHogProvider.tsx` | ✅ Created  | Initialization         |
| `src/lib/posthog-events.ts`         | ✅ Created  | Event tracking         |
| `src/hooks/use-posthog.ts`          | ✅ Created  | Hook for direct access |
| `src/app/layout.tsx`                | ✅ Modified | Provider integration   |
| `docs/POSTHOG_SETUP.md`             | ✅ Created  | Full documentation     |

## Key Features

- ✅ Automatic SPA pageview tracking
- ✅ User identification on login
- ✅ Session recording with input masking
- ✅ 8 custom business events
- ✅ Proper TypeScript typing
- ✅ Error handling for failures
- ✅ Debug mode in development

## Testing

1. Add env vars to `.env.local`
2. Run `pnpm dev`
3. Navigate app and check PostHog dashboard
4. Test sign-up/sign-in to verify identification
5. Check console for debug messages

## Common Issues

| Issue                | Solution                                        |
| -------------------- | ----------------------------------------------- |
| Events not appearing | Check API key, verify network requests          |
| User not identified  | Ensure `trackUserLoggedIn()` called after auth  |
| Duplicate events     | Review component re-renders, use useEffect deps |
| Compilation errors   | Run `pnpm install posthog-js`                   |
