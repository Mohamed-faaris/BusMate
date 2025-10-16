"use client";
import { Loader } from "@/components/Loader";
import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Bus, MapPin, Users, Calendar, Shield, Smartphone } from "lucide-react";

export default function HomePage() {
  const session = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-8 flex justify-center sm:mb-12">
            <div className="scale-125 transform sm:scale-150">
              <LogoTitle animate={true} />
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-slate-100">
            Smart Bus Seat Booking
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:mb-8 sm:text-xl md:text-2xl lg:max-w-3xl dark:text-slate-300">
            Modern bus transportation management for campuses and routes. Book
            seats, track buses, and manage your fleet with ease.
          </p>

          {/* Key Features Grid */}
          <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:p-6 dark:bg-slate-800/80">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 sm:mb-4 sm:h-12 sm:w-12">
                <Bus className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
                Real-time Booking
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Book seats instantly with live availability and visual seat
                selection
              </p>
            </div>

            <div className="rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:p-6 dark:bg-slate-800/80">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 sm:mb-4 sm:h-12 sm:w-12">
                <MapPin className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
                Route Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Filter buses by boarding points and track routes with arrival
                times
              </p>
            </div>

            <div className="rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:col-span-2 sm:p-6 lg:col-span-1 dark:bg-slate-800/80">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 sm:mb-4 sm:h-12 sm:w-12">
                <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
                Admin Control
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Comprehensive admin panel for managing buses, routes, and users
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mx-auto max-w-sm rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:max-w-md sm:p-8 dark:bg-slate-800/90">
            <h2 className="mb-3 text-xl font-bold text-slate-900 sm:mb-4 sm:text-2xl dark:text-slate-100">
              Get Started
            </h2>
            <p className="mb-4 text-sm text-slate-600 sm:mb-6 sm:text-base dark:text-slate-300">
              Join thousands of students and commuters using BusMate for
              hassle-free travel
            </p>

            {(() => {
              if (session.status === "authenticated") {
                return (
                  <Link href="/dashboard" className="block">
                    <Button className="w-full bg-blue-600 py-3 text-base text-white hover:bg-blue-700 sm:py-3 sm:text-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                );
              } else if (session.status === "unauthenticated") {
                return (
                  <div className="space-y-3">
                    <Link href="/auth/signIn" className="block">
                      <Button className="w-full bg-blue-600 py-3 text-base text-white hover:bg-blue-700 sm:py-3 sm:text-lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button
                        variant="outline"
                        className="w-full py-3 text-base sm:py-3 sm:text-lg"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                );
              }
            })()}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          <div className="rounded-lg bg-white/60 p-3 text-center backdrop-blur-sm sm:p-4 dark:bg-slate-800/60">
            <Calendar className="mx-auto mb-2 h-6 w-6 text-indigo-500 sm:h-8 sm:w-8" />
            <h4 className="mb-1 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base dark:text-slate-100">
              Easy Scheduling
            </h4>
            <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
              Plan your trips with flexible booking options
            </p>
          </div>

          <div className="rounded-lg bg-white/60 p-3 text-center backdrop-blur-sm sm:p-4 dark:bg-slate-800/60">
            <Shield className="mx-auto mb-2 h-6 w-6 text-green-500 sm:h-8 sm:w-8" />
            <h4 className="mb-1 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base dark:text-slate-100">
              Secure & Safe
            </h4>
            <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
              Verified users and secure payment processing
            </p>
          </div>

          <div className="rounded-lg bg-white/60 p-3 text-center backdrop-blur-sm sm:p-4 dark:bg-slate-800/60">
            <Smartphone className="mx-auto mb-2 h-6 w-6 text-purple-500 sm:h-8 sm:w-8" />
            <h4 className="mb-1 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base dark:text-slate-100">
              Mobile Friendly
            </h4>
            <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
              Book from anywhere with our responsive design
            </p>
          </div>

          <div className="rounded-lg bg-white/60 p-3 text-center backdrop-blur-sm sm:p-4 dark:bg-slate-800/60">
            <Bus className="mx-auto mb-2 h-6 w-6 text-blue-500 sm:h-8 sm:w-8" />
            <h4 className="mb-1 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base dark:text-slate-100">
              Live Tracking
            </h4>
            <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
              Real-time bus location and arrival updates
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
