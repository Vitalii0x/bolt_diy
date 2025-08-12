import { motion } from 'framer-motion';

const WaveLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[100px] mx-auto my-4">
        <div className="flex">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="w-[8px] h-[8px] rounded-[2px] bg-[#FFD6A7] dark:bg-[#00D5BF] mr-[5px] mb-[5px]"
              animate={{
                y: [0, 20, 0],
                opacity: [1, 0.2, 1]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaveLoader;