// src/pages/hubs/AddHubManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Image,
  CheckCircle,
  XCircle,
  Building2,
  ChevronDown,
  Loader,
  BadgeCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { HubService, HubManagerService, UploadService } from '../../hooks/AddHubMangerViewModel';
import { useProfileViewModel } from '../../hooks/UserProfileViewModel';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT - FULL WIDTH
// ─────────────────────────────────────────────────────────────────────────────
export const AddHubManager = () => {
  // Profile hook
  const { profileData, fetchProfile } = useProfileViewModel();

  // States
  const [hubZones, setHubZones] = useState([]);
  const [selectedHubZoneId, setSelectedHubZoneId] = useState('');
  const [isLoadingZones, setIsLoadingZones] = useState(false);
  
  const [managerImage, setManagerImage] = useState(null);
  const [managerImagePreview, setManagerImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    adharno: '',
    panno: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Fetch profile then hub zones on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  

const loadInitialData = async () => {
  // Step 1: Profile API call - cityzoneid lena
  const profile = await fetchProfile();
  
  // Profile response se cityzoneid
  const cityzoneid = profile?.cityzoneid;
  
  console.log('City Zone ID from profile:', cityzoneid);
  
  // Step 2: cityzoneid ko hub zone list API ke param me dena
  loadHubZones(cityzoneid);
};

const loadHubZones = async (cityzoneid) => {
  setIsLoadingZones(true);
  try {
    // Hub zone list API me cityzoneid as param
    const result = await HubService.getHubZoneList(cityzoneid);
    
    if (result.success) {
      setHubZones(result.data || []);
    }
  } catch (error) {
    toast.error('Failed to load hub zones');
  } finally {
    setIsLoadingZones(false);
  }
};
  // Handle input changes
  const handleChange = (field, value) => {
    let processedValue = value;
    
    if (field === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'adharno') {
      processedValue = value.replace(/\D/g, '').slice(0, 12);
    } else if (field === 'panno') {
      processedValue = value.toUpperCase().slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Image pick handler
  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setManagerImage(file);
      setManagerImagePreview(URL.createObjectURL(file));
      setShowImagePicker(false);
    }
  };

  // Validators
  const validators = {
    name: (v) => v.trim().length >= 2,
    phone: (v) => v.replace(/\D/g, '').length === 10,
    address: (v) => v.trim().length >= 5,
    adharno: (v) => v.replace(/\s/g, '').length === 12,
    panno: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v),
    email: (v) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(v),
    password: (v) => v.length >= 6,
    hub: (v) => v !== '',
  };

  const getErrorMessage = (field) => {
    const messages = {
      name: 'Name is required (min 2 characters)',
      phone: 'Valid 10-digit phone number required',
      address: 'Address is required',
      adharno: 'Valid 12-digit Aadhaar required',
      panno: 'Valid PAN format required (ABCDE1234F)',
      email: 'Valid email address required',
      password: 'Password must be at least 6 characters',
      hub: 'Please select a hub zone',
    };
    return messages[field] || 'Required';
  };

  const validateForm = () => {
    const newErrors = {};
    const allFields = { ...formData, hub: selectedHubZoneId };
    
    Object.keys(validators).forEach(field => {
      if (!validators[field](allFields[field] || '')) {
        newErrors[field] = getErrorMessage(field);
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Submit
  const handleSubmit = async () => {
    const allTouched = {};
    Object.keys(validators).forEach(f => allTouched[f] = true);
    setTouched(allTouched);
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = '';
      
      if (managerImage) {
        const uploadResult = await UploadService.uploadToCloudinary(managerImage);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          toast.error('Image upload failed');
          setIsSubmitting(false);
          return;
        }
      }
      
      const payload = {
        hubzoneid: selectedHubZoneId,
        name: formData.name.trim(),
        phone: formData.phone,
        address: formData.address.trim(),
        adharno: formData.adharno,
        panno: formData.panno,
        img: imageUrl,
        email: formData.email.trim(),
        password: formData.password,
      };
      
      const result = await HubManagerService.createManager(payload);
      
      if (result.success) {
        toast.success('Hub Manager created successfully!');
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create hub manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      adharno: '',
      panno: '',
      email: '',
      password: '',
    });
    setSelectedHubZoneId('');
    setManagerImage(null);
    setManagerImagePreview(null);
    setTouched({});
    setErrors({});
  };

  const isFieldValid = (field) => touched[field] && validators[field]?.(formData[field] || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new hub manager</p>
        </div>
        <span className="px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-600" />
          New
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Hero Card & Hub Selection */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Hero Card with Avatar */}
          <div className="bg-gradient-to-br from-[#14532D] to-[#166534] rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setShowImagePicker(true)}
                className="relative group mb-4"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 overflow-hidden flex items-center justify-center">
                  {managerImagePreview ? (
                    <img src={managerImagePreview} alt="Manager" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center">
                  <Camera size={14} className="text-green-800" />
                </div>
              </button>
              
              <h2 className="text-white font-bold text-lg">New Hub Manager</h2>
              <p className="text-white/70 text-xs mt-1">Tap the avatar to upload photo</p>
            </div>
          </div>

          {/* Hub Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Building2 size={20} className="text-green-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Assign Hub</h3>
                <p className="text-xs text-gray-500">Select the hub for this manager</p>
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedHubZoneId}
                onChange={(e) => {
                  setSelectedHubZoneId(e.target.value);
                  setTouched(prev => ({ ...prev, hub: true }));
                }}
                className={`w-full h-12 rounded-xl border px-4 pr-10 text-sm font-semibold appearance-none cursor-pointer outline-none transition-all ${
                  touched.hub && !selectedHubZoneId
                    ? 'border-red-300 bg-red-50'
                    : touched.hub && selectedHubZoneId
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <option value="">{isLoadingZones ? 'Loading...' : 'Choose a hub zone'}</option>
                {hubZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - {zone.radiusInKm || zone.radiuskm} km
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                {touched.hub && selectedHubZoneId && (
                  <CheckCircle size={18} className="text-green-600" />
                )}
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
            {touched.hub && !selectedHubZoneId && (
              <p className="text-red-500 text-xs mt-1.5">Please select a hub</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <User size={20} className="text-green-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Personal Information</h3>
                <p className="text-xs text-gray-500">Manager's name and contact details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
                icon={<User size={18} />}
                value={formData.name}
                onChange={(v) => handleChange('name', v)}
                touched={touched.name}
                isValid={isFieldValid('name')}
                error={errors.name}
              />
              
              <FormInput
                label="Phone Number"
                placeholder="e.g. 9876543210"
                icon={<Phone size={18} />}
                value={formData.phone}
                onChange={(v) => handleChange('phone', v)}
                touched={touched.phone}
                isValid={isFieldValid('phone')}
                error={errors.phone}
                maxLength={10}
              />
              
              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  placeholder="e.g. 12, MG Road, Lucknow"
                  icon={<MapPin size={18} />}
                  value={formData.address}
                  onChange={(v) => handleChange('address', v)}
                  touched={touched.address}
                  isValid={isFieldValid('address')}
                  error={errors.address}
                />
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <BadgeCheck size={20} className="text-green-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">KYC Documents</h3>
                <p className="text-xs text-gray-500">Aadhaar and PAN for verification</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Aadhaar Number"
                placeholder="XXXX XXXX XXXX"
                icon={<CreditCard size={18} />}
                value={formData.adharno}
                onChange={(v) => handleChange('adharno', v)}
                touched={touched.adharno}
                isValid={isFieldValid('adharno')}
                error={errors.adharno}
                maxLength={12}
              />
              
              <FormInput
                label="PAN Number"
                placeholder="e.g. ABCDE1234F"
                icon={<FileText size={18} />}
                value={formData.panno}
                onChange={(v) => handleChange('panno', v)}
                touched={touched.panno}
                isValid={isFieldValid('panno')}
                error={errors.panno}
                maxLength={10}
              />
            </div>
          </div>

          {/* Account Credentials */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Lock size={20} className="text-green-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Account Credentials</h3>
                <p className="text-xs text-gray-500">Login email and password for the manager</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email Address"
                placeholder="e.g. rahul@example.com"
                icon={<Mail size={18} />}
                value={formData.email}
                onChange={(v) => handleChange('email', v)}
                touched={touched.email}
                isValid={isFieldValid('email')}
                error={errors.email}
              />
              
              <div>
                <FormInput
                  label="Password"
                  placeholder="Min. 6 characters"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={(v) => handleChange('password', v)}
                  touched={touched.password}
                  isValid={isFieldValid('password')}
                  error={errors.password}
                  type={showPassword ? 'text' : 'password'}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                    </button>
                  }
                />
                
                {touched.password && formData.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        className={`h-full rounded-full ${
                          passwordStrength <= 1 ? 'bg-red-500' :
                          passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-600'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 3 ? 'Moderate' : 'Strong'} - Use uppercase, numbers & symbols
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isSubmitting ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <>
                <User size={20} />
                Create Manager
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Image Picker Modal */}
      <AnimatePresence>
        {showImagePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImagePicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-5 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-gray-900 text-center mb-1">Upload Photo</h3>
              <p className="text-xs text-gray-500 text-center mb-4">Choose a source</p>
              
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100">
                  <Camera size={22} className="text-green-800" />
                  <span className="text-sm font-semibold text-green-800">Camera</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleImagePick} className="hidden" />
                </label>
                
                <label className="flex flex-col items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100">
                  <Image size={22} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-600">Gallery</span>
                  <input type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const FormInput = ({
  label,
  placeholder,
  icon,
  value,
  onChange,
  touched,
  isValid,
  error,
  type = 'text',
  maxLength,
  rightIcon,
}) => {
  const getBorderColor = () => {
    if (!touched) return 'border-gray-200';
    if (error) return 'border-red-300';
    if (isValid) return 'border-green-300';
    return 'border-gray-200';
  };

  const getBgColor = () => {
    if (!touched) return 'bg-gray-50';
    if (error) return 'bg-red-50';
    if (isValid) return 'bg-green-50';
    return 'bg-gray-50';
  };

  return (
    <div>
      <label className="text-xs text-gray-500 font-medium mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full h-12 rounded-xl border pl-10 pr-10 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-green-200 ${getBorderColor()} ${getBgColor()} text-gray-900 placeholder-gray-400`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {touched && (
            isValid ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : error ? (
              <XCircle size={18} className="text-red-500" />
            ) : null
          )}
          {rightIcon}
        </div>
      </div>
      {touched && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};