// src/pages/stocks/BulkRequest.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  Package,
  Minus,
  Plus,
  X,
  Send,
  Building2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  FileText,
  Loader,
  ShoppingCart,
} from 'lucide-react';
import { useStockContext } from '../stocks/stockContext';
import { useBulkTransferViewModel } from '../../hooks/useBulkTransferViewModel';
import { AppHeader } from './AppHeader';

const Colors = {
  primaryGreen: '#14532D',
  greenSoft: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  bg: '#F4F6F9',
  error: '#DC2626',
  errorSoft: '#FEF2F2',
  info: '#2563EB',
  infoSoft: '#EFF6FF',
  warn: '#F59E0B',
  warnSoft: '#FFFBEB',
};

export const BulkRequest = () => {
  const stockVM = useStockContext(); // ✅ Use context
  const transferVM = useBulkTransferViewModel();

  const [transferType, setTransferType] = useState('admin'); // 'admin' | 'hub'
  const [selectedHub, setSelectedHub] = useState('');
  const [note, setNote] = useState('');
  const [qtyMap, setQtyMap] = useState({}); // { variantId: qty }
  const [variantErrors, setVariantErrors] = useState({}); // { variantId: errorMsg }
  const noteRef = useRef(null);

  const selectedProducts = stockVM.selectedProducts;

  useEffect(() => {
    transferVM.fetchHubs();
  }, []);

  // Parse helpers
  const parseStock = (val) => parseInt(val || 0);

  // ✅ Helper function to get variant stock
  const getVariantStock = (productId, variantId) => {
    const product = selectedProducts.find(p =>
      String(p.product_id || p.productId) === String(productId)
    );
    if (!product) return 0;
    const variant = (product.variants || []).find(v =>
      String(v.variant_id || v.variantId) === String(variantId)
    );
    return parseInt(variant?.stock || 0);
  };

  // Get qty for variant
  const getQty = (variantId) => qtyMap[String(variantId)] || 0;

  // Set qty for variant
  // ✅ Updated setQty with stock validation
  const setQty = (variantId, productId, qty) => {
    const id = String(variantId);
    const available = getVariantStock(productId, variantId);

    // Don't allow negative
    let newQty = Math.max(0, qty);

    // ✅ For Hub Transfer: Don't allow more than available stock
    if (transferType === 'hub' && newQty > available) {
      newQty = available;
      toast.error(`Only ${available} items available in stock`);
    }

    setQtyMap(prev => ({ ...prev, [id]: newQty }));

    // Clear or set error
    if (transferType === 'hub' && newQty >= available && available > 0) {
      setVariantErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // ✅ Updated increment with stock check
  const incrementQty = (variantId, productId) => {
    const current = getQty(variantId);
    const available = getVariantStock(productId, variantId);

    if (transferType === 'hub' && current >= available) {
      toast.error(`Maximum available stock is ${available}`);
      return;
    }

    setQty(variantId, productId, current + 1);
  };

  // ✅ Updated decrement
  const decrementQty = (variantId, productId) => {
    const current = getQty(variantId);
    if (current > 0) {
      setQty(variantId, productId, current - 1);
    }
  };

  // Check if any error exists
  const hasStockError = Object.keys(variantErrors).length > 0;
  const isHubMissing = transferType === 'hub' && !selectedHub;

  // Get summary lines
  const summaryLines = [];
  selectedProducts.forEach(product => {
    (product.variants || []).forEach(variant => {
      const qty = getQty(variant.variant_id || variant.variantId);
      if (qty > 0) {
        summaryLines.push({
          name: `${product.name || product.product_name} · ${variant.value || variant.variant_value}`,
          qty,
          hasError: !!variantErrors[String(variant.variant_id || variant.variantId)],
        });
      }
    });
  });

  // Submit
  const handleSubmit = async () => {
    if (isHubMissing) {
      toast.error('Please select a hub first');
      return;
    }

    const items = [];
    selectedProducts.forEach(product => {
      (product.variants || []).forEach(variant => {
        const qty = getQty(variant.variant_id || variant.variantId);
        if (qty > 0) {
          if (transferType === 'admin') {
            items.push({
              productid: product.product_id || product.productId,
              qty: qty,
            });
          } else {
            items.push({
              productid: product.product_id || product.productId,
              variantid: variant.variant_id || variant.variantId,
              qty: qty,
            });
          }
        }
      });
    });

    if (items.length === 0) {
      toast.error('Please set quantity for at least one variant');
      return;
    }

    let success = false;
    if (transferType === 'admin') {
      success = await transferVM.submitAdminRequest(items, note);
    } else {
      // Hub transfer - validate stock
      for (const product of selectedProducts) {
        for (const variant of (product.variants || [])) {
          const qty = getQty(variant.variant_id || variant.variantId);
          const available = parseStock(variant.stock);
          if (qty > available) {
            toast.error(`${product.name} (${variant.value}) quantity exceeds stock. Available: ${available}`);
            return;
          }
        }
      }
      success = await transferVM.submitHubTransfer(selectedHub, items, note);
    }

    if (success) {
      stockVM.clearProductSelection();
      setQtyMap({});
      setVariantErrors({});
      setNote('');
      setSelectedHub('');
    }
  };

  // Empty state
  if (selectedProducts.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <AppHeader title="Stock Transfer" subtitle="Admin request or Hub transfer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto mb-5">
              <Package size={36} className="text-green-800" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">No products selected</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Go to Stock Overview, select products, and then create a transfer request here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Stock Transfer" subtitle="Admin request or Hub transfer" />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Products with qty */}
        <div className="w-[55%] flex flex-col border-r border-gray-200">
          {/* Header */}
          <div className="px-4 py-2.5 bg-green-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-800" />
              <span className="text-green-800 font-semibold text-sm">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={() => {
                stockVM.clearProductSelection();
                setQtyMap({});
                setVariantErrors({});
              }}
              className="flex items-center gap-1 text-red-500 text-xs font-semibold hover:text-red-700"
            >
              <X size={14} />
              Clear All
            </button>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-3.5">
            <div className="space-y-3">
              {selectedProducts.map((product) => {
                const productId = product.product_id || product.productId;
                return (
                  <div key={productId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Product Header */}
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden shrink-0">
                        {(product.img || product.product_img) ? (
                          <img src={product.img || product.product_img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} className="text-green-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {product.name || product.product_name || 'Unnamed'}
                        </p>
                        {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
                      </div>
                      <span className="px-2 py-0.5 bg-green-50 text-green-800 rounded-full text-xs font-bold">
                        {(product.variants || []).length} variant{(product.variants || []).length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Variants */}
                    <div className="border-t border-gray-100">
                      {(product.variants || []).map((variant) => {
                        const vId = String(variant.variant_id || variant.variantId);
                        const pId = String(product.product_id || product.productId);
                        const stock = parseStock(variant.stock);
                        const qty = getQty(vId);
                        const error = variantErrors[vId];
                        const isMaxReached = transferType === 'hub' && qty >= stock && stock > 0;

                        return (
                          <div
                            key={vId}
                            className={`mx-2.5 my-1.5 p-2.5 rounded-lg border transition-all ${error ? 'bg-red-50/50 border-red-200' : 'bg-gray-50 border-gray-200'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800">
                                  {variant.value || variant.variant_value || 'Default'}
                                </p>
                                <span
                                  className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-bold ${stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                  Stock: {stock}
                                </span>
                              </div>

                              {/* Qty Stepper */}
                              <div className={`flex items-center rounded-lg border ${error ? 'border-red-300' : 'border-gray-300'}`}>
                                <button
                                  onClick={() => decrementQty(vId, pId)} // ✅ Pass productId
                                  className="w-8 h-8 flex items-center justify-center rounded-l-lg bg-green-50 hover:bg-green-100 disabled:opacity-50"
                                  disabled={qty <= 0}
                                >
                                  <Minus size={14} className="text-green-800" />
                                </button>
                                <input
                                  type="number"
                                  value={qty}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    if (transferType === 'hub' && val > stock) {
                                      toast.error(`Maximum available stock is ${stock}`);
                                      setQty(vId, pId, stock); // Set to max available
                                    } else {
                                      setQty(vId, pId, val);
                                    }
                                  }}
                                  className={`w-11 h-8 text-center text-sm font-bold border-x border-gray-300 outline-none ${error ? 'text-red-600' : 'text-gray-800'
                                    }`}
                                  min="0"
                                  max={transferType === 'hub' ? stock : undefined} // ✅ Set max for hub transfer
                                />
                                <button
                                  onClick={() => incrementQty(vId, pId)} // ✅ Pass productId
                                  className={`w-8 h-8 flex items-center justify-center rounded-r-lg bg-green-50 hover:bg-green-100 disabled:opacity-50 ${isMaxReached ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  disabled={isMaxReached} // ✅ Disable when max reached
                                >
                                  <Plus size={14} className="text-green-800" />
                                </button>
                              </div>
                            </div>

                            {/* Max stock warning */}
                            {isMaxReached && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <AlertTriangle size={13} className="text-orange-500" />
                                <span className="text-xs font-semibold text-orange-500">
                                  Maximum available stock reached ({stock} items)
                                </span>
                              </div>
                            )}

                            {/* Error message */}
                            {error && !isMaxReached && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <AlertTriangle size={13} className="text-red-500" />
                                <span className="text-xs font-semibold text-red-500">{error}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Config + Submit */}
        <div className="w-[45%] flex flex-col">
          <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100">
            <span className="text-blue-700 font-extrabold text-sm">⚙️ Transfer Config</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5">
            {/* Transfer Type Toggle */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transfer Type</p>
            <div className="bg-gray-100 rounded-xl p-1 flex border border-gray-200">
              <button
                onClick={() => {
                  setTransferType('admin');
                  setVariantErrors({});
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${transferType === 'admin' ? 'bg-white shadow text-green-800' : 'text-gray-500'
                  }`}
              >
                <Send size={15} />
                Admin Request
              </button>
              <button
                onClick={() => setTransferType('hub')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${transferType === 'hub' ? 'bg-white shadow text-blue-700' : 'text-gray-500'
                  }`}
              >
                <Building2 size={15} />
                Hub Transfer
              </button>
            </div>

            {/* Hub Dropdown */}
            {transferType === 'hub' && (
              <>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Select Hub</p>
                <div className="relative">
                  <select
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-semibold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">
                      {transferVM.isLoadingHubs ? 'Loading hubs...' : 'Select a hub'}
                    </option>
                    {transferVM.hubs.map((hub) => (
                      <option key={hub.hub_id || hub.hubId || hub.id} value={String(hub.hub_id || hub.hubId || hub.id)}>
                        {hub.hub_name || hub.hubName || hub.name || 'Unnamed Hub'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </>
            )}

            {/* Stock Error Banner */}
            {hasStockError && transferType === 'hub' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-red-600">Stock limit exceeded</p>
                  <p className="text-xs text-red-500 mt-0.5">
                    {Object.keys(variantErrors).length} variant(s) have quantity greater than available stock.
                  </p>
                </div>
              </div>
            )}

            {/* Note */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Note (optional)</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:ring-2 focus:ring-green-200 resize-none"
            />

            {/* Summary */}
            {summaryLines.length > 0 && (
              <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-3 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileText size={15} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Order Summary</span>
                  </div>
                  <span className="text-xs text-gray-400">{summaryLines.length} item{summaryLines.length > 1 ? 's' : ''}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {summaryLines.map((line, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-2">
                      {line.hasError ? (
                        <AlertTriangle size={13} className="text-red-500" />
                      ) : (
                        <CheckCircle size={13} className="text-green-600" />
                      )}
                      <span className={`flex-1 text-xs truncate ${line.hasError ? 'text-red-600' : 'text-gray-700'}`}>
                        {line.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${line.hasError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                        }`}>
                        ×{line.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Footer */}
          <div className="bg-white border-t border-gray-200 px-3.5 py-3 shadow-md">
            {/* Disabled reason */}
            {(isHubMissing || hasStockError) && (
              <div className="mb-3 p-2.5 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-500 shrink-0" />
                <span className="text-xs font-semibold text-orange-600">
                  {isHubMissing ? 'Please select a hub first' : 'Some variants exceed stock limit'}
                </span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isHubMissing || hasStockError || transferVM.isSubmitting}
              className={`w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${isHubMissing || hasStockError
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : transferType === 'hub'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-800 text-white hover:bg-green-900'
                }`}
            >
              {transferVM.isSubmitting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <>
                  {transferType === 'hub' ? <Building2 size={18} /> : <Send size={18} />}
                  {transferType === 'hub' ? 'Transfer to Hub' : 'Send Admin Request'}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};