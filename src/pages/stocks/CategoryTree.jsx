// src/pages/stocks/components/CategoryTree.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Package,
  X,
  Folder,
} from 'lucide-react';
import { useStockContext } from '../stocks/stockContext';

export const CategoryTree = () => { 
  const stockVM = useStockContext();
  
  const [expandedMain, setExpandedMain] = useState(new Set());
  const [expandedCat, setExpandedCat] = useState(new Set());

  const toggleMain = (index) => {
    setExpandedMain(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleCat = (index) => {
    setExpandedCat(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3.5 py-3.5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Folder size={15} className="text-green-800" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</span>
        </div>
        {stockVM.selectedMainIndex !== null && (
          <button onClick={stockVM.resetSelection} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* All Products */}
      <TreeItem
        icon={<Package size={18} />}
        label="All Products"
        selected={stockVM.selectedMainIndex === null}
        onClick={stockVM.resetSelection}
        badge={stockVM.stats.totalProducts}
        indent={0}
      />

      {/* Main Categories */}
      <div className="flex-1 overflow-y-auto">
        {stockVM.mainCategories.map((mainCat, index) => (
          <div key={index}>
            <TreeItem
              imageUrl={mainCat.main_category_img || mainCat.mainCategoryImg}
              label={mainCat.main_category_name || mainCat.mainCategoryName || 'Unnamed'}
              selected={stockVM.selectedMainIndex === index && stockVM.selectedCategoryIndex === null}
              onClick={() => {
                toggleMain(index);
                stockVM.selectMainCategory(index);
              }}
              badge={mainCat.categories?.length || 0}
              indent={8}
              trailing={
                <motion.div animate={{ rotate: expandedMain.has(index) ? 180 : 0 }}>
                  <ChevronDown size={16} className="text-gray-400" />
                </motion.div>
              }
            />

            {/* Categories */}
            <AnimatePresence>
              {expandedMain.has(index) && mainCat.categories?.map((cat, catIdx) => (
                <div key={catIdx}>
                  <TreeItem
                    imageUrl={cat.category_img || cat.categoryImg}
                    label={cat.category_name || cat.categoryName || 'Unnamed'}
                    selected={
                      stockVM.selectedMainIndex === index &&
                      stockVM.selectedCategoryIndex === catIdx &&
                      stockVM.selectedSubCategoryIndex === null
                    }
                    onClick={() => {
                      toggleCat(catIdx);
                      stockVM.selectCategory(catIdx);
                    }}
                    badge={cat.subcategories?.length || 0}
                    indent={28}
                    trailing={
                      <motion.div animate={{ rotate: expandedCat.has(catIdx) ? 180 : 0 }}>
                        <ChevronDown size={14} className="text-gray-400" />
                      </motion.div>
                    }
                  />

                  {/* Subcategories */}
                  <AnimatePresence>
                    {expandedCat.has(catIdx) && cat.subcategories?.map((subCat, subIdx) => (
                      <TreeItem
                        key={subIdx}
                        imageUrl={subCat.subcategory_img || subCat.subcatImg}
                        label={subCat.subcategory_name || subCat.subcatName || 'Unnamed'}
                        selected={
                          stockVM.selectedMainIndex === index &&
                          stockVM.selectedCategoryIndex === catIdx &&
                          stockVM.selectedSubCategoryIndex === subIdx
                        }
                        onClick={() => {
                          stockVM.selectMainCategory(index);
                          stockVM.selectCategory(catIdx);
                          stockVM.selectSubCategory(subIdx);
                        }}
                        badge={subCat.products?.length || 0}
                        indent={48}
                        showDot
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const TreeItem = ({ imageUrl, icon, label, selected, onClick, badge, indent, trailing, showDot }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all text-left ${
      selected ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
    }`}
    style={{ marginLeft: indent, marginRight: 8, marginTop: 2, marginBottom: 2, width: `calc(100% - ${indent + 8}px)` }}
  >
    {showDot ? (
      <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-green-800' : 'bg-gray-300'}`} />
    ) : icon ? (
      <span className={selected ? 'text-green-800' : 'text-gray-400'}>{icon}</span>
    ) : imageUrl ? (
      <img src={imageUrl} alt="" className="w-5 h-5 rounded object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
    ) : (
      <div className="w-5 h-5" />
    )}
    <span className={`flex-1 text-sm truncate ${selected ? 'font-bold text-green-800' : 'text-gray-600'}`}>
      {label}
    </span>
    {badge !== undefined && (
      <span className={`px-1.5 py-0.5 rounded-lg text-xs font-semibold ${
        selected ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'
      }`}>
        {badge}
      </span>
    )}
    {trailing}
  </motion.button>
);