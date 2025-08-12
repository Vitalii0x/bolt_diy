"use client";

import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "6px",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden bg-transparent p-[1px] text-sm",
        containerClassName
      )}
      style={{
        borderRadius,
      }}
      {...otherProps}
    >
      {/* Animated border trail */}
      <div className="absolute inset-0" style={{ borderRadius }}>
        <MovingBorder duration={duration} rx="6" ry="6">
          <div
            className={cn(
              "h-[10px] w-[100px] rounded-full bg-[radial-gradient(circle,#dd7bbb_20%,#d79f1e_40%,#5a922c_60%,#4c7894_80%,transparent_100%)] blur-sm opacity-100",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      {/* Button content */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center border dark:border-[#4B525B] dark:bg-[#292F35] hover:dark:bg-[#4B525B] transition-colors px-4 py-2.3 text-xs dark:text-white text-black bg-[#E7E2E0] border-[#b7b3b0] hover:bg-[#EFEAE6]",
          className
        )}
        style={{
          borderRadius,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
