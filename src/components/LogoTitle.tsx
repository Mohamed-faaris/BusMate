"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface LogoTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  animate?: boolean;
  duration?: number;
}

export function LogoTitle({ animate = false, duration = 0.8, className, ...props }: LogoTitleProps) {
  return (
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
      className={cn("text-card-foreground text-5xl font-extrabold sm:text-[5rem]",className)}
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
  );
}
