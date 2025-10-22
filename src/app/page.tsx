"use client";
import { Loader } from "@/components/Loader";
import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Users, ArrowRight, Route, Eye } from "lucide-react";

export default function HomePage() {
  const session = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="mb-16 text-center sm:mb-20">
          <div className="mb-8 flex justify-center sm:mb-12">
            <div className="scale-125 transform sm:scale-150">
              <LogoTitle animate={true} />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-slate-100">
            BusMate
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-slate-600 sm:text-2xl dark:text-slate-300">
            Streamlined bus transportation management for educational
            institutions and commuter routes
          </p>

          {/* Primary CTA */}
          <div className="mb-16 flex justify-center">
            {(() => {
              if (session.status === "authenticated") {
                return (
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
                      Access Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                );
              } else if (session.status === "unauthenticated") {
                return (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="/auth/signIn">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        variant="outline"
                        className="border-2 border-slate-300 px-8 py-4 text-lg font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div className="flex items-center justify-center py-4">
                    <Loader />
                  </div>
                );
              }
            })()}
          </div>
        </div>

        {/* User Journey Flow */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Simple, Streamlined Experience
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Your journey from login to seat selection in three easy steps
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  1. Login to Dashboard
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Secure authentication and personalized dashboard access for
                  students and administrators
                </p>
                <div className="absolute top-10 -right-4 hidden md:block">
                  <ArrowRight className="h-8 w-8 text-slate-400" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Route className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  2. Check Routes & Select
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Browse available routes, filter by boarding points, and select
                  your preferred journey
                </p>
                <div className="absolute top-10 -right-4 hidden md:block">
                  <ArrowRight className="h-8 w-8 text-slate-400" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  3. View Bus & Seat Availability
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Interactive bus layout with real-time seat availability and
                  instant booking confirmation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        {/* <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Everything you need for modern bus transportation management
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl dark:bg-slate-800/90">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Bus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Real-time Booking
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Instant seat selection with live availability updates and visual
                bus layouts
              </p>
            </div>

            <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl dark:bg-slate-800/90">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <MapPin className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Smart Route Management
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                GPS-enabled boarding points, route optimization, and arrival
                time tracking
              </p>
            </div>

            <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl dark:bg-slate-800/90">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Admin Dashboard
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Comprehensive management tools for buses, routes, users, and
                analytics
              </p>
            </div>
          </div>
        </div> */}

        {/* Additional Benefits */}
        {/* <div className="mb-16">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                Easy Scheduling
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Flexible booking with advance reservations
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                Secure & Safe
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Verified users and secure transactions
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
                <Smartphone className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                Mobile Optimized
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Perfect experience on all devices
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <CheckCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                Live Tracking
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Real-time bus location updates
              </p>
            </div>
          </div>
        </div> */}

        {/* Final CTA */}
        <div className="text-center">
          <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-2xl sm:p-12">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-blue-100 sm:text-lg">
              Join thousands of students and commuters who trust BusMate for
              their daily transportation needs
            </p>

            {session.status === "authenticated" ? (
              <Link href="/dashboard">
                <Button className="bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : session.status === "unauthenticated" ? (
              <Link href="/auth/register">
                <Button className="bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
