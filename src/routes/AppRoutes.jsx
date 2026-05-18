// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';


// export const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes - Login (No Sidebar) */}
//       <Route path="/login" element={<AdminLoginScreen />} />

//       {/* All routes with Sidebar - DashboardLayout wraps everything */}
//       <Route path="/" element={<DashboardLayout />}>
//         {/* Dashboard */}
//         <Route index element={<Navigate to="/dashboard" replace />} />
//         <Route path="dashboard" element={<Dashboard />} />

//         {/* Notifications */}
//         <Route path="notifications" element={<Notifications />} />

//         {/* Hubs Routes */}
//         <Route path="hubs">
//           <Route index element={<Navigate to="/hubs/all-hubs" replace />} />
//           <Route path="all-hubs" element={<AllHubs />} />
//           {/* <Route path="add-hub-zone" element={<AddHubZone />} />
//           <Route path="add-hub-manager" element={<AddHubManager />} />
//           <Route path="hub-performance" element={<HubPerformance />} />
//           <Route path="hub-zone" element={<HubZone />} /> */}
//         </Route>


//       </Route>

//       {/* Catch all - redirect to dashboard */}
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// };


// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginScreen } from '../pages/LoginPage';
import { DashboardLayout } from '../components/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Notifications } from '../pages/Notifications';
import { AllHubs } from '../pages/hub/AllHub';
import { HubDetails } from '../pages/hub/HubDetails';
import AddHubScreen from '../pages/hub/AddHubZone';
import { AddHubManager } from '../pages/hub/AddHubManager';
import { HubPerformance } from '../pages/hub/HubPerformance';
import { HubOrders } from '../pages/hub/AllHubOrder';
import { OrderDetails } from '../pages/hub/OrdersDetailsScreen';
import { Orders } from '../pages/OrdersScreen';
import { OrderProfileDetails } from '../pages/OrderProfileScreen';
import { UrgentAddOnScreen } from '../pages/UrgentAddOnScreen';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route - Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AdminLoginScreen />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        //=============== NOTIFICATION SECTIONS =====================

        <Route path="notifications" element={<Notifications />} />

        //=============== HUB SECTIONS =====================

        {/* Hubs Routes */}
        <Route path="hubs">
          <Route index element={<Navigate to="/hubs/all-hubs" replace />} />
          <Route path="all-hubs" element={<AllHubs />} />
          <Route path="details/:hubId" element={<HubDetails />} />
          <Route path="/hubs/add-hub-zone" element={<AddHubScreen />} />
          <Route path="/hubs/add-hub-manager" element={<AddHubManager />} />
          <Route path="/hubs/hub-performance" element={<HubPerformance />} />
          <Route path="orders/:hubId" element={<HubOrders />} />


        </Route>
        <Route path="orders/:orderId" element={<OrderDetails />} />

        //=============== order section separate =====================
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId/profile" element={<OrderProfileDetails />} />

         //=============== urgent add on =====================
        <Route path="inventory-addon" element={<UrgentAddOnScreen />} />


      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};