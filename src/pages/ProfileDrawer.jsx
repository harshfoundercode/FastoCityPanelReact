// src/components/ProfileDrawer.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  RefreshCcw,
  Loader,
} from "lucide-react";
import { useProfileViewModel } from "../hooks/userProfileViewModel";

export const ProfileDrawer = ({ isOpen, onClose }) => {
  const { profileData, isLoading, error, fetchProfile } = useProfileViewModel();

  // Fetch profile data when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  // Format Aadhar number for display
  const formatAadhar = (number) => {
    if (!number) return "XXXX XXXX XXXX";
    return `XXXX XXXX ${number.toString().slice(-4)}`;
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone;
  };

  const InfoCard = ({ icon, title, value, verified }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            {icon}
          </div>

          {/* Content */}
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">{title}</p>

            <p className="text-sm font-semibold text-gray-800 mt-0.5 break-all">
              {value || "N/A"}
            </p>
          </div>
        </div>

        {/* Verified */}
        {verified && (
          <div className="bg-green-100 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0">
            Verified
          </div>
        )}
      </div>
    </div>
  );

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {/* Avatar Skeleton */}
      <div className="flex items-center gap-4 mt-3 relative z-10">
        <div className="w-16 h-16 rounded-full bg-white/20" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-white/20 rounded" />
          <div className="h-5 w-24 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="px-4 py-4 space-y-5">
        {/* Active Card Skeleton */}
        <div className="h-14 bg-gray-200 rounded-xl" />

        {/* Contact Section Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
          ))}
        </div>

        {/* Documents Section Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
          ))}
        </div>

        {/* Zone Section Skeleton */}
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 280,
            }}
            className="fixed right-0 top-0 h-full bg-[#F8FAFC] z-[999] shadow-2xl overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <div className="h-full overflow-y-auto">
              {/* HEADER */}
              <div className="relative z-10 bg-gradient-to-br from-[#166534] to-[#14532D] px-5 pt-6 pb-6 overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute top-10 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                {/* Close Button */}
                <div className="flex justify-end relative z-[9999]">
                  <button
                    onClick={onClose}
                    className="text-white hover:scale-110 duration-200 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Loading State */}
                {isLoading && !profileData && <LoadingSkeleton />}

                {/* Error State */}
                {error && !isLoading && !profileData && (
                  <div className="flex flex-col items-center justify-center py-8 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                      <RefreshCcw size={32} className="text-white" />
                    </div>
                    <p className="text-white text-sm text-center mb-4">
                      {error}
                    </p>
                    <button
                      onClick={() => fetchProfile()}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Profile Data */}
                {profileData && (
                  <div className="flex items-center gap-4 mt-3 relative z-10">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#166534] text-3xl font-bold shadow-lg">
                      {profileData.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {/* User Info */}
                    <div>
                      <h2 className="text-2xl font-bold text-white capitalize">
                        {profileData.name}
                      </h2>

                      <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                        <span className="text-white text-xs font-semibold">
                          City Manager
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BODY */}
              {profileData && !isLoading && (
                <div className="px-4 py-4 space-y-5">
                  {/* Active Card */}
                  <div 
                    className={`rounded-xl px-4 py-3 flex items-center justify-between ${
                      profileData.status === 1 
                        ? "bg-[#EAFBF1] border border-[#86EFAC]" 
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        profileData.status === 1 ? "bg-green-500" : "bg-red-500"
                      }`} />

                      <p className={`font-semibold text-sm ${
                        profileData.status === 1 ? "text-green-800" : "text-red-800"
                      }`}>
                        {profileData.status === 1 ? "Account is Active" : "Account is Inactive"}
                      </p>
                    </div>

                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      profileData.status === 1 ? "text-green-700" : "text-red-700"
                    }`}>
                      {profileData.status === 1 ? "Verified" : "Inactive"}
                      <CheckCircle size={14} />
                    </div>
                  </div>

                  {/* CONTACT INFO */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 rounded-full bg-green-700" />

                      <h3 className="text-lg font-bold text-gray-800">
                        Contact Information
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <InfoCard
                        icon={<Phone size={18} className="text-sky-500" />}
                        title="Phone"
                        value={formatPhone(profileData.phone)}
                      />

                      <InfoCard
                        icon={<Mail size={18} className="text-violet-500" />}
                        title="Email"
                        value={profileData.email}
                      />

                      <InfoCard
                        icon={<MapPin size={18} className="text-orange-500" />}
                        title="Address"
                        value={profileData.address}
                      />
                    </div>
                  </div>

                  {/* DOCUMENTS */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 rounded-full bg-green-700" />

                      <h3 className="text-lg font-bold text-gray-800">
                        Documents
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <InfoCard
                        icon={
                          <CreditCard size={18} className="text-orange-500" />
                        }
                        title="Aadhar Number"
                        value={formatAadhar(profileData.adharno)}
                        verified
                      />

                      <InfoCard
                        icon={
                          <FileText size={18} className="text-violet-500" />
                        }
                        title="PAN Number"
                        value={profileData.panno}
                        verified
                      />
                    </div>
                  </div>

                  {/* ZONE DETAILS */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 rounded-full bg-green-700" />

                      <h3 className="text-lg font-bold text-gray-800">
                        Zone Details
                      </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs font-medium">
                            Current Zone
                          </p>

                          <h4 className="text-base font-bold text-gray-800 mt-1 capitalize">
                            {profileData.address || "N/A"}
                          </h4>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <RefreshCcw
                            size={18}
                            className="text-green-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button 
                    className="w-full mt-1 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl py-3 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader size={16} className="animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Edit Profile"
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};