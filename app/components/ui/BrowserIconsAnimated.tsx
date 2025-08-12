"use client";

import { animate, motion } from "framer-motion";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import BraveImg from "../../../assets/icons/Brave.svg";
import ChromeImg from "../../../assets/icons/Chrome.svg";
import OperaImg from "../../../assets/icons/Opera.svg";
import FireFoxImg from "../../../assets/icons/Firefox.svg";
import EdgeImg from "../../../assets/icons/Edge.svg";

export function BrowserIconsAnimated() {
  useEffect(() => {
    const scale = [1, 1.1, 1];
    const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];

    const sequence = [
      [".circle-1", { scale, transform }, { duration: 0.6, easing: "easeInOut" }],
      [".circle-2", { scale, transform }, { duration: 0.6, easing: "easeInOut", delay: 0.1 }],
      [".circle-3", { scale, transform }, { duration: 0.6, easing: "easeInOut", delay: 0.2 }],
      [".circle-4", { scale, transform }, { duration: 0.6, easing: "easeInOut", delay: 0.3 }],
      [".circle-5", { scale, transform }, { duration: 0.6, easing: "easeInOut", delay: 0.4 }],
    ];

    animate(sequence, {
      repeat: Infinity,
      repeatDelay: 0.5,
    });
  }, []);

  return (
    <div className="relative flex justify-center gap-6 my-8">
      <Container className="h-17 w-17 circle-1">
        <img src={BraveImg} alt="brave" width={46} height={46} />
      </Container>
      <Container className="h-17 w-17 circle-2">
        <img src={ChromeImg} alt="chrome" width={46} height={46} />
      </Container>
      <Container className="h-21 w-21 circle-3">
        <img src={OperaImg} alt="opera" width={66} height={66} />
      </Container>
      <Container className="h-17 w-17 circle-4">
        <img src={FireFoxImg} alt="firefox" width={46} height={46} />
      </Container>
      <Container className="h-17 w-17 circle-5">
        <img src={EdgeImg} alt="edge" width={46} height={46} />
      </Container>

      <Sparkles />
    </div>
  );
}

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `rounded-full flex items-center justify-center
        bg-[rgba(0,0,0,0.01)] dark:bg-[rgba(248,248,248,0.01)]
        shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]`,
        className
      )}
    >
      {children}
    </div>
  );
};

const Sparkles = () => {
  const random = () => Math.random();
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random() * 0.5 + 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`sparkle-${i}`}
          initial={{
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, randomOpacity(), 0],
            scale: [0.5, 1, 0.5],
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
          }}
          transition={{
            duration: random() * 2 + 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: random() * 2,
          }}
          className="absolute w-[2px] h-[2px] rounded-full bg-black dark:bg-white"
        />
      ))}
    </div>
  );
};
