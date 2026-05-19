// src/pages/stocks/components/ProductListPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Check,
  ChevronDown,
  Package,
} from 'lucide-react';
import { useStockContext } from '../stocks/stockContext'; // ✅ Correct import

export const ProductListPanel = () => { // ✅ Remove prop
  const stockVM = useStockContext(); // ✅ Get from context
  
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  const toggleExpand = (productId) => {
    const id = String(productId);
    setExpandedProducts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const parseStock = (val) => parseInt(val || 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3.5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={stockVM.searchQuery}
            onChange={(e) => stockVM.setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-200"
          />
          {stockVM.searchQuery && (
            <button onClick={() => stockVM.setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="px-3.5 pb-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{stockVM.displayProducts.length} products</span>
        {stockVM.selectedProductIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-50 border border-green-200 rounded-lg text-xs font-semibold text-green-800">
              {stockVM.selectedProductIds.size} selected
            </span>
            <button onClick={stockVM.clearProductSelection} className="text-green-800">
              <X size={14} />
            </button>
          </div>
        )}
        {stockVM.selectedSubCategoryIndex !== null && stockVM.displayProducts.length > 0 && (
          <button
            onClick={stockVM.selectAllProducts}
            className="text-xs font-semibold text-green-800 flex items-center gap-1"
          >
            Select All
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-3.5">
        {stockVM.displayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Package size={48} className="mb-3 opacity-50" />
            <p className="text-sm">
              {stockVM.searchQuery ? `No products found for "${stockVM.searchQuery}"` : 'No products in this category'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {stockVM.displayProducts.map((product) => {
              const productId = String(product.product_id || product.productId);
              const totalStock = parseStock(product.totalStock || product.total_stock);
              const variants = product.variants || [];
              const isSelected = stockVM.isProductSelected(productId);
              const isExpanded = expandedProducts.has(productId);
              const statusColor = stockVM.getStockStatusColor(totalStock);
              const issuesCount = variants.filter(v => {
                const s = parseStock(v.stock || v.currentStock || v.current_stock);
                return s === 0 || s <= 5;
              }).length;

              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl border overflow-hidden ${isSelected ? 'border-green-800 shadow-md' : 'border-gray-200 shadow-sm'}`}
                >
                  {/* Product Header */}
                  <div
                    className="p-3 flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleExpand(productId)}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        stockVM.toggleProductSelection(productId);
                      }}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-green-800 border-green-800' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check size={13} className="text-white" />}
                    </button>

                    {/* Image */}
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden shrink-0">
                      {(product.img || product.productImg || product.product_img) ? (
                        <img
                          src={product.img || product.productImg || product.product_img}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Package size={18} className="text-green-800" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {product.name || product.product_name || 'Unnamed'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{variants.length} variants</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-xs font-semibold"
                          style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
                        >
                          Total: {totalStock}
                        </span>
                        {issuesCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-50 text-orange-600">
                            {issuesCount} issues
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
                    >
                      {stockVM.getStockStatusText(totalStock)}
                    </span>

                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown size={18} className="text-gray-400" />
                    </motion.div>
                  </div>

                  {/* Variants */}
                  <AnimatePresence>
                    {isExpanded && variants.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100">
                          {variants.map((variant, vIdx) => {
                            const vStock = parseStock(variant.stock || variant.currentStock || variant.current_stock);
                            const vStatusColor = stockVM.getStockStatusColor(vStock);
                            const price = parseFloat(variant.price || 0);
                            const dPrice = parseFloat(variant.discountPrice || variant.discount_price || 0);
                            const hasDiscount = dPrice > 0 && dPrice < price;

                            return (
                              <div key={vIdx} className="flex items-center px-3 py-2.5 border-b border-gray-50 last:border-0">
                                <div className="w-0.5 h-8 rounded mr-2.5" style={{ backgroundColor: vStatusColor }} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800">
                                    {variant.value || variant.variant_value || 'Default'}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {hasDiscount ? (
                                      <>
                                        <span className="text-xs text-gray-400 line-through">₹{price.toFixed(0)}</span>
                                        <span className="text-xs font-semibold text-green-800">₹{dPrice.toFixed(0)}</span>
                                      </>
                                    ) : price > 0 ? (
                                      <span className="text-xs text-gray-600">₹{price.toFixed(0)}</span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold" style={{ color: vStatusColor }}>Stock: {vStock}</p>
                                  <p className="text-xs" style={{ color: vStatusColor }}>
                                    {stockVM.getStockStatusText(vStock)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};