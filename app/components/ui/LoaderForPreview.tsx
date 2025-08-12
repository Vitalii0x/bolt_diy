import React from 'react';
import { motion } from 'framer-motion';

const GeneratingLoader = () => {
  const text = "ask blake is working on it...";
  
  // Calculate delay increment based on text length
  const delayIncrement = 4 / text.length * 0.25;
  
  // Animation configuration for each character
  const charAnimation = (char: string, i: number) => {
    const isSpace = char === ' ';
    
    return {
      opacity: [0, 1, 0.2, 0],
      ...(!isSpace && {
        // textShadow: ["0 0 0px #fff", "0 0 4px #fff", "0 0 0px #fff"],
        scale: [1, 1.1, 1],
        y: [0, -2, 0]
      }),
      transition: {
        duration: 4,
        times: [0, 0.05, 0.2, 1],
        repeat: Infinity,
        delay: i * delayIncrement
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center h-[120px]  w-auto m-8 scale-[2] font-sans text-[1.6em] font-semibold select-none text-white">
        {/* Animated Characters */}
        <div className="relative z-10">
          {text.split('').map((char, i) => (
            <motion.h3
              key={i}
              animate={charAnimation(char, i)}
              className={`inline-block ${char === ' ' ? 'min-w-[0.3em]' : ''} text-[10px] tracking-[0.7px] dark:text-white text-black`}
            >
              {char}
            </motion.h3>
          ))}
        </div>

        {/* Animated Loader Background */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          {/* Stripe pattern */}
          <div 
            className="absolute inset-0"
            style={{
              mask: "repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px)",
              WebkitMask: "repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px)"
            }}
          >
            {/* Colorful gradients with vignette mask */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%),
                  radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%),
                  radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%),
                  radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%),
                  radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%)
                `,
                mask: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)",
                WebkitMask: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)"
              }}
              animate={{
                x: ["-55%", "55%"],
                opacity: [0, 1, 0, 0]
              }}
              transition={{
                x: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: [0.6, 0.8, 0.5, 1]
                },
                opacity: {
                  duration: 4,
                  times: [0, 0.15, 0.65, 1],
                  repeat: Infinity,
                }
              }}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default GeneratingLoader;