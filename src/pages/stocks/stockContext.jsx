// import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
// import toast from 'react-hot-toast';
// import apiClient, { ENDPOINTS } from '../../config/ApiConfig';

// const StockContext = createContext(null);

// export const useStockContext = () => {
//   const context = useContext(StockContext);
//   if (!context) throw new Error('useStockContext must be used within StockProvider');
//   return context;
// };

// export const StockProvider = ({ children }) => {
//   const [stockData, setStockData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Selection state - SHARED across tabs
//   const [selectedMainIndex, setSelectedMainIndex] = useState(null);
//   const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
//   const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(null);
//   const [selectedProductIds, setSelectedProductIds] = useState(new Set());
//   const [searchQuery, setSearchQuery] = useState('');

//   // Fetch stock data
//   const fetchStockData = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await apiClient.get(ENDPOINTS.CITY_STOCKS);
//       if (response.status === 200) {
//         setStockData(response.data?.data || response.data);
//       }
//     } catch (err) {
//       setError('Failed to fetch stock data');
//       toast.error('Failed to load stock data');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Getters
//   const mainCategories = useMemo(() => stockData?.data || stockData || [], [stockData]);

//   const selectedMainCategory = useMemo(() => {
//     if (selectedMainIndex !== null && mainCategories[selectedMainIndex]) {
//       return mainCategories[selectedMainIndex];
//     }
//     return null;
//   }, [selectedMainIndex, mainCategories]);

//   const selectedCategory = useMemo(() => {
//     if (selectedMainCategory && selectedCategoryIndex !== null) {
//       return selectedMainCategory.categories?.[selectedCategoryIndex];
//     }
//     return null;
//   }, [selectedMainCategory, selectedCategoryIndex]);

//   const selectedSubCategory = useMemo(() => {
//     if (selectedCategory && selectedSubCategoryIndex !== null) {
//       return selectedCategory.subcategories?.[selectedSubCategoryIndex];
//     }
//     return null;
//   }, [selectedCategory, selectedSubCategoryIndex]);

//   // Display products
//   const displayProducts = useMemo(() => {
//     let products = [];
//     if (selectedSubCategory) {
//       products = selectedSubCategory.products || [];
//     } else if (selectedCategory) {
//       for (const subCat of selectedCategory.subcategories || []) {
//         products.push(...(subCat.products || []));
//       }
//     } else if (selectedMainCategory) {
//       for (const cat of selectedMainCategory.categories || []) {
//         for (const subCat of cat.subcategories || []) {
//           products.push(...(subCat.products || []));
//         }
//       }
//     } else {
//       for (const mainCat of mainCategories) {
//         for (const cat of mainCat.categories || []) {
//           for (const subCat of cat.subcategories || []) {
//             products.push(...(subCat.products || []));
//           }
//         }
//       }
//     }
//     if (searchQuery) {
//       products = products.filter(p =>
//         (p.name || p.product_name || '').toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return products;
//   }, [selectedSubCategory, selectedCategory, selectedMainCategory, mainCategories, searchQuery]);

//   // Selected products (from all data, not just displayed)
//   const selectedProducts = useMemo(() => {
//     const allProducts = [];
//     for (const mainCat of mainCategories) {
//       for (const cat of mainCat.categories || []) {
//         for (const subCat of cat.subcategories || []) {
//           for (const product of subCat.products || []) {
//             const id = String(product.product_id || product.productId);
//             if (selectedProductIds.has(id)) {
//               allProducts.push(product);
//             }
//           }
//         }
//       }
//     }
//     return allProducts;
//   }, [mainCategories, selectedProductIds]);

//   // Stats
//   const stats = useMemo(() => {
//     let totalProducts = 0, totalStock = 0, lowStock = 0, outOfStock = 0, totalCategories = 0;
//     for (const mainCat of mainCategories) {
//       totalCategories += mainCat.categories?.length || 0;
//       for (const cat of mainCat.categories || []) {
//         for (const subCat of cat.subcategories || []) {
//           totalProducts += subCat.products?.length || 0;
//           for (const product of subCat.products || []) {
//             const stock = parseInt(product.totalStock || product.total_stock || 0);
//             totalStock += stock;
//             if (stock === 0) outOfStock++;
//             if (stock > 0 && stock <= 5) lowStock++;
//           }
//         }
//       }
//     }
//     return {
//       totalMainCategories: mainCategories.length,
//       totalCategories,
//       totalProducts,
//       totalStock,
//       lowStockCount: lowStock,
//       outOfStockCount: outOfStock,
//     };
//   }, [mainCategories]);

//   // Selection methods
//   const selectMainCategory = (index) => {
//     setSelectedMainIndex(index);
//     setSelectedCategoryIndex(null);
//     setSelectedSubCategoryIndex(null);
//   };

//   const selectCategory = (index) => {
//     setSelectedCategoryIndex(index);
//     setSelectedSubCategoryIndex(null);
//   };

//   const selectSubCategory = (index) => {
//     setSelectedSubCategoryIndex(index);
//   };

//   const resetSelection = () => {
//     setSelectedMainIndex(null);
//     setSelectedCategoryIndex(null);
//     setSelectedSubCategoryIndex(null);
//   };

//   const toggleProductSelection = (productId) => {
//     const id = String(productId);
//     setSelectedProductIds(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const selectAllProducts = () => {
//     const ids = new Set(displayProducts.map(p => String(p.product_id || p.productId)));
//     setSelectedProductIds(prev => {
//       const newSet = new Set(prev);
//       ids.forEach(id => newSet.add(id));
//       return newSet;
//     });
//   };

//   const clearProductSelection = () => {
//     setSelectedProductIds(new Set());
//   };

//   const isProductSelected = (productId) => selectedProductIds.has(String(productId));

//   const getStockStatusText = (stock) => {
//     const s = parseInt(stock || 0);
//     if (s === 0) return 'Out of Stock';
//     if (s <= 5) return 'Low Stock';
//     return 'In Stock';
//   };

//   const getStockStatusColor = (stock) => {
//     const s = parseInt(stock || 0);
//     if (s === 0) return '#DC2626';
//     if (s <= 5) return '#F59E0B';
//     return '#16A34A';
//   };

//   const value = {
//     stockData, isLoading, error, fetchStockData,
//     mainCategories,
//     selectedMainIndex, selectedCategoryIndex, selectedSubCategoryIndex,
//     selectedMainCategory, selectedCategory, selectedSubCategory,
//     displayProducts, selectedProductIds, selectedProducts,
//     searchQuery, stats,
//     selectMainCategory, selectCategory, selectSubCategory, resetSelection,
//     toggleProductSelection, selectAllProducts, clearProductSelection, isProductSelected,
//     setSearchQuery, getStockStatusText, getStockStatusColor,
//   };

//   return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
// };
// src/context/StockContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../../config/ApiConfig';

const StockContext = createContext(null);

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error('useStockContext must be used within StockProvider');
  return context;
};

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selection state - SHARED across tabs
  const [selectedMainIndex, setSelectedMainIndex] = useState(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.CITY_STOCKS);
      if (response.status === 200) {
        setStockData(response.data?.data || response.data);
      }
    } catch (err) {
      setError('Failed to fetch stock data');
      toast.error('Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Getters
  const mainCategories = useMemo(() => stockData?.data || stockData || [], [stockData]);

  const selectedMainCategory = useMemo(() => {
    if (selectedMainIndex !== null && mainCategories[selectedMainIndex]) {
      return mainCategories[selectedMainIndex];
    }
    return null;
  }, [selectedMainIndex, mainCategories]);

  const selectedCategory = useMemo(() => {
    if (selectedMainCategory && selectedCategoryIndex !== null) {
      return selectedMainCategory.categories?.[selectedCategoryIndex];
    }
    return null;
  }, [selectedMainCategory, selectedCategoryIndex]);

  const selectedSubCategory = useMemo(() => {
    if (selectedCategory && selectedSubCategoryIndex !== null) {
      return selectedCategory.subcategories?.[selectedSubCategoryIndex];
    }
    return null;
  }, [selectedCategory, selectedSubCategoryIndex]);

  // Display products
  const displayProducts = useMemo(() => {
    let products = [];
    
    if (selectedSubCategory) {
      products = selectedSubCategory.products || [];
    } else if (selectedCategory) {
      for (const subCat of selectedCategory.subcategories || []) {
        products.push(...(subCat.products || []));
      }
    } else if (selectedMainCategory) {
      for (const cat of selectedMainCategory.categories || []) {
        for (const subCat of cat.subcategories || []) {
          products.push(...(subCat.products || []));
        }
      }
    } else {
      for (const mainCat of mainCategories) {
        for (const cat of mainCat.categories || []) {
          for (const subCat of cat.subcategories || []) {
            products.push(...(subCat.products || []));
          }
        }
      }
    }
    
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      products = products.filter(p => {
        const name = (p.name || p.product_name || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        return name.includes(query) || sku.includes(query);
      });
    }
    
    // Remove duplicates
    const uniqueProducts = [];
    const seenIds = new Set();
    for (const product of products) {
      const id = String(product.product_id || product.productId);
      if (!seenIds.has(id)) {
        seenIds.add(id);
        uniqueProducts.push(product);
      }
    }
    
    return uniqueProducts;
  }, [selectedSubCategory, selectedCategory, selectedMainCategory, mainCategories, searchQuery]);

  // Selected products
  const selectedProducts = useMemo(() => {
    const allProducts = [];
    const seenIds = new Set();
    
    for (const mainCat of mainCategories) {
      for (const cat of mainCat.categories || []) {
        for (const subCat of cat.subcategories || []) {
          for (const product of subCat.products || []) {
            const id = String(product.product_id || product.productId);
            if (selectedProductIds.has(id) && !seenIds.has(id)) {
              seenIds.add(id);
              allProducts.push({
                ...product,
                variants: product.variants || []
              });
            }
          }
        }
      }
    }
    return allProducts;
  }, [mainCategories, selectedProductIds]);

  // Stats
  const stats = useMemo(() => {
    let totalProducts = 0, totalStock = 0, lowStock = 0, outOfStock = 0;
    let totalCategories = 0, totalSubCategories = 0;
    const uniqueProducts = new Set();
    
    for (const mainCat of mainCategories) {
      totalCategories += mainCat.categories?.length || 0;
      for (const cat of mainCat.categories || []) {
        totalSubCategories += cat.subcategories?.length || 0;
        for (const subCat of cat.subcategories || []) {
          for (const product of subCat.products || []) {
            const id = String(product.product_id || product.productId);
            if (!uniqueProducts.has(id)) {
              uniqueProducts.add(id);
              totalProducts++;
              const stock = parseInt(product.totalStock || product.total_stock || 0);
              totalStock += stock;
              if (stock === 0) outOfStock++;
              else if (stock <= 5) lowStock++;
            }
          }
        }
      }
    }
    
    return {
      totalMainCategories: mainCategories.length,
      totalCategories,
      totalSubCategories,
      totalProducts,
      totalStock,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
    };
  }, [mainCategories]);

  // Selection methods
  const selectMainCategory = (index) => {
    setSelectedMainIndex(index);
    setSelectedCategoryIndex(null);
    setSelectedSubCategoryIndex(null);
  };

  const selectCategory = (index) => {
    setSelectedCategoryIndex(index);
    setSelectedSubCategoryIndex(null);
  };

  const selectSubCategory = (index) => {
    setSelectedSubCategoryIndex(index);
  };

  const resetSelection = () => {
    setSelectedMainIndex(null);
    setSelectedCategoryIndex(null);
    setSelectedSubCategoryIndex(null);
  };

  const toggleProductSelection = useCallback((productId) => {
    const id = String(productId);
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAllProducts = useCallback(() => {
    if (displayProducts.length === 0) {
      toast.error('No products to select');
      return;
    }
    
    const ids = displayProducts.map(p => String(p.product_id || p.productId));
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      ids.forEach(id => newSet.add(id));
      return newSet;
    });
    toast.success(`${ids.length} products selected`);
  }, [displayProducts]);

  const clearProductSelection = useCallback(() => {
    setSelectedProductIds(new Set());
  }, []);

  const isProductSelected = useCallback((productId) => {
    return selectedProductIds.has(String(productId));
  }, [selectedProductIds]);

  const getSelectedCount = useCallback(() => {
    return selectedProductIds.size;
  }, [selectedProductIds]);

  const getSelectedProductIds = useCallback(() => {
    return Array.from(selectedProductIds);
  }, [selectedProductIds]);

  const hasSelectedProducts = useCallback(() => {
    return selectedProductIds.size > 0;
  }, [selectedProductIds]);

  const getStockStatusText = useCallback((stock) => {
    const s = parseInt(stock || 0);
    if (s === 0) return 'Out of Stock';
    if (s <= 5) return 'Low Stock';
    if (s <= 20) return 'Medium Stock';
    return 'In Stock';
  }, []);

  const getStockStatusColor = useCallback((stock) => {
    const s = parseInt(stock || 0);
    if (s === 0) return '#DC2626';
    if (s <= 5) return '#F59E0B';
    if (s <= 20) return '#FBBF24';
    return '#22C55E';
  }, []);

  const value = {
    stockData,
    isLoading,
    error,
    fetchStockData,
    mainCategories,
    selectedMainIndex,
    selectedCategoryIndex,
    selectedSubCategoryIndex,
    selectedMainCategory,
    selectedCategory,
    selectedSubCategory,
    displayProducts,
    selectedProductIds,
    selectedProducts,
    searchQuery,
    stats,
    activeTab,
    setActiveTab,
    selectMainCategory,
    selectCategory,
    selectSubCategory,
    resetSelection,
    toggleProductSelection,
    selectAllProducts,
    clearProductSelection,
    isProductSelected,
    getSelectedCount,
    getSelectedProductIds,
    hasSelectedProducts,
    setSearchQuery,
    getStockStatusText,
    getStockStatusColor,
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};