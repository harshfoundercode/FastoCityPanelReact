// src/pages/UrgentAddOnScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ShoppingCart,
    Plus,
    Minus,
    X,
    CheckCircle,
    Loader,
    ChevronRight,
    Box,
    Tag,
    Image as ImageIcon,
} from 'lucide-react';
import { useUrgentAddOnViewModel } from '../hooks/useUrgentAddOnViewModel';

const Colors = {
    primaryGreen: '#14532D',
    primaryLightGreen: '#4ADE80',
    primaryExtraLightGreen: '#F0FDF4',
    honey: '#D97706',
    textBlack: '#1F2937',
    textGrey1: '#6B7280',
    containerGrey2: '#F3F4F6',
    white: '#FFFFFF',
    borderColor: '#E5E7EB',
};

// Cart Item class
class CartItem {
    constructor(product, variant, qty = 1) {
        this.product = product;
        this.variant = variant;
        this.qty = qty;
    }

    get unitPrice() {
        return parseFloat(this.variant.discount_price || this.variant.price || 0);
    }

    get total() {
        return this.unitPrice * this.qty;
    }
}

export const UrgentAddOnScreen = () => {
    const { mainCategories, categoryData, isLoading, isSubmitting, fetchMainCategories, fetchCategoriesByMainCat, submitAddOnRequest } = useUrgentAddOnViewModel();

    // Selection state
    const [selectedMain, setSelectedMain] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    // Load main categories on mount
    useEffect(() => {
        fetchMainCategories();
    }, [fetchMainCategories]);

    // Handlers
    const handleMainCatClick = (mainCat) => {
        setSelectedMain(mainCat);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setSelectedProduct(null);
        setSelectedVariant(null);
        fetchCategoriesByMainCat(mainCat.id);
    };

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setSelectedSubCategory(null);
        setSelectedProduct(null);
        setSelectedVariant(null);
    };

    const handleSubCategoryClick = (sub) => {
        setSelectedSubCategory(sub);
        setSelectedProduct(null);
        setSelectedVariant(null);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(null);
    };

    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
    };

    const changeQty = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(9999, prev + delta)));
    };

    const addToCart = () => {
        if (!selectedProduct || !selectedVariant) return;

        setCart(prev => {
            const existing = prev.find(
                c => c.product.product_id === selectedProduct.product_id &&
                    c.variant.variant_id === selectedVariant.variant_id
            );

            if (existing) {
                return prev.map(c =>
                    c === existing ? { ...c, qty: c.qty + quantity } : c
                );
            }

            return [...prev, new CartItem(selectedProduct, selectedVariant, quantity)];
        });

        setSelectedProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const changeCartQty = (index, delta) => {
        setCart(prev => {
            const newCart = [...prev];
            newCart[index] = { ...newCart[index], qty: newCart[index].qty + delta };
            if (newCart[index].qty <= 0) {
                return newCart.filter((_, i) => i !== index);
            }
            return newCart;
        });
    };

    const confirmOrder = () => {
        if (cart.length === 0) return;
        const items = cart.map(c => ({
            productid: c.product.product_id,
            qty: c.qty,
        }));
        submitAddOnRequest(items).then(success => {
            if (success) setCart([]);
        });
    };

    // Get all categories from categoryData
    const allCategories = categoryData?.flatMap(d => d.categories || []) || [];

    return (
        <div className="flex flex-col h-screen bg-gray-50">


            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL - Product Selection */}
                <div className="flex-55 flex flex-col overflow-hidden">
                    <div className="px-3 py-2.5 bg-amber-50/60 border-b border-amber-100">
                        <span className="text-amber-700 font-bold text-sm">🔍 Select Product</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Step 1: Main Category */}
                        <StepBlock step={1} label="Main Category">
                            {isLoading && !mainCategories.length ? (
                                <Loader size={22} className="animate-spin mx-auto text-green-800" />
                            ) : mainCategories.length === 0 ? (
                                <p className="text-gray-500 text-sm">No main categories found</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {mainCategories.map((mc) => (
                                        <motion.button
                                            key={mc.id}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleMainCatClick(mc)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${selectedMain?.id === mc.id
                                                ? 'bg-green-50 border-green-800 text-green-800'
                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {mc.img ? (
                                                <img src={mc.img} alt="" className="w-6 h-6 rounded object-cover" />
                                            ) : (
                                                <Box size={18} />
                                            )}
                                            <span className="truncate text-xs">{mc.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </StepBlock>

                        {/* Step 2: Category */}
                        {selectedMain && (
                            <>
                                <Connector />
                                <StepBlock step={2} label="Category" hint={selectedMain.name}>
                                    {allCategories.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No categories found</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {allCategories.map((cat) => (
                                                <motion.button
                                                    key={cat.category_id}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleCategoryClick(cat)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${selectedCategory?.category_id === cat.category_id
                                                        ? 'bg-amber-500 text-white border-amber-500'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {cat.category_img ? (
                                                        <img
                                                            src={cat.category_img}
                                                            alt=""
                                                            className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <Box size={14} className="flex-shrink-0" />
                                                    )}
                                                    <span className="truncate max-w-[120px]">{cat.category_name}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </StepBlock>
                            </>
                        )}

                        {/* Step 3: Sub Category */}
                        {selectedCategory && (
                            <>
                                <Connector />
                                <StepBlock step={3} label="Sub Category" hint={selectedCategory.category_name}>
                                    {!selectedCategory.subcategories?.length ? (
                                        <p className="text-gray-500 text-sm">No sub-categories found</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCategory.subcategories.map((sub) => (
                                                <motion.button
                                                    key={sub.subcat_id}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleSubCategoryClick(sub)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${selectedSubCategory?.subcat_id === sub.subcat_id
                                                        ? 'bg-amber-500 text-white border-amber-500'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {sub.subcat_img ? (
                                                        <img
                                                            src={sub.subcat_img}
                                                            alt=""
                                                            className="w-5 h-5 rounded-full object-cover shrink-0"
                                                        />
                                                    ) : (
                                                        <Box size={14} className="shrink-0" />
                                                    )}
                                                    <span className="truncate max-w-30">{sub.subcat_name}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </StepBlock>
                            </>
                        )}

                        {/* Step 4: Product */}
                        {selectedSubCategory && (
                            <>
                                <Connector />
                                <StepBlock step={4} label="Product" hint={selectedSubCategory.subcat_name}>
                                    {!selectedSubCategory.products?.length ? (
                                        <p className="text-gray-500 text-sm">No products found</p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedSubCategory.products.map((product) => (
                                                <motion.button
                                                    key={product.product_id}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleProductClick(product)}
                                                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${selectedProduct?.product_id === product.product_id
                                                        ? 'bg-green-50 border-green-800'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {product.product_img ? (
                                                        <img src={product.product_img} alt="" className="w-9 h-9 rounded object-cover" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center">
                                                            <Package size={18} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-bold truncate ${selectedProduct?.product_id === product.product_id ? 'text-green-800' : 'text-gray-800'}`}>
                                                            {product.product_name}
                                                        </p>
                                                        {product.brand_name && (
                                                            <p className="text-xs text-gray-400 truncate">{product.brand_name}</p>
                                                        )}
                                                        <p className="text-xs text-gray-400">
                                                            {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    {selectedProduct?.product_id === product.product_id && (
                                                        <CheckCircle size={16} className="text-green-800" />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </StepBlock>
                            </>
                        )}

                        {/* Step 5: Variant & Qty */}
                        {selectedProduct && (
                            <>
                                <Connector />
                                <StepBlock step={5} label="Variant & Qty" hint={selectedProduct.product_name}>
                                    <div className="space-y-3">
                                        {/* Variants */}
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Variant</p>
                                            {!selectedProduct.variants?.length ? (
                                                <p className="text-gray-500 text-sm">No variants available</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProduct.variants.map((v) => {
                                                        const price = parseFloat(v.price || 0);
                                                        const dPrice = v.discount_price ? parseFloat(v.discount_price) : null;
                                                        const isSelected = selectedVariant?.variant_id === v.variant_id;

                                                        return (
                                                            <motion.button
                                                                key={v.variant_id}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleVariantClick(v)}
                                                                className={`px-3 py-2 rounded-lg border text-center transition-all ${isSelected
                                                                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                <p className="text-sm font-extrabold">{v.variant_value}</p>
                                                                <div className="mt-1">
                                                                    {dPrice && dPrice < price ? (
                                                                        <div className="flex items-center gap-1 justify-center">
                                                                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-green-800'}`}>
                                                                                ₹{dPrice.toFixed(0)}
                                                                            </span>
                                                                            <span className={`text-xs line-through ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                                                                                ₹{price.toFixed(0)}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className={`text-xs font-semibold ${isSelected ? 'text-white/80' : 'text-green-800'}`}>
                                                                            ₹{price.toFixed(0)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Qty & Add to Cart */}
                                        {selectedVariant && (
                                            <>
                                                <div className="border-t border-gray-200 pt-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</span>
                                                        <QtyControl qty={quantity} onChange={changeQty} />
                                                    </div>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={addToCart}
                                                    className="w-full py-3 rounded-xl bg-green-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-green-900 transition-colors"
                                                >
                                                    <ShoppingCart size={18} />
                                                    Add to Cart
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                </StepBlock>
                            </>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-200" />

                {/* RIGHT PANEL - Cart */}
                <div className="flex-[45] flex flex-col overflow-hidden">
                    <div className="px-4 py-2.5 bg-amber-50/60 border-b border-amber-100">
                        <span className="text-amber-700 font-bold text-sm">
                            🛒 Request Cart ({cart.length})
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <span className="text-5xl mb-3">🛒</span>
                                <p className="font-bold text-gray-700">Cart is empty</p>
                                <p className="text-sm text-gray-500 mt-1">Select products from the left panel</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={`${item.product.product_id}-${item.variant.variant_id}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                {item.product.product_img ? (
                                                    <img src={item.product.product_img} alt="" className="w-11 h-11 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Package size={22} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{item.product.product_name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                                                            {item.variant.variant_value}
                                                        </span>
                                                        {item.product.brand_name && (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-bold">
                                                                {item.product.brand_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <QtyControl qty={item.qty} onChange={(d) => changeCartQty(index, d)} small />
                                                    </div>
                                                </div>
                                                <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Cart Footer */}
                    <div className="bg-white border-t border-gray-200 px-4 py-3">
                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-gray-500">Items</span>
                            <span className="font-bold text-gray-800">{cart.length}</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={confirmOrder}
                            disabled={cart.length === 0 || isSubmitting}
                            className={`w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${cart.length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-amber-500 text-white shadow-md hover:bg-amber-600'
                                }`}
                        >
                            {isSubmitting ? (
                                <Loader size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Confirm Order
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Step Block Component
const StepBlock = ({ step, label, hint, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-5 h-5 rounded-full bg-green-800 text-white text-xs font-extrabold flex items-center justify-center">
                {step}
            </span>
            <span className="text-sm font-bold text-gray-800">{label}</span>
            {hint && (
                <span className="text-xs text-gray-500 truncate">· {hint}</span>
            )}
        </div>
        <div className="p-3">{children}</div>
    </div>
);

// Connector Component
const Connector = () => (
    <div className="flex justify-center py-1">
        <div className="w-0.5 h-3 bg-gray-300" />
    </div>
);

// Quantity Control Component
const QtyControl = ({ qty, onChange, small }) => (
    <div className={`flex items-center border border-gray-200 rounded-lg overflow-hidden ${small ? 'h-7' : 'h-9'}`}>
        <button
            onClick={() => onChange(-1)}
            className={`${small ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center hover:bg-gray-100 text-red-400`}
        >
            <Minus size={small ? 14 : 16} />
        </button>
        <div className={`${small ? 'w-8 h-7 text-sm' : 'w-10 h-9 text-base'} bg-gray-50 flex items-center justify-center font-extrabold text-green-800`}>
            {qty}
        </div>
        <button
            onClick={() => onChange(1)}
            className={`${small ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center hover:bg-gray-100 text-green-600`}
        >
            <Plus size={small ? 14 : 16} />
        </button>
    </div>
);