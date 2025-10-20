# 📊 PostHog Analytics - Complete Implementation Guide

## 📑 Documentation Index

Start here and follow the guides in order:

### 1. **POSTHOG_SUMMARY.md** ⭐ START HERE
   - Overview of what's been configured
   - Quick setup steps (3 minutes)
   - Testing verification checklist
   - Common issues and solutions
   - **Read this first to understand the setup**

### 2. **INTEGRATION_CHECKLIST.md** 🔧 THEN FOLLOW THIS
   - Step-by-step integration guide
   - Exact code snippets for each component
   - Where to add tracking calls in your code
   - Testing procedures
   - Debugging tips
   - **Follow this to integrate tracking in your components**

### 3. **POSTHOG_CONFIG_REFERENCE.md** 📋 FOR REFERENCE
   - Complete event schema documentation
   - Configuration options
   - Type safety information
   - Security considerations
   - Environment setup examples
   - **Reference this when configuring or troubleshooting**

### 4. **POSTHOG_SETUP.md** 📚 DETAILED GUIDE
   - Comprehensive setup documentation
   - Full API reference for all functions
   - Integration examples with complete code
   - Best practices and patterns
   - Advanced usage scenarios
   - **Deep dive into setup and usage**

### 5. **POSTHOG_QUICK_REFERENCE.md** ⚡ QUICK LOOKUP
   - Quick import and usage guide
   - Essential integrations summary
   - File checklist
   - Key features overview
   - Common issues table
   - **Quick reference while coding**

---

## 🎯 Quick Setup (5 minutes)

```bash
# 1. Get your PostHog API key from https://posthog.com

# 2. Add to .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_KEY_HERE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# 3. Start dev server
pnpm dev

# 4. Verify in browser console
# Look for PostHog initialization message

# 5. Check PostHog dashboard
# Navigate around app, you should see pageview events
```

---

## 📦 What's Included

### ✅ Already Configured
- `src/env.js` - Environment variables with validation
- `src/providers/PostHogProvider.tsx` - PostHog initialization
- `src/lib/posthog-events.ts` - Event tracking functions (8 events)
- `src/hooks/use-posthog.ts` - Custom hook for direct access
- `src/app/layout.tsx` - PostHog provider integration
- Automatic SPA pageview tracking
- Session recording with input masking

### ⏳ Your Next Steps
- Add `.env.local` with your PostHog API key
- Follow `INTEGRATION_CHECKLIST.md` to add tracking to components
- Test each flow (signup, login, booking)
- Monitor events in PostHog dashboard

---

## 🔄 8 Custom Events Configured

All with full TypeScript support and automatic user identification:

| Event | When | Properties |
|-------|------|-----------|
| `user_signed_up` | New registration | userId, email, boardingPointId |
| `user_logged_in` | User login | userId, email |
| `seat_selection_started` | Booking initiated | userId, busId, boardingPointId |
| `seat_selected` | Seat clicked | userId, busId, seatId, gender, boardingPointId |
| `seat_booking_attempt` | Booking submitted | userId, busId, seatId, status, failureReason |
| `seat_booking_completed` | Booking confirmed | userId, busId, seatId, boardingPointId |
| `bus_route_viewed` | Bus discovery | userId, boardingPointId, busId |
| `admin_model_created` | Admin creates model | adminUserId, modelId |

Plus:
- ✅ `$pageview` - Automatic on route changes
- ✅ Session Recording - Automatic per session
- ✅ User Identification - Automatic after login

---

## 📍 File Locations

### Core Integration Files
```
src/
├── providers/
│   └── PostHogProvider.tsx      ← PostHog initialization
├── lib/
│   └── posthog-events.ts        ← Event tracking functions
├── hooks/
│   └── use-posthog.ts           ← PostHog hook
├── env.js                       ← Config with validation
└── app/
    └── layout.tsx               ← Provider integration
```

### Documentation Files
```
docs/
├── POSTHOG_SUMMARY.md           ⭐ Start here
├── INTEGRATION_CHECKLIST.md     🔧 Then follow this
├── POSTHOG_CONFIG_REFERENCE.md  📋 For reference
├── POSTHOG_SETUP.md             📚 Detailed guide
├── POSTHOG_QUICK_REFERENCE.md   ⚡ Quick lookup
└── README.md                    ← This file
```

---

## 🚀 Integration Workflow

### Phase 1: Setup (Estimated: 5 min)
- [x] PostHog code configured ✅
- [ ] API key from PostHog.com
- [ ] `.env.local` configured
- [ ] Dev server running
- [ ] Pageviews appearing in PostHog

### Phase 2: Authentication (Estimated: 10 min)
- [ ] `trackUserSignUp()` in `RegisterForm.tsx`
- [ ] `trackUserLoggedIn()` in `SignInForm.tsx`
- [ ] `resetUserIdentity()` in logout handler
- [ ] Test: Sign up → See event in PostHog
- [ ] Test: Sign in → See user identified

### Phase 3: Booking Flow (Estimated: 20 min)
- [ ] `trackSeatSelectionStarted()` when user opens bus
- [ ] `trackSeatSelected()` when seat is clicked
- [ ] `trackSeatBookingAttempt()` on form submit
- [ ] `trackSeatBookingCompleted()` on success
- [ ] Test: Complete booking flow → See all events

### Phase 4: Additional Tracking (Estimated: 10 min)
- [ ] `trackBusRouteViewed()` in bus listing
- [ ] `trackAdminModelCreated()` in admin forms
- [ ] Test all admin actions

### Phase 5: Verification (Estimated: 5 min)
- [ ] All events appear in PostHog
- [ ] User identification working
- [ ] Session recording capturing correctly
- [ ] No duplicate events
- [ ] Error handling working

**Total Time: ~50 minutes for complete integration**

---

## 💡 Key Implementation Patterns

### Pattern 1: Basic Event Tracking
```tsx
import { trackBusRouteViewed } from '@/lib/posthog-events';
import { useSession } from 'next-auth/react';

export function BusListing() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      trackBusRouteViewed({
        userId: session.user.id,
        boardingPointId: 'bp123',
      });
    }
  }, [session]);
}
```

### Pattern 2: Event with Error Handling
```tsx
import { trackSeatBookingAttempt } from '@/lib/posthog-events';

const handleBooking = async () => {
  try {
    await bookSeat();
    trackSeatBookingAttempt({
      userId: session.user.id,
      busId: busId,
      seatId: seatId,
      status: 'success',
    });
  } catch (error) {
    trackSeatBookingAttempt({
      userId: session.user.id,
      busId: busId,
      seatId: seatId,
      status: 'failure',
      failureReason: error.message,
    });
  }
};
```

### Pattern 3: User Identification
```tsx
import { trackUserLoggedIn } from '@/lib/posthog-events';

if (loginSuccess) {
  // This both tracks the event AND identifies the user
  trackUserLoggedIn({
    userId: user.id,
    email: user.email,
  });
}
```

---

## 🧪 Testing Checklist

Use this to verify your setup:

```
Setup Verification:
- [ ] API key copied from PostHog.com
- [ ] .env.local created with API key
- [ ] Dev server started with `pnpm dev`
- [ ] No console errors
- [ ] Browser shows PostHog debug messages
- [ ] PostHog dashboard shows pageview events

Authentication Flow:
- [ ] Sign up successful
- [ ] user_signed_up event appears in PostHog
- [ ] Sign in successful
- [ ] user_logged_in event appears
- [ ] User identified by email in PostHog
- [ ] Logout successful
- [ ] User reset to anonymous

Booking Flow:
- [ ] Navigate to booking page
- [ ] seat_selection_started event captured
- [ ] Click a seat
- [ ] seat_selected event captured
- [ ] Click book/submit
- [ ] seat_booking_attempt event captured
- [ ] Booking confirmed
- [ ] seat_booking_completed event captured

Data Quality:
- [ ] No duplicate events
- [ ] All events have correct properties
- [ ] No PII (passwords, sensitive data) in events
- [ ] User sessions recording correctly
- [ ] Session recordings playback smoothly

PostHog Dashboard:
- [ ] All events visible
- [ ] User dashboard shows identified users
- [ ] Funnels show booking flow
- [ ] Session recordings available
- [ ] Insights can be created
```

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Events not appearing | See POSTHOG_CONFIG_REFERENCE.md → Troubleshooting |
| User not identified | See INTEGRATION_CHECKLIST.md → Step 3 |
| Module not found | Run: `pnpm install posthog-js` |
| Compilation errors | Run: `pnpm install` and `pnpm dev` |
| Duplicate events | Check POSTHOG_SETUP.md → Best Practices |
| Session recording not working | See POSTHOG_CONFIG_REFERENCE.md → Session Recording |

---

## 📊 What You'll See in PostHog

### Events Page
- All captured events listed chronologically
- Filter by event name
- View event properties

### Insights
- Create funnels (signup → booking → completion)
- Create trends (event counts over time)
- Create cohorts (group users by behavior)

### Users
- Each user identified by email
- View user's complete event history
- See user's session recordings

### Recordings
- Watch actual user sessions
- See clicks, scrolls, form inputs
- Identify UX issues

---

## 📞 Support & Resources

- **PostHog Documentation**: https://posthog.com/docs
- **React SDK Reference**: https://posthog.com/docs/libraries/react
- **Event Naming Guide**: https://posthog.com/docs/data/event-naming
- **Session Recording**: https://posthog.com/docs/session-recording

---

## ✅ Success Criteria

Your PostHog integration is successful when:

1. ✅ All 8 custom events tracked with correct properties
2. ✅ Users identified by email after login
3. ✅ Automatic pageview tracking working
4. ✅ Session recording capturing user interactions
5. ✅ No console errors or warnings
6. ✅ No duplicate events
7. ✅ PostHog dashboard showing insights
8. ✅ Team can access analytics dashboard

---

## 🎉 Next Actions

**Right now:**
1. Read `POSTHOG_SUMMARY.md` (5 min)
2. Get PostHog API key (2 min)
3. Add to `.env.local` (1 min)
4. Restart dev server (1 min)
5. Verify setup (2 min)

**Then:**
1. Follow `INTEGRATION_CHECKLIST.md` step by step
2. Add tracking to each component
3. Test each flow
4. Monitor PostHog dashboard
5. Iterate based on data

---

## 📌 Remember

- PostHog is **already configured** ✅
- Just need to add your **API key** 🔑
- Then **integrate tracking calls** into components 📝
- **Test thoroughly** before production 🧪
- **Review analytics regularly** 📊

---

**Start with**: `POSTHOG_SUMMARY.md` →  
**Then follow**: `INTEGRATION_CHECKLIST.md` →  
**Reference**: `POSTHOG_CONFIG_REFERENCE.md`

Good luck! 🚀
