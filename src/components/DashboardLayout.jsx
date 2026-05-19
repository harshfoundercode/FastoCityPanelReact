import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; // Make sure Outlet is imported
import {
  LayoutDashboard,
  Bell,
  Package,
  ShoppingCart,
  PlusCircle,
  Boxes,
  ClipboardList,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  MapPin,
  BarChart3,
  Users,
  Menu,
  X,
} from 'lucide-react';
import AppLogo from '../assets/app_logo.png';
import { PremiumBg } from '../components/PremiumBg';
import toast from 'react-hot-toast';
import { ProfileDrawer } from '../pages/ProfileDrawer'; // Import ProfileDrawer


// Move Colors outside component
const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  sidebarBg: '#F8FAFC',
  sidebarHover: '#E2E8F0',
  activeItem: '#14532D',
  activeItemBg: '#DCFCE7',
  white: '#FFFFFF',
};

// Move menuItems outside component
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/dashboard',
    isExpandable: false,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell size={20} />,
    path: '/notifications',
    isExpandable: false,
  },
  {
    id: 'hubs',
    label: 'Hubs',
    icon: <MapPin size={20} />,
    isExpandable: true,
    path: '/hubs',
    subItems: [
      { id: 'all-hubs', label: 'All Hubs', path: '/hubs/all-hubs', icon: <Package size={18} /> },
      { id: 'add-hub-zone', label: 'Add Hub Zone', path: '/hubs/add-hub-zone', icon: <PlusCircle size={18} /> },
      { id: 'add-hub-manager', label: 'Add Hub Manager', path: '/hubs/add-hub-manager', icon: <Users size={18} /> },
      { id: 'hub-performance', label: 'Hub Performance', path: '/hubs/hub-performance', icon: <BarChart3 size={18} /> },
      { id: 'hub-zone', label: 'Hub Zone', path: '/hubs/hub-zone', icon: <MapPin size={18} /> },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCart size={20} />,
    path: '/orders',
    isExpandable: false,
  },
  {
    id: 'inventory-addon',
    label: 'Inventory Add On',
    icon: <PlusCircle size={20} />,
    path: '/inventory-addon',
    isExpandable: false,
  },
  {
    id: 'city-stocks',
    label: 'City Stocks',
    icon: <Boxes size={20} />,
    path: '/city-stocks',
    isExpandable: false,
  },
  {
    id: 'hub-inventory-request',
    label: 'Hub Inventory Request',
    icon: <ClipboardList size={20} />,
    path: '/hub-inventory-request',
    isExpandable: false,
  },
];

// Separate SidebarContent component with React.memo
const SidebarContent = React.memo(({ 
  expandedItems, 
  toggleExpand, 
  isActive, 
  navigate, 
  handleLogout,
  onProfileClick  
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo and Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: Colors.primaryGreen,
              borderRadius: '12px',
            }}
            className="flex items-center justify-center flex-shrink-0"
          >
            <img
              src={AppLogo}
              alt="City Panel Logo"
              className="w-10 h-10 object-contain p-1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/40x40?text=CP';
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              City Panel
            </h2>
            <p className="text-xs" style={{ color: Colors.textGrey1 }}>
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* View Profile Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onProfileClick}  // Changed from navigate to onProfileClick
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: Colors.primaryExtraLightGreen,
            color: Colors.primaryGreen,
            border: `1px solid ${Colors.primaryGreen}20`,
          }}
        >
          <User size={18} />
          <span className="text-sm font-medium">View Profile</span>
        </motion.button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item, index) => (
          <div key={item.id} className="mb-1">
            {item.isExpandable ? (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive(item.path)
                      ? Colors.activeItemBg
                      : 'transparent',
                    color: isActive(item.path)
                      ? Colors.activeItem
                      : Colors.textGrey1,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedItems[item.id] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedItems[item.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                        {item.subItems.map((subItem) => (
                          <motion.button
                            key={subItem.id}
                            whileHover={{ x: 4 }}
                            onClick={() => navigate(subItem.path)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                            style={{
                              backgroundColor: isActive(subItem.path)
                                ? Colors.activeItemBg
                                : 'transparent',
                              color: isActive(subItem.path)
                                ? Colors.activeItem
                                : Colors.textGrey1,
                              fontWeight: isActive(subItem.path) ? 600 : 400,
                            }}
                          >
                            <span className="flex-shrink-0">{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isActive(item.path)
                    ? Colors.activeItemBg
                    : 'transparent',
                  color: isActive(item.path)
                    ? Colors.activeItem
                    : Colors.textGrey1,
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </motion.button>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
          }}
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
});

export const DashboardLayout = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile drawer state

  
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize resize handler
  const handleResize = useCallback(() => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth >= 768) {
      setIsMobileSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Auto expand hubs if any sub-route is active
  useEffect(() => {
    if (location.pathname.includes('/hubs')) {
      setExpandedItems(prev => {
        if (prev.hubs) return prev;
        return { ...prev, hubs: true };
      });
    }
  }, [location.pathname]);

  // Memoize handlers
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  }, [navigate]);

  const toggleExpand = useCallback((itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  // Memoize isActive function
  const isActive = useCallback((path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Memoize sidebar width
  const sidebarWidth = useMemo(() => 280, []);

  // Memoize current page title
  const pageTitle = useMemo(() => {
    const currentItem = menuItems.find(item => isActive(item.path));
    if (currentItem) return currentItem.label;
    
    for (const item of menuItems) {
      if (item.subItems) {
        const subItem = item.subItems.find(sub => isActive(sub.path));
        if (subItem) return subItem.label;
      }
    }
    return 'Dashboard';
  }, [isActive]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">     

      {/* Desktop Sidebar - Fixed position, doesn't reload */}
      <aside 
        className="hidden md:block shrink-0 relative z-20"
        style={{ width: sidebarWidth }}
      >
        <div 
          className="fixed top-0 left-0 h-full"
          style={{ 
            width: sidebarWidth,
            backgroundColor: Colors.white,
          }}
        >
          <SidebarContent 
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            isActive={isActive}
            navigate={navigate}
            handleLogout={handleLogout}
            onProfileClick={() => setIsProfileOpen(true)} // Open profile drawer
          />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -sidebarWidth }}
              animate={{ x: 0 }}
              exit={{ x: -sidebarWidth }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 z-50 h-full md:hidden"
              style={{ width: sidebarWidth }}
            >
              <div 
                className="h-full relative"
                style={{
                  backgroundColor: Colors.white,
                  boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 z-50"
                >
                  <X size={20} />
                </button>
                <SidebarContent 
                  expandedItems={expandedItems}
                  toggleExpand={toggleExpand}
                  isActive={isActive}
                  navigate={navigate}
                  handleLogout={handleLogout}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Bar - Fixed */}
        <header
          className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex-shrink-0"
          style={{ height: 64 }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              >
                <Menu size={20} />
              </motion.button>
              
              {/* Page Title */}
              <h1 className="text-lg font-semibold" style={{ color: Colors.textBlack }}>
                {pageTitle}
              </h1>
            </div>          
          </div>
        </header>

        {/* Page Content - Only this part changes, sidebar stays fixed */}
        <main className="flex-1 overflow-auto p-3">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
        {/* Profile Drawer - Slides from right */}
      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};