"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

interface LogoTitleProps {
  animate?: boolean;
  duration?: number;
  showLogo?: boolean;
  className?: string;
}

export function LogoTitle({
  animate = false,
  duration = 0.8,
  showLogo = true,
  className,
}: LogoTitleProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {showLogo && (
        <motion.div
          initial={animate ? { opacity: 0, x: -30 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={
            animate
              ? {
                  duration: duration * 0.75,
                  delay: 0,
                  type: "spring",
                  stiffness: 120,
                }
              : undefined
          }
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          className="flex-shrink-0"
        >
          <Image
            src="/logo.png"
            alt="K. Ramakrishnan College of Engineering"
            width={80}
            height={80}
            className="rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
            priority
          />
        </motion.div>
      )}
      <motion.h1
        initial={animate ? { opacity: 0, y: -20, scale: 0.9 } : false}
        animate={animate ? { opacity: 1, y: 0, scale: 1 } : false}
        transition={
          animate
            ? {
                duration,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }
            : undefined
        }
        className="text-card-foreground text-6xl font-extrabold"
      >
        <motion.span
          className="text-primary"
          initial={animate ? { opacity: 0, x: -30 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={
            animate
              ? {
                  duration: duration * 0.75,
                  delay: duration * 0.25,
                  type: "spring",
                  stiffness: 120,
                }
              : undefined
          }
        >
          Bus
        </motion.span>
        <motion.span
          initial={animate ? { opacity: 0, x: 30 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={
            animate
              ? {
                  duration: duration * 0.75,
                  delay: duration * 0.5,
                  type: "spring",
                  stiffness: 120,
                }
              : undefined
          }
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          Mate
        </motion.span>
      </motion.h1>
    </div>
  );
}
