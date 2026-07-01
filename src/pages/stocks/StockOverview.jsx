// // src/pages/stocks/StockOverview.jsx
// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   RefreshCw,
//   AlertTriangle,
//   Package,
//   Loader,
// } from 'lucide-react';
// import { useStockContext } from '../stocks/stockContext';
// import { CategoryTree } from './CategoryTree';
// import { ProductListPanel } from './ProductListPanel';
// import { StatsBar } from './StatsBar';
// import { AppHeader } from './AppHeader';

// export const StockOverview = () => {
//    const stockVM = useStockContext(); 

//   useEffect(() => {
//     stockVM.fetchStockData();
//   }, []);

//   return (
//     <div className="flex flex-col h-143">
//       {/* Header */}
//       <AppHeader
//         title="Stock Overview"
//         subtitle="Manage your inventory"
//         actions={
//           <button
//             onClick={() => stockVM.fetchStockData()}
//             className="p-2 rounded-lg hover:bg-gray-100"
//             title="Refresh"
//           >
//             <RefreshCw size={20} className="text-gray-500" />
//           </button>
//         }
//       />

//       {/* Stats Bar */}
//       {!stockVM.isLoading && !stockVM.error && (
//         <StatsBar stats={stockVM.stats} />
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Loading */}
//         {stockVM.isLoading && (
//           <div className="flex-1 flex items-center justify-center">
//             <Loader size={32} className="animate-spin text-green-800" />
//           </div>
//         )}

//         {/* Error */}
//         {stockVM.error && (
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <AlertTriangle size={48} className="text-red-500 mb-4" />
//             <p className="text-red-500 text-sm mb-4">{stockVM.error}</p>
//             <button
//               onClick={() => stockVM.fetchStockData()}
//               className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
//             >
//               <RefreshCw size={16} />
//               Retry
//             </button>
//           </div>
//         )}

//         {/* No Data */}
//         {!stockVM.isLoading && !stockVM.error && stockVM.mainCategories.length === 0 && (
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <Package size={48} className="text-gray-300 mb-4" />
//             <p className="text-gray-500 text-sm">No stock data available</p>
//           </div>
//         )}

//         {/* Content */}
//         {!stockVM.isLoading && !stockVM.error && stockVM.mainCategories.length > 0 && (
//           <>
//             {/* Left Panel - Category Tree */}
//             <div className="w-70 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
//               <CategoryTree />
//             </div>

//             {/* Right Panel - Product List */}
//             <div className="flex-1 overflow-auto">
//               <ProductListPanel />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
// src/pages/stocks/StockOverview.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  AlertTriangle,
  Package,
  Loader,
} from 'lucide-react';
import { useStockContext } from '../stocks/stockContext';
import { CategoryTree } from './CategoryTree';
import { ProductListPanel } from './ProductListPanel';
import { StatsBar } from './StatsBar';
import { AppHeader } from './AppHeader';

export const StockOverview = () => {
  const stockVM = useStockContext(); 

  useEffect(() => {
    stockVM.fetchStockData();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <AppHeader
        title="Stock Overview"
        subtitle="Manage your inventory"
        actions={
          <button
            onClick={() => stockVM.fetchStockData()}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Refresh"
          >
            <RefreshCw size={20} className="text-gray-500" />
          </button>
        }
      />

      {/* Stats Bar */}
      {!stockVM.isLoading && !stockVM.error && (
        <StatsBar stats={stockVM.stats} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {stockVM.isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader size={32} className="animate-spin text-green-800" />
          </div>
        )}

        {stockVM.error && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <p className="text-red-500 text-sm mb-4">{stockVM.error}</p>
            <button
              onClick={() => stockVM.fetchStockData()}
              className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {!stockVM.isLoading && !stockVM.error && stockVM.mainCategories.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">No stock data available</p>
          </div>
        )}

        {!stockVM.isLoading && !stockVM.error && stockVM.mainCategories.length > 0 && (
          <>
            <div className="w-70 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
              <CategoryTree />
            </div>

            <div className="flex-1 overflow-auto">
              <ProductListPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
};