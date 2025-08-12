import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CustomSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

export const CustomSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
}: CustomSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const percent = x / rect.width;
      const newValue = Math.round((min + percent * (max - min)) / step) * step;
      onChange(Number(newValue.toFixed(2)));
    },
    [min, max, step, onChange]
  );

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopDragging);
  }, [handleMouseMove]);

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDragging);
  };

  return (
    <div className="w-full py-0">
      <div
        ref={trackRef}
        className="relative h-2 bg-[#E7E2E0] dark:bg-[#4B525B] rounded-full cursor-pointer"
        onMouseDown={startDragging}
      >
        <motion.div
          className="absolute h-full bg-[#ffd6a7] dark:bg-[#00D5BF] rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <motion.div
          className="absolute top-1/2 w-4 h-4 bg-[#ffd6a7] dark:bg-gray-200 border border-[#ffd6a7] dark:border-[#00D5BF] rounded-full shadow -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="text-sm text-center text-muted-foreground mt-2.5">
        <span>{value}</span> Days
      </div>
    </div>
  );
};
