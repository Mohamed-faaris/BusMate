"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { motionConfig } from "@/lib/motion";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  animate?: boolean;
}

export function ThemeToggle({ animate = false }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the server render
    return (
      <Button variant="ghost" size="icon" className="relative overflow-hidden">
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <motion.div
      whileHover={animate ? { scale: 1.1 } : undefined}
      whileTap={animate ? { scale: 0.95 } : undefined}
      transition={animate ? motionConfig.transition : undefined}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative overflow-hidden"
      >
        <motion.div
          className="relative"
          animate={animate ? { rotate: theme === "dark" ? 360 : 0 } : undefined}
          transition={animate ? motionConfig.transition : undefined}
        >
          <AnimatePresence mode="wait">
            {theme === "light" ? (
              <motion.div
                key="sun"
                initial={animate ? { scale: 0, rotate: -180 } : undefined}
                animate={animate ? { scale: 1, rotate: 0 } : undefined}
                exit={animate ? { scale: 0, rotate: 180 } : undefined}
                transition={
                  animate ? { duration: 0.3, ease: "easeInOut" } : undefined
                }
              >
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={animate ? { scale: 0, rotate: -180 } : undefined}
                animate={animate ? { scale: 1, rotate: 0 } : undefined}
                exit={animate ? { scale: 0, rotate: 180 } : undefined}
                transition={
                  animate ? { duration: 0.3, ease: "easeInOut" } : undefined
                }
              >
                <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-full"
            animate={
              animate
                ? {
                    background:
                      theme === "light"
                        ? "radial-gradient(circle, rgba(250, 204, 21, 0.2) 0%, rgba(251, 146, 60, 0.1) 100%)"
                        : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)",
                    scale: [1, 1.2, 1],
                  }
                : undefined
            }
            transition={
              animate
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
          />
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
