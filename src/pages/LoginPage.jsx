import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PremiumBg } from '../components/premiumBg';
import { useLoginViewModel } from '../hooks/userLoginViewModel';
import AppLogo from '../assets/app_logo.png';
import toast from 'react-hot-toast';

// Color constants matching Flutter ColorConst
const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
};

export const AdminLoginScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // Use the login hook
  const {
    email,
    setEmail,
    password,
    setPassword,
    loginLoading,
    loginApi,
  } = useLoginViewModel();
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive card width matching Flutter logic
  const getCardWidth = () => {
    if (screenWidth < 600) return screenWidth * 0.92;
    if (screenWidth >= 600 && screenWidth < 1100) return screenWidth * 0.55;
    return screenWidth * 0.32;
  };

  const getScreenHeight = () => window.innerHeight;

  // Handle login with API call
  const handleLogin = () => {
    loginApi();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg />
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ 
            width: getCardWidth(),
            backgroundColor: `${Colors.primaryExtraLightGreen}E6`,
            borderRadius: '20px',
            border: `1px solid ${Colors.primaryExtraLightGreen}4D`,
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.15)',
          }}
          className="p-7"
        >
          <div className="flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
              style={{
                width: 64,
                height: 64,
                backgroundColor: Colors.primaryGreen,
                borderRadius: '14px',
              }}
              className="flex items-center justify-center mb-5"
            >
              <img 
                src={AppLogo} 
                alt="Logo" 
                style={{ width: 65, height: 65 }}
                className="object-contain p-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/55x55?text=Logo';
                }}
              />
            </motion.div>

            <div style={{ height: getScreenHeight() * 0.03 }} />

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 
                style={{ 
                  fontSize: 22, 
                  fontWeight: 'bold', 
                  color: Colors.textBlack 
                }}
              >
                City Admin
              </h1>
            </motion.div>

            <div style={{ height: getScreenHeight() * 0.01 }} />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{ 
                fontSize: 13, 
                color: Colors.textGrey1 
              }}
            >
              Login to manage your inventory
            </motion.p>

            <div style={{ height: getScreenHeight() * 0.032 }} />

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <InputField
                type="email"
                placeholder="Email address"
                icon={<Mail size={20} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </motion.div>

            <div style={{ height: getScreenHeight() * 0.032 }} />

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <InputField
                type="password"
                placeholder="Password"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isPassword={true}
                isVisible={isPasswordVisible}
                onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </motion.div>

            <div style={{ height: 24 }} />

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <motion.button
                onClick={handleLogin}
                disabled={loginLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  height: 52,
                  width: '100%',
                  backgroundColor: Colors.primaryGreen,
                  borderRadius: '12px',
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  opacity: loginLoading ? 0.7 : 1,
                }}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {loginLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>
                        Logging in...
                      </span>
                    </div>
                  ) : (
                    <span 
                      style={{ 
                        color: 'white', 
                        fontWeight: 600,
                        fontSize: 14
                      }}
                    >
                      Login
                    </span>
                  )}
                </div>
                
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ 
  type, 
  placeholder, 
  icon, 
  value, 
  onChange, 
  isPassword = false, 
  isVisible = false, 
  onToggle,
  onKeyPress 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group w-full">
      <div 
        className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10"
        style={{ 
          color: isFocused ? Colors.primaryLightGreen : '#9CA3AF'
        }}
      >
        {icon}
      </div>
      
      <input
        type={isPassword ? (isVisible ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '14px 12px 14px 40px',
          backgroundColor: Colors.containerGrey2,
          borderRadius: '12px',
          outline: 'none',
          border: 'none',
          fontSize: 14,
          transition: 'all 0.2s',
          boxShadow: isFocused ? `0 0 0 2px ${Colors.primaryLightGreen}80` : 'none',
        }}
      />
      
      {isPassword && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors z-10"
          style={{ color: '#9CA3AF' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};