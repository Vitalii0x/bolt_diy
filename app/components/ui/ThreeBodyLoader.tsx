import { motion } from 'framer-motion';

const ThreeBodyLoader = ({ size = 20, speed = 0.8 }) => {
  // Calculate animation durations
  const spinDuration = speed * 2.5;
  const wobbleDuration = speed;

  return (
    <div className="flex justify-center items-center">
        <motion.div 
          className="relative inline-block"
          style={{
            height: `${size}px`,
            width: `${size}px`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: spinDuration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* Dot 1 */}
          <div 
            className="absolute h-full w-[30%]"
            style={{
              bottom: "5%",
              left: 0,
              transform: "rotate(60deg)",
              transformOrigin: "50% 85%"
            }}
          >
            <motion.div
              className="absolute w-full rounded-full bg-[#ffd6a7] dark:bg-[#00D5BF]"
              style={{
                paddingBottom: "100%", 
                bottom: 0,
                left: 0
              }}
              animate={{
                y: ["0%", "-66%", "0%"],
                scale: [1, 0.65, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: wobbleDuration,
                ease: "easeInOut",
                repeat: Infinity,
                delay: -speed * 0.3
              }}
            />
          </div>
          
          {/* Dot 2 */}
          <div 
            className="absolute h-full w-[30%]"
            style={{
              bottom: "5%",
              right: 0,
              transform: "rotate(-60deg)",
              transformOrigin: "50% 85%"
            }}
          >
            <motion.div
              className="absolute w-full rounded-full bg-[#ffd6a7] dark:bg-[#00D5BF]"
              style={{ 
                paddingBottom: "100%",
                bottom: 0,
                left: 0
              }}
              animate={{
                y: ["0%", "-66%", "0%"],
                scale: [1, 0.65, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: wobbleDuration,
                ease: "easeInOut",
                repeat: Infinity,
                delay: -speed * 0.15
              }}
            />
          </div>
          
          {/* Dot 3 */}
          <div 
            className="absolute h-full w-[30%]"
            style={{
              bottom: "-5%",
              left: 0,
              transform: "translateX(116.666%)"
            }}
          >
            <motion.div
              className="absolute w-full rounded-full bg-[#ffd6a7] dark:bg-[#00D5BF]"
              style={{
                paddingBottom: "100%",
                top: 0,
                left: 0
              }}
              animate={{
                y: ["0%", "66%", "0%"],
                scale: [1, 0.65, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: wobbleDuration,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />
          </div>
        </motion.div>
      
    </div>
  );
};

export default ThreeBodyLoader;