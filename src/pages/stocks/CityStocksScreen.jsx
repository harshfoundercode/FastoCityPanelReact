import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ArrowLeftRight, Clock, Truck } from 'lucide-react';
import { StockProvider } from './stockContext'; 
import { StockOverview } from './StockOverview';
import { BulkRequest } from './BulkTransfer';
import { StockHistory } from './StockHistory';
import { IncomingStock } from './IncommingStocks';

// const tabs = [
//   { id: 0, label: 'Stock', icon: Package },
//   { id: 1, label: 'Transfer', icon: ArrowLeftRight },
//   { id: 2, label: 'History', icon: Clock },
//   { id: 3, label: 'Incoming', icon: Truck },
// ];

// export const CityStocksScreen = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   const screens = [
//     <StockOverview key="stock" />,
//     <BulkRequest key="transfer" />,
//     <StockHistory key="history" />,
//     <IncomingStock key="incoming" />,
//   ];

//   return (
//     <StockProvider>
//       {/* ✅ Full height flex container */}
//       <div className="h-full flex flex-col bg-[#F4F6F9]">
        
//         {/* ✅ Content area - takes remaining space, scrollable */}
//         <div className="flex-1 overflow-hidden">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.2 }}
//               className="h-full overflow-auto" 
//             >
//               {screens[activeTab]}
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* ✅ Bottom Navigation - FIXED at bottom */}
//         <div className="shrink-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
//           <div className="flex justify-around px-1 py-2 safe-area-bottom">
//             {tabs.map((tab) => {
//               const isActive = activeTab === tab.id;
//               const Icon = tab.icon;
//               return (
//                 <motion.button
//                   key={tab.id}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
//                     isActive ? 'bg-green-50' : ''
//                   }`}
//                 >
//                   <Icon
//                     size={22}
//                     className={isActive ? 'text-green-800' : 'text-gray-400'}
//                   />
//                   <span
//                     className={`text-[10px] font-semibold ${
//                       isActive ? 'text-green-800' : 'text-gray-400'
//                     }`}
//                   >
//                     {tab.label}
//                   </span>
//                 </motion.button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </StockProvider>
//   );
// };



const tabs = [
  { id: 0, label: 'Stock', icon: Package },
  { id: 1, label: 'Transfer', icon: ArrowLeftRight },
  { id: 2, label: 'History', icon: Clock },
  { id: 3, label: 'Incoming', icon: Truck },
];

export const CityStocksScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  const screens = [
    <StockOverview key="stock" />,
    <BulkRequest key="transfer" />,
    <StockHistory key="history" />,
    <IncomingStock key="incoming" />,
  ];

  return (
    <StockProvider>
      {/* ✅ min-h-full ensures it takes full height even with less content */}
      <div className="min-h-full flex flex-col bg-[#F4F6F9]">
        
        {/* ✅ Content area - flex-1 with overflow-y-auto */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {screens[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ✅ Tab Bar - hamesha bottom par */}
        <div className="shrink-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="flex justify-around px-1 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-green-50' : ''
                  }`}
                >
                  <Icon size={22} className={isActive ? 'text-green-800' : 'text-gray-400'} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-green-800' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </StockProvider>
  );
};