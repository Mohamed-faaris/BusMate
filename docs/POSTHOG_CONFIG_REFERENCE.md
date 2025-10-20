# PostHog Configuration Reference

## Environment Variables

All PostHog environment variables are defined in `src/env.js` with Zod validation.

### Client-Side Variables (Public)

```typescript
// Add to your .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_KEY_HERE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**Required**: `NEXT_PUBLIC_POSTHOG_KEY`  
**Optional**: `NEXT_PUBLIC_POSTHOG_HOST` (defaults to US endpoint)

### Configuration Options

The PostHog client is initialized in `src/providers/PostHogProvider.tsx` with:

```typescript
posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  // API Configuration
  api_host: env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',

  // SPA Tracking
  capture_pageview: true,        // Automatic pageview on route changes
  capture_pageleave: true,       // Track when user leaves page

  // Session Recording
  session_recording: {
    maskAllInputs: true,         // Mask all form inputs
  },

  // Debug Configuration
  debug: process.env.NODE_ENV === 'development',  // Console logs in dev
});
```

---

## Event Properties Schema

All events are tracked with the following structure:

### `user_signed_up`
```typescript
{
  userId: string;          // User's ID
  email: string;           // User's email
  boardingPointId?: string; // Selected boarding point (optional)
}
```

### `user_logged_in`
```typescript
{
  userId: string;          // User's ID
  email: string;           // User's email
}
// Also calls: posthog.identify(email, { userId, email })
```

### `seat_selection_started`
```typescript
{
  userId: string;          // User's ID
  busId: string;          // Bus ID
  boardingPointId: string; // Boarding point ID
}
```

### `seat_selected`
```typescript
{
  userId: string;          // User's ID
  busId: string;          // Bus ID
  seatId: string;         // Seat ID
  gender: string;         // Seat gender (M/F/etc)
  boardingPointId: string; // Boarding point ID
}
```

### `seat_booking_attempt`
```typescript
{
  userId: string;          // User's ID
  busId: string;          // Bus ID
  seatId: string;         // Seat ID
  status: 'success' | 'failure'; // Booking status
  failureReason?: string;  // Error message (if failed)
}
```

### `seat_booking_completed`
```typescript
{
  userId: string;          // User's ID
  busId: string;          // Bus ID
  seatId: string;         // Seat ID
  boardingPointId: string; // Boarding point ID
}
```

### `bus_route_viewed`
```typescript
{
  userId: string;          // User's ID
  boardingPointId: string; // Boarding point ID
  busId?: string;         // Specific bus ID (optional)
}
```

### `admin_model_created`
```typescript
{
  adminUserId: string;     // Admin user's ID
  modelId: string;        // Created model's ID
}
```

### `$pageview` (Automatic)
```typescript
{
  url: string;            // Full URL
  path: string;           // URL path (optional)
}
```

---

## API Hosts

Choose the appropriate host based on your region:

| Region | Host |
|--------|------|
| US (Default) | `https://us.i.posthog.com` |
| EU | `https://eu.i.posthog.com` |
| Custom | Your PostHog self-hosted URL |

---

## Type Safety

All tracking functions have full TypeScript support:

```typescript
// ✅ Correct - TypeScript will catch missing properties
trackUserSignUp({
  userId: 'user123',
  email: 'user@example.com',
  boardingPointId: 'bp456',
});

// ❌ TypeScript Error - Missing required property
trackUserSignUp({
  userId: 'user123',
  // Missing email
});

// ❌ TypeScript Error - Wrong property type
trackSeatSelected({
  userId: 'user123',
  busId: 'bus123',
  seatId: 'seat123',
  gender: 'M',
  boardingPointId: 'bp456',
  unknownProp: 'invalid', // Error: Object literal may only specify known properties
});
```

---

## Session Recording Configuration

PostHog automatically records user sessions with the following settings:

| Setting | Value | Purpose |
|---------|-------|---------|
| `maskAllInputs` | `true` | Don't record sensitive input data |
| Enabled | By default | Capture all sessions |
| Max Duration | PostHog default | Automatic session breaks |

### What Gets Recorded
✅ User interactions (clicks, scrolls)  
✅ Page navigations  
✅ Console errors  
✅ Network requests (basic info)

### What Gets Masked
🔐 Form input values  
🔐 Password fields  
🔐 Payment information  

---

## Debug Mode

In development, PostHog logs to the browser console:

```
// Example debug output
[PostHog] Loaded module: decide ✓
[PostHog] initializeHubspotProvider called
[PostHog] Capturing event: pageview
{url: 'http://localhost:3000/dashboard', ...}
```

Disable debug in production (automatically):
```typescript
// src/providers/PostHogProvider.tsx
debug: process.env.NODE_ENV === 'development', // Only in dev
```

---

## Performance Considerations

### Event Queuing
- Events are queued and sent in batches
- Default batch size: 50 events
- Events sent periodically (not immediately)

### Network Impact
- ~5-10KB per batch of 50 events
- Minimal overhead on app performance
- Async: doesn't block user interactions

### Storage
- PostHog is stored in browser localStorage
- Only for session tracking purposes
- ~100KB per user

---

## Security Notes

### Data Transmission
✅ Events sent via HTTPS to PostHog servers  
✅ No raw passwords stored  
✅ Email used as anonymous identifier until login

### Input Protection
✅ Form inputs masked in recordings  
✅ Sensitive fields not included in events  
✅ PII can be excluded from custom properties

### Best Practices
1. Never include passwords in event properties
2. Never include API keys in event properties
3. Never include sensitive personal data
4. Review event properties before sending

---

## Testing Configuration

### Local Development
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_development_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Staging
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_staging_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Production
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_production_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## Common Configuration Changes

### Disable Session Recording
```typescript
// In src/providers/PostHogProvider.tsx
session_recording: {
  recordCanvas: false,      // Don't record canvas elements
  maskAllInputs: true,
  enabled: false,           // Disable entirely
}
```

### Enable Canvas Recording
```typescript
session_recording: {
  recordCanvas: true,       // Record canvas elements (like plots)
  maskAllInputs: true,
}
```

### Change Event Batch Size
```typescript
// This is handled by PostHog SDK automatically
// Default: 50 events per batch
// Adjust in PostHog dashboard settings if needed
```

### Add Custom Initialization
```typescript
// In src/providers/PostHogProvider.tsx after init()
posthog.setPersonProperties({
  theme: 'dark',           // Example property
  plan: 'premium',         // Example property
});
```

---

## Troubleshooting Configuration

### Events Not Sending
1. Check `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. Verify API host is reachable
3. Check browser console for errors
4. Look at Network tab for failed PostHog requests

### Wrong Region Data
1. Verify `NEXT_PUBLIC_POSTHOG_HOST` matches your PostHog region
2. Can't mix EU and US endpoints - use consistently
3. Restart dev server after changing host

### Session Recording Issues
1. Check if recording is enabled in PostHog dashboard
2. Verify `session_recording` config is correct
3. Check browser storage isn't full
4. Clear localStorage and retry

---

## Environment File Example

Create `.env.local`:
```env
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_abc123def456ghi789
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Other environment variables...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
AUTH_SECRET=your-secret-here
```

---

## Next Steps

1. ✅ Set `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local`
2. ✅ Start dev server: `pnpm dev`
3. ✅ Verify events in PostHog dashboard
4. ✅ Follow `INTEGRATION_CHECKLIST.md` to add tracking calls
5. ✅ Test each user flow (signup, login, booking)
6. ✅ Monitor events in production PostHog project

See `POSTHOG_SETUP.md` for detailed integration examples.
