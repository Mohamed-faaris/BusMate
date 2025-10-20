# PostHog Analytics Integration Guide for BusMate

## Overview

PostHog is fully integrated into BusMate to track user behavior, engagement, and conversion metrics. The setup includes automatic SPA pageview tracking, user identification, and custom event tracking for all key user interactions.

## Setup Configuration

### Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Get your `NEXT_PUBLIC_POSTHOG_KEY` from your PostHog project settings.

### What's Configured

✅ **SPA Pageview Tracking**: Automatic tracking of all page views in the Next.js app  
✅ **Session Recording**: All user sessions are recorded (with input masking for security)  
✅ **User Identification**: Users are identified by email after login  
✅ **Custom Events**: 8 core business events are tracked with relevant properties

## Core Features

### 1. Automatic SPA Pageview Tracking

When a user navigates to different pages in the app, PostHog automatically captures the pageview. No additional code needed!

### 2. User Identification on Login

When a user logs in, call `trackUserLoggedIn()`:

```tsx
import { trackUserLoggedIn } from '@/lib/posthog-events';

// After successful login
trackUserLoggedIn({
  userId: session.user.id,
  email: session.user.email,
});
```

This automatically:
- Captures a `user_logged_in` event
- Identifies the user with their email (deanonymizes)
- Links all previous anonymous events to the user

### 3. User Logout

Reset the user identity on logout:

```tsx
import { resetUserIdentity } from '@/lib/posthog-events';

// In your logout handler
await signOut();
resetUserIdentity();
```

## Custom Events

### Available Tracking Functions

All tracking functions are exported from `@/lib/posthog-events`:

#### User Lifecycle

**`trackUserSignUp(props)`** - Track new user registrations

```tsx
import { trackUserSignUp } from '@/lib/posthog-events';

trackUserSignUp({
  userId: newUser.id,
  email: newUser.email,
  boardingPointId: selectedBoardingPoint, // optional
});
```

**`trackUserLoggedIn(props)`** - Track user login and identify

```tsx
import { trackUserLoggedIn } from '@/lib/posthog-events';

trackUserLoggedIn({
  userId: user.id,
  email: user.email,
});
```

#### Seat Booking Flow

**`trackSeatSelectionStarted(props)`** - When user initiates seat selection

```tsx
import { trackSeatSelectionStarted } from '@/lib/posthog-events';

// When user opens seat selection for a bus
trackSeatSelectionStarted({
  userId: session.user.id,
  busId: bus.id,
  boardingPointId: boardingPoint.id,
});
```

**`trackSeatSelected(props)`** - When individual seat is selected

```tsx
import { trackSeatSelected } from '@/lib/posthog-events';

// When user clicks on a seat to select it
trackSeatSelected({
  userId: session.user.id,
  busId: bus.id,
  seatId: seat.id,
  gender: seat.gender, // e.g., 'M', 'F', or similar
  boardingPointId: boardingPoint.id,
});
```

**`trackSeatBookingAttempt(props)`** - When booking is submitted

```tsx
import { trackSeatBookingAttempt } from '@/lib/posthog-events';

try {
  await submitBooking();
  trackSeatBookingAttempt({
    userId: session.user.id,
    busId: bus.id,
    seatId: seat.id,
    status: 'success',
  });
} catch (error) {
  trackSeatBookingAttempt({
    userId: session.user.id,
    busId: bus.id,
    seatId: seat.id,
    status: 'failure',
    failureReason: error.message,
  });
}
```

**`trackSeatBookingCompleted(props)`** - When booking is confirmed

```tsx
import { trackSeatBookingCompleted } from '@/lib/posthog-events';

// After successful booking confirmation
trackSeatBookingCompleted({
  userId: session.user.id,
  busId: bus.id,
  seatId: seat.id,
  boardingPointId: boardingPoint.id,
});
```

#### Bus Discovery

**`trackBusRouteViewed(props)`** - When user views bus routes

```tsx
import { trackBusRouteViewed } from '@/lib/posthog-events';

// When user browses available buses
trackBusRouteViewed({
  userId: session.user.id,
  boardingPointId: selectedBoardingPoint.id,
  busId: specificBus?.id, // optional, if viewing specific bus
});
```

#### Admin Actions

**`trackAdminModelCreated(props)`** - When admin creates a model/bus/boarding point

```tsx
import { trackAdminModelCreated } from '@/lib/posthog-events';

// After admin successfully creates a new bus/model
trackAdminModelCreated({
  adminUserId: admin.id,
  modelId: newModel.id, // ID of created bus, model, or entity
});
```

## Integration Examples

### In Sign-Up Component (`RegisterForm.tsx`)

```tsx
'use client';

import { trackUserSignUp } from '@/lib/posthog-events';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });

      const user = await response.json();

      // Track the signup
      trackUserSignUp({
        userId: user.id,
        email: user.email,
        boardingPointId: formData.get('boardingPointId'),
      });

      // Redirect to login
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return (
    // Your form JSX
  );
}
```

### In Sign-In Component (`SignInForm.tsx`)

```tsx
'use client';

import { trackUserLoggedIn } from '@/lib/posthog-events';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Get the session to have user data
        const session = await fetch('/api/auth/session').then((r) =>
          r.json(),
        );

        // Track the login
        trackUserLoggedIn({
          userId: session.user.id,
          email: session.user.email,
        });

        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    // Your form JSX
  );
}
```

### In Seat Selection Component

```tsx
'use client';

import {
  trackSeatSelectionStarted,
  trackSeatSelected,
  trackSeatBookingAttempt,
  trackSeatBookingCompleted,
} from '@/lib/posthog-events';
import { useSession } from 'next-auth/react';

export function BusSeatSelector({ busId, boardingPointId }) {
  const { data: session } = useSession();

  // Track when component mounts (user starts selecting seats)
  useEffect(() => {
    if (session?.user) {
      trackSeatSelectionStarted({
        userId: session.user.id,
        busId,
        boardingPointId,
      });
    }
  }, [busId, boardingPointId, session]);

  const handleSeatClick = (seatId: string, seatGender: string) => {
    if (session?.user) {
      trackSeatSelected({
        userId: session.user.id,
        busId,
        seatId,
        gender: seatGender,
        boardingPointId,
      });
    }
  };

  const handleBooking = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/bookSeat', {
        method: 'POST',
        body: JSON.stringify({ seatId, busId }),
      });

      if (response.ok) {
        trackSeatBookingAttempt({
          userId: session.user.id,
          busId,
          seatId: selectedSeat.id,
          status: 'success',
        });

        trackSeatBookingCompleted({
          userId: session.user.id,
          busId,
          seatId: selectedSeat.id,
          boardingPointId,
        });
      } else {
        const error = await response.json();
        trackSeatBookingAttempt({
          userId: session.user.id,
          busId,
          seatId: selectedSeat.id,
          status: 'failure',
          failureReason: error.message,
        });
      }
    } catch (error) {
      trackSeatBookingAttempt({
        userId: session.user.id,
        busId,
        seatId: selectedSeat.id,
        status: 'failure',
        failureReason: error.message,
      });
    }
  };

  return (
    // Your seat selector JSX
  );
}
```

### In Bus Listing Component

```tsx
'use client';

import { trackBusRouteViewed } from '@/lib/posthog-events';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function BusListing({ boardingPointId, buses }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      trackBusRouteViewed({
        userId: session.user.id,
        boardingPointId,
      });
    }
  }, [boardingPointId, session]);

  return (
    <div>
      {buses.map((bus) => (
        <BusCard
          key={bus.id}
          bus={bus}
          onViewDetails={() => {
            if (session?.user) {
              trackBusRouteViewed({
                userId: session.user.id,
                boardingPointId,
                busId: bus.id,
              });
            }
          }}
        />
      ))}
    </div>
  );
}
```

### In Admin Component

```tsx
'use client';

import { trackAdminModelCreated } from '@/lib/posthog-events';
import { useSession } from 'next-auth/react';

export function AdminModelForm() {
  const { data: session } = useSession();

  const handleCreateModel = async (modelData) => {
    try {
      const response = await fetch('/api/admin/create-model', {
        method: 'POST',
        body: JSON.stringify(modelData),
      });

      const newModel = await response.json();

      if (session?.user) {
        trackAdminModelCreated({
          adminUserId: session.user.id,
          modelId: newModel.id,
        });
      }

      showSuccessMessage('Model created successfully!');
    } catch (error) {
      console.error('Failed to create model:', error);
    }
  };

  return (
    // Your form JSX
  );
}
```

## Manual Pageview Tracking

While PostHog automatically tracks pageviews for SPA navigation, you can manually track specific pageviews if needed:

```tsx
import { trackPageView } from '@/lib/posthog-events';

// Manually track a pageview
trackPageView({
  url: window.location.href,
  path: '/dashboard/booking',
});
```

## Direct PostHog Access

For advanced use cases, you can access PostHog directly:

```tsx
'use client';

import { usePostHogClient } from '@/hooks/use-posthog';

export function MyComponent() {
  const posthog = usePostHogClient();

  const handleCustomEvent = () => {
    // Direct PostHog access for custom events
    posthog.capture('my_custom_event', {
      customProperty: 'value',
    });
  };

  return (
    // Your JSX
  );
}
```

## Best Practices

1. **Always include userId**: Every event should include the user ID for proper attribution
2. **Use descriptive property names**: Make property names self-explanatory
3. **Track at the right time**: Track events after confirming success (e.g., after booking confirmation)
4. **Include context**: Add relevant context like `boardingPointId`, `busId` to understand user journeys
5. **Handle async operations**: Track events after API calls complete, not before
6. **Group related events**: Use naming conventions like `seat_*` for seat-related events

## Debugging

In development mode, PostHog logs to the browser console. You can:

1. Check the browser console for PostHog debug messages
2. Visit your PostHog dashboard to see events in real-time
3. Use the PostHog browser extension to inspect events

## Data Privacy

PostHog is configured with:

- ✅ Input masking enabled: Sensitive form inputs are masked
- ✅ Session recording enabled: User sessions are recorded for UX insights
- ✅ No PII in events: Don't include passwords or sensitive data in event properties

## Troubleshooting

### Events not appearing in PostHog

1. Verify `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. Check browser console for errors
3. Ensure PostHog provider is initialized in root layout
4. Verify network requests to PostHog are successful (check Network tab)

### User identification not working

1. Ensure `trackUserLoggedIn()` is called after authentication
2. Check that the user email is being passed correctly
3. Verify the user session is available when tracking

### Too many events being captured

1. Review component re-renders that might cause duplicate tracking
2. Use `useEffect` with proper dependency arrays
3. Consider debouncing rapid event tracking

## Files Modified/Created

- ✅ `src/env.js` - Added PostHog environment variables
- ✅ `src/providers/PostHogProvider.tsx` - PostHog initialization
- ✅ `src/lib/posthog-events.ts` - Event tracking functions
- ✅ `src/hooks/use-posthog.ts` - Hook for direct PostHog access
- ✅ `src/app/layout.tsx` - Integrated PostHog provider
- ✅ `docs/POSTHOG_SETUP.md` - This documentation

## Next Steps

1. Set your `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`
2. Start your dev server: `npm run dev` or `pnpm dev`
3. Navigate through your app and verify events appear in PostHog dashboard
4. Integrate tracking calls in your components using the examples above
5. Test user sign-up and sign-in flows to ensure identification works
