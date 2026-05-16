import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';


export const PremiumBg = () => {
  const [animationValue, setAnimationValue] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Animation similar to Flutter's AnimationController with repeat reverse
    const duration = 16000; // 16 seconds
    let animationFrameId;
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      // Calculate value between 0 and 1 that goes back and forth
      let value = (elapsed % duration) / duration;
      // Reverse animation (like repeat reverse in Flutter)
      if (Math.floor(elapsed / duration) % 2 === 1) {
        value = 1 - value;
      }
      
      setAnimationValue(value);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Calculate gradient positions based on animation value
  const calculateGradientPosition = () => {
    // Similar to Flutter's Alignment(-1 + _controller.value, -1)
    const x = -1 + animationValue;
    const y = -1;
    return { x, y };
  };

  const gradientPos = calculateGradientPosition();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: `linear-gradient(${gradientPos.x * 90}deg, 
            #14532D 0%, 
            #F0FDF4 50%, 
            #14532D 100%)`,
        }}
      />
      
      {/* Glow effects */}
      <div className="absolute -top-16 -left-16">
        <Glow size={180} color="#14532D" />
      </div>
      
      <div className="absolute -bottom-20 -right-12">
        <Glow size={220} color="#14532D" opacity={0.15} />
      </div>
    </div>
  );
};

// Glow component matching Flutter's _glow method
const Glow = ({ size, color, opacity }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: opacity,
        boxShadow: `0 0 80px 10px ${color}40`,
      }}
    />
  );
};