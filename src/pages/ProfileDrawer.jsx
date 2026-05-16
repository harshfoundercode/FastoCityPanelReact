// src/components/ProfileDrawer.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Shield,
  Camera,
  Edit,
  CheckCircle,
  Circle,
} from 'lucide-react';

// Color constants matching Flutter
const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

// Mock profile data matching the API response
const mockProfileData = {
  id: 1,
  cityzoneid: 1,
  name: "Tanisha",
  phone: "9555602291",
  email: "tanisha@gmail.com",
  address: "lucknow",
  adharno: "123654789014",
  panno: "ABCDE1234F",
  img: "",
  status: 1
};

export const ProfileDrawer = ({ isOpen, onClose }) => {
  // In real app, fetch this data from API
  const profileData = mockProfileData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            className="fixed right-0 top-0 h-full z-50 bg-white shadow-2xl"
            style={{ 
              width: '100%',
              maxWidth: '420px',
            }}
          >
            {/* Drawer Content */}
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Header with Close Button */}
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
                    Profile Details
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} style={{ color: Colors.textGrey1 }} />
                  </motion.button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="flex-1 px-6 py-6">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
                      style={{ 
                        backgroundColor: Colors.primaryExtraLightGreen,
                        border: `3px solid ${Colors.primaryGreen}`,
                      }}
                    >
                      {profileData.img ? (
                        <img
                          src={profileData.img}
                          alt={profileData.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={40} style={{ color: Colors.primaryGreen }} />
                      )}
                    </div>
                    
                    {/* Edit Photo Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-2 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      style={{ 
                        backgroundColor: Colors.primaryGreen,
                        border: '2px solid white',
                      }}
                    >
                      <Camera size={14} color="white" />
                    </motion.button>
                  </div>
                  
                  <h3 
                    className="text-xl font-bold mt-3"
                    style={{ color: Colors.textBlack }}
                  >
                    {profileData.name}
                  </h3>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: profileData.status === 1 
                          ? Colors.primaryExtraLightGreen 
                          : '#FEE2E2',
                        color: profileData.status === 1 
                          ? Colors.primaryGreen 
                          : '#DC2626',
                      }}
                    >
                      {profileData.status === 1 ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Circle size={12} />
                      )}
                      {profileData.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Profile Information Cards */}
                <div className="space-y-4">
                  {/* Email */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: Colors.containerGrey2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                      >
                        <Mail size={18} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                          Email Address
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: Colors.textBlack }}>
                          {profileData.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: Colors.containerGrey2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                      >
                        <Phone size={18} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                          Phone Number
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: Colors.textBlack }}>
                          +91 {profileData.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: Colors.containerGrey2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                      >
                        <MapPin size={18} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                          Address
                        </p>
                        <p className="text-sm font-medium mt-0.5 capitalize" style={{ color: Colors.textBlack }}>
                          {profileData.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Aadhar Number */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: Colors.containerGrey2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                      >
                        <CreditCard size={18} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                          Aadhar Number
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: Colors.textBlack }}>
                          {profileData.adharno.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PAN Number */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: Colors.containerGrey2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                      >
                        <FileText size={18} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                          PAN Number
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: Colors.textBlack }}>
                          {profileData.panno}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* City Zone ID */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: Colors.containerGrey2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                      >
                        <Shield size={18} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                          City Zone ID
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: Colors.textBlack }}>
                          {profileData.cityzoneid}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl mt-6 font-medium"
                  style={{
                    backgroundColor: Colors.primaryGreen,
                    color: 'white',
                  }}
                >
                  <Edit size={18} />
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};