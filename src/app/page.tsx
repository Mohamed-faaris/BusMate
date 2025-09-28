"use client";
import { Loader } from "@/components/Loader";
import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Bus, MapPin, Users, Calendar, Shield, Smartphone } from "lucide-react";

export default function HomePage() {
 const session = useSession();

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-12 flex justify-center">
            <div className="scale-150 transform">
              <LogoTitle animate={true} />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Smart Bus Seat Booking
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Modern bus transportation management for campuses and routes.
            Book seats, track buses, and manage your fleet with ease.
          </p>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Real-time Booking
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Book seats instantly with live availability and visual seat selection
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Route Management
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Filter buses by boarding points and track routes with arrival times
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Admin Control
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Comprehensive admin panel for managing buses, routes, and users
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Get Started
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Join thousands of students and commuters using BusMate for hassle-free travel
            </p>

            {(() => {
              if (session.status === "authenticated") {
                return (
                  <Link href="/dashboard" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                );
              } else if (session.status === "unauthenticated") {
                return (
                  <div className="space-y-3">
                    <Link href="/auth/signIn" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <Calendar className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Easy Scheduling</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Plan your trips with flexible booking options</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Secure & Safe</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Verified users and secure payment processing</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <Smartphone className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Mobile Friendly</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Book from anywhere with our responsive design</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <Bus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Live Tracking</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Real-time bus location and arrival updates</p>
          </div>
        </div>
      </div>
    </main>
  );
}
