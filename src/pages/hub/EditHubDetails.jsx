// src/components/EditHubDrawer.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Lock,
  Save,
  Loader,
  RefreshCw,
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useEditHubViewModel } from '../../hooks/useHubEditViewModel';

const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

export const EditHubDrawer = ({ isOpen, onClose, hubId, hubName }) => {
  const { hubProfile, isLoading, isUpdating, error, fetchHubProfile, updateHubProfile } = useEditHubViewModel();

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    hubzoneid: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    adharno: '',
    panno: '',
    img: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch hub profile when drawer opens
  useEffect(() => {
    if (isOpen && hubId) {
      fetchHubProfile(hubId);
    }
  }, [isOpen, hubId, fetchHubProfile]);

  // Set form data when profile is loaded
  useEffect(() => {
    if (hubProfile) {
      setFormData({
        id: hubProfile.id || '',
        hubzoneid: hubProfile.hub_details?.hub_id || hubId || '',
        name: hubProfile.name || '',
        email: hubProfile.email || '',
        password: hubProfile.password || '',
        phone: hubProfile.phone || '',
        address: hubProfile.address || '',
        adharno: hubProfile.adharno || '',
        panno: hubProfile.panno || '',
        img: hubProfile.img || '',
      });
    }
  }, [hubProfile, hubId]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone is required');
      return;
    }

    // If password is provided, validate length
    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Prepare data for API
    const updateData = {
      id: formData.id,
      hubzoneid: formData.hubzoneid,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      adharno: formData.adharno,
      panno: formData.panno,
      img: formData.img,
      email: formData.email,
      password: formData.password || hubProfile?.password || '',
    };

    const result = await updateHubProfile(updateData);
    
    if (result) {
      setHasChanges(false);
      // Refresh profile data
      fetchHubProfile(hubId);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse px-4 py-6 space-y-6">
      <div className="h-4 bg-gray-200 rounded w-32" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full bg-white z-50 shadow-2xl overflow-hidden"
            style={{ width: '100%', maxWidth: '480px' }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-br from-[#166534] to-[#14532D] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Edit Hub</h2>
                    <p className="text-white/70 text-xs mt-0.5 capitalize">{hubName}</p>
                  </div>
                  <button onClick={onClose} className="text-white hover:scale-110 transition-transform">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading && !hubProfile && <LoadingSkeleton />}

                {error && !isLoading && !hubProfile && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <button
                      onClick={() => fetchHubProfile(hubId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: Colors.primaryGreen }}
                    >
                      <RefreshCw size={16} />
                      Retry
                    </button>
                  </div>
                )}

                {hubProfile && (
                  <div className="px-4 py-6 space-y-5">
                    {/* Hub Info Display (Non-editable) */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 size={16} style={{ color: Colors.primaryGreen }} />
                        <span className="text-sm font-semibold" style={{ color: Colors.primaryGreen }}>
                          Hub Information
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Hub Name:</span>
                          <span className="font-medium capitalize">{hubProfile.hub_details?.hub_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Zone:</span>
                          <span className="font-medium capitalize">{hubProfile.hub_details?.cityhub_name}</span>
                        </div>
                        
                      </div>
                    </div>

                   

                    {/* Editable Fields */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 rounded-full bg-green-700" />
                        <h3 className="text-base font-bold" style={{ color: Colors.textBlack }}>
                          Edit Information
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {/* Name */}
                        <FormField
                          icon={<User size={18} />}
                          label="Name"
                          value={formData.name}
                          onChange={(val) => handleChange('name', val)}
                          placeholder="Enter name"
                        />

                        {/* Email */}
                        <FormField
                          icon={<Mail size={18} />}
                          label="Email"
                          value={formData.email}
                          onChange={(val) => handleChange('email', val)}
                          placeholder="Enter email"
                          type="email"
                        />

                        {/* Phone */}
                        <FormField
                          icon={<Phone size={18} />}
                          label="Phone"
                          value={formData.phone}
                          onChange={(val) => handleChange('phone', val)}
                          placeholder="Enter phone number"
                          type="tel"
                          maxLength={10}
                        />

                        {/* Address */}
                        <FormField
                          icon={<MapPin size={18} />}
                          label="Address"
                          value={formData.address}
                          onChange={(val) => handleChange('address', val)}
                          placeholder="Enter address"
                        />

                        {/* Password */}
                        <div className="bg-white rounded-xl border border-gray-200 p-3">
                          <label className="text-xs text-gray-400 mb-1 block">Password</label>
                          <div className="relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2">
                              <Lock size={18} style={{ color: Colors.textGrey1 }} />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => handleChange('password', e.target.value)}
                              placeholder="Leave blank to keep current"
                              className="w-full pl-8 pr-10 py-2 text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        {/* Aadhar Number */}
                        <FormField
                          icon={<CreditCard size={18} />}
                          label="Aadhar Number"
                          value={formData.adharno}
                          onChange={(val) => handleChange('adharno', val)}
                          placeholder="Enter Aadhar number"
                          maxLength={12}
                        />

                        {/* PAN Number */}
                        <FormField
                          icon={<FileText size={18} />}
                          label="PAN Number"
                          value={formData.panno}
                          onChange={(val) => handleChange('panno', val)}
                          placeholder="Enter PAN number"
                          maxLength={10}
                          uppercase
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Save Button */}
              {hubProfile && (
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isUpdating || !hasChanges}
                      className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: Colors.primaryGreen }}
                    >
                      {isUpdating ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Reusable Form Field Component
const FormField = ({ icon, label, value, onChange, placeholder, type = 'text', maxLength, uppercase }) => {
  const Colors = {
    primaryGreen: '#14532D',
    textGrey1: '#6B7280',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 hover:border-green-300 transition-colors focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-200">
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <div style={{ color: Colors.textGrey1 }}>{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => {
            let val = e.target.value;
            if (uppercase) val = val.toUpperCase();
            onChange(val);
          }}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 text-sm outline-none"
          style={{ color: '#1F2937' }}
        />
      </div>
    </div>
  );
};