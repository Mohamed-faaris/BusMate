# PostHog Integration Checklist - Step by Step

Follow this checklist to integrate PostHog analytics tracking into your BusMate components.

## ✅ Setup (Already Complete)

- [x] Environment variables configured in `src/env.js`
- [x] PostHog provider created in `src/providers/PostHogProvider.tsx`
- [x] Event tracking functions created in `src/lib/posthog-events.ts`
- [x] PostHog provider integrated into root layout (`src/app/layout.tsx`)

## 🔧 Integration Steps

### Step 1: Add PostHog Key to `.env.local`

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_KEY_HERE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Step 2: Track User Sign-Up (RegisterForm.tsx)

**Location**: `src/components/RegisterForm.tsx`

**Where to add**: After successful OTP verification and auto-login

Find this section:

```tsx
{verifyOtpMutation.isSuccess &&
  (() => {
    signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })
      .then((res) => {
        if (res?.ok) {
          router.push("/dashboard");
        }
      })
```

**Add this import at the top**:

```tsx
import { trackUserSignUp } from "@/lib/posthog-events";
```

**Modify the sign-in promise**:

```tsx
.then(async (res) => {
  if (res?.ok) {
    // Track the signup
    trackUserSignUp({
      userId: formData.rollNo, // or get actual userId from API
      email: formData.email,
      boardingPointId: formData.boardingPoint,
    });
    router.push("/dashboard");
  }
})
```

---

### Step 3: Track User Login (SignInForm.tsx)

**Location**: `src/components/SignInForm.tsx`

**Where to add**: After successful sign-in

Find this section:

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setButtonState("loading");
  setErrors({});
  try {
    // Validate form data with Zod
    const validatedData = signInSchema.parse(formData);

    // Call NextAuth signIn
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });
```

**Add this import at the top**:

```tsx
import { trackUserLoggedIn } from "@/lib/posthog-events";
```

**Modify the sign-in handler**:

```tsx
const result = await signIn("credentials", {
  email: validatedData.email,
  password: validatedData.password,
  redirect: false,
});

if (result?.ok) {
  // Fetch session to get user ID
  const sessionResponse = await fetch("/api/auth/session");
  const session = await sessionResponse.json();

  // Track the login
  if (session?.user) {
    trackUserLoggedIn({
      userId: session.user.id,
      email: session.user.email,
    });
  }

  setButtonState("success");
  router.push("/dashboard");
}
```

---

### Step 4: Track Logout

**Location**: Check for a logout handler (may be in Navbar or a dedicated component)

**Add this**:

```tsx
import { resetUserIdentity } from "@/lib/posthog-events";
import { signOut } from "next-auth/react";

const handleLogout = async () => {
  resetUserIdentity(); // Reset PostHog tracking
  await signOut({ redirect: true, redirectTo: "/auth/signin" });
};
```

---

### Step 5: Track Seat Selection (BookingPage.tsx)

**Location**: `src/app/dashboard/booking/BookingPage.tsx`

**Add this import at the top**:

```tsx
import {
  trackSeatSelectionStarted,
  trackSeatSelected,
  trackSeatBookingAttempt,
  trackSeatBookingCompleted,
} from "@/lib/posthog-events";
```

**Track when user selects a bus**:
Add this when the Bus component is rendered or seat selection starts:

```tsx
useEffect(() => {
  if (session?.user && selectedBusId && selectedBoardingPoint) {
    trackSeatSelectionStarted({
      userId: session.user.id,
      busId: selectedBusId,
      boardingPointId: selectedBoardingPoint.id,
    });
  }
}, [selectedBusId, selectedBoardingPoint, session]);
```

**Track individual seat selection**:
Find where seats are clicked/selected and add:

```tsx
const handleSeatClick = (seatId: string) => {
  if (session?.user) {
    trackSeatSelected({
      userId: session.user.id,
      busId: selectedBusId,
      seatId: seatId,
      gender: getUserGender(), // Get from session or form
      boardingPointId: selectedBoardingPoint.id,
    });
  }
  // ... existing seat selection logic
};
```

**Track booking attempt**:
Find the booking submission code and wrap it:

```tsx
const handleBooking = async () => {
  if (!session?.user) return;

  try {
    const response = await fetch("/api/bookSeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seatId, busId }),
    });

    if (response.ok) {
      // Track successful attempt
      trackSeatBookingAttempt({
        userId: session.user.id,
        busId: selectedBusId,
        seatId: selectedSeat.id,
        status: "success",
      });

      // Track completion
      trackSeatBookingCompleted({
        userId: session.user.id,
        busId: selectedBusId,
        seatId: selectedSeat.id,
        boardingPointId: selectedBoardingPoint.id,
      });

      // Show success message
      showSuccessNotification("Booking confirmed!");
    } else {
      const error = await response.json();
      trackSeatBookingAttempt({
        userId: session.user.id,
        busId: selectedBusId,
        seatId: selectedSeat.id,
        status: "failure",
        failureReason: error.message || "Unknown error",
      });

      showErrorNotification("Booking failed. Please try again.");
    }
  } catch (error) {
    trackSeatBookingAttempt({
      userId: session.user.id,
      busId: selectedBusId,
      seatId: selectedSeat.id,
      status: "failure",
      failureReason: error instanceof Error ? error.message : "Network error",
    });

    showErrorNotification("An error occurred. Please try again.");
  }
};
```

---

### Step 6: Track Bus Route Views (DashboardPage.tsx)

**Location**: `src/app/dashboard/page.tsx`

**Add this import**:

```tsx
import { trackBusRouteViewed } from "@/lib/posthog-events";
```

**Add tracking when data loads**:

```tsx
const { data: dashboardData, isLoading } = useQuery({
  queryKey: ["dashboard", session?.user?.id],
  queryFn: fetchDashboardData,
  onSuccess: (data) => {
    // Track the route view
    if (session?.user && data.boardingPoint) {
      trackBusRouteViewed({
        userId: session.user.id,
        boardingPointId: data.boardingPoint.id,
      });
    }
  },
});
```

---

### Step 7: Track Admin Actions (admin/model/page.tsx)

**Location**: `src/app/admin/model/page.tsx`

**Add this import**:

```tsx
import { trackAdminModelCreated } from "@/lib/posthog-events";
```

**Track model creation**:
Find the submit handler and add tracking:

```tsx
const handleSubmit = async () => {
  try {
    const response = await fetch("/api/admin/create-model", {
      method: "POST",
      body: JSON.stringify(modelData),
    });

    const createdModel = await response.json();

    // Track the creation
    if (session?.user) {
      trackAdminModelCreated({
        adminUserId: session.user.id,
        modelId: createdModel.id,
      });
    }

    showSuccessNotification("Model created!");
  } catch (error) {
    showErrorNotification("Failed to create model");
  }
};
```

---

### Step 8: Track Bus Creation (admin/bus/page.tsx)

**Location**: `src/app/admin/bus/page.tsx`

**Add this import**:

```tsx
import { trackAdminModelCreated } from "@/lib/posthog-events";
```

**Track bus creation** (same as model):

```tsx
// After successful API call
if (session?.user) {
  trackAdminModelCreated({
    adminUserId: session.user.id,
    modelId: newBus.id,
  });
}
```

---

## 🧪 Testing Checklist

After integrating all tracking:

- [ ] Set `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local`
- [ ] Run `pnpm dev`
- [ ] Open browser DevTools Console
- [ ] Sign up as a new user
- [ ] Verify `user_signed_up` event in PostHog
- [ ] Sign in with credentials
- [ ] Verify `user_logged_in` event in PostHog
- [ ] Verify user is identified (look for email)
- [ ] Navigate to booking page
- [ ] Verify `seat_selection_started` event
- [ ] Click a seat
- [ ] Verify `seat_selected` event
- [ ] Book a seat
- [ ] Verify `seat_booking_attempt` and `seat_booking_completed` events
- [ ] Sign out
- [ ] Verify user is reset to anonymous
- [ ] Check PostHog dashboard for all events

## 🐛 Debugging

**Events not showing up?**

1. Check PostHog key is correct in `.env.local`
2. Check browser console for errors
3. Open Network tab and search for "posthog" - you should see requests
4. Verify you're using the correct API host

**User not identified?**

1. Make sure `trackUserLoggedIn()` is called after sign-in succeeds
2. Check that user ID and email are available in the session
3. Verify network requests include the identify call

**Getting TypeScript errors?**

1. Run `pnpm install posthog-js`
2. Check that import paths are correct
3. Verify types are installed: `npm install --save-dev @types/posthog-js`

## 📊 What You'll See in PostHog

After integration, you should see:

1. **Events Page**: All custom events (user_signed_up, seat_selected, etc.)
2. **Insights**: Funnels from signup → booking → completion
3. **Users**: Each identified user with their email and interactions
4. **Recordings**: Session recordings of user journeys

## 📝 Files to Modify

| File                                        | Status     | Added Code                   |
| ------------------------------------------- | ---------- | ---------------------------- |
| `src/components/RegisterForm.tsx`           | ⏳ Pending | Import + trackUserSignUp()   |
| `src/components/SignInForm.tsx`             | ⏳ Pending | Import + trackUserLoggedIn() |
| `src/components/Navbar.tsx`                 | ⏳ Pending | Import + resetUserIdentity() |
| `src/app/dashboard/booking/BookingPage.tsx` | ⏳ Pending | All seat tracking calls      |
| `src/app/dashboard/page.tsx`                | ⏳ Pending | trackBusRouteViewed()        |
| `src/app/admin/model/page.tsx`              | ⏳ Pending | trackAdminModelCreated()     |
| `src/app/admin/bus/page.tsx`                | ⏳ Pending | trackAdminModelCreated()     |

---

## 🎯 Priority Order

**High Priority (Do First)**:

1. Sign-up tracking
2. Sign-in tracking
3. Logout tracking

**Medium Priority (Do Second)**: 4. Seat selection tracking 5. Booking attempt tracking

**Lower Priority (Do Third)**: 6. Bus route view tracking 7. Admin action tracking

---

## 💡 Pro Tips

- Always wrap tracking calls in `if (session?.user)` checks
- Track events AFTER API calls succeed, not before
- Include all relevant context (IDs, types, etc.)
- Use `useEffect` with proper dependencies to avoid duplicate tracking
- Test in development with console open to see debug messages
