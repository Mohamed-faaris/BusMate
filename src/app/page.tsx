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
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-12 flex justify-center">
            <div className="scale-150 transform">
              <LogoTitle animate={true} />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-slate-900 md:text-6xl dark:text-slate-100">
            Smart Bus Seat Booking
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-slate-600 md:text-2xl dark:text-slate-300">
            Modern bus transportation management for campuses and routes. Book
            seats, track buses, and manage your fleet with ease.
          </p>

          {/* Key Features Grid */}
          <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Real-time Booking
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Book seats instantly with live availability and visual seat
                selection
              </p>
            </div>

            <div className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Route Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Filter buses by boarding points and track routes with arrival
                times
              </p>
            </div>

            <div className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Admin Control
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Comprehensive admin panel for managing buses, routes, and users
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mx-auto max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm dark:bg-slate-800/90">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Get Started
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Join thousands of students and commuters using BusMate for
              hassle-free travel
            </p>

            {(() => {
              if (session.status === "authenticated") {
                return (
                  <Link href="/dashboard" className="block">
                    <Button className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                );
              } else if (session.status === "unauthenticated") {
                return (
                  <div className="space-y-3">
                    <Link href="/auth/signIn" className="block">
                      <Button className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button variant="outline" className="w-full py-3 text-lg">
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
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-slate-800/60">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-indigo-500" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Easy Scheduling
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Plan your trips with flexible booking options
            </p>
          </div>

          <div className="rounded-lg bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-slate-800/60">
            <Shield className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Secure & Safe
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Verified users and secure payment processing
            </p>
          </div>

          <div className="rounded-lg bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-slate-800/60">
            <Smartphone className="mx-auto mb-2 h-8 w-8 text-purple-500" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Mobile Friendly
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Book from anywhere with our responsive design
            </p>
          </div>

          <div className="rounded-lg bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-slate-800/60">
            <Bus className="mx-auto mb-2 h-8 w-8 text-blue-500" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Live Tracking
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Real-time bus location and arrival updates
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
