// src/hooks/useStockViewModel.js
import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useStockViewModel = () => {
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selection state
  const [selectedMainIndex, setSelectedMainIndex] = useState(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.CITY_STOCKS);
      if (response.status === 200) {
        setStockData(response.data?.data || response.data);
        resetSelection();
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

  // Get products based on selection
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

    // Apply search filter
    if (searchQuery) {
      products = products.filter(p =>
        (p.product_name || p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [selectedSubCategory, selectedCategory, selectedMainCategory, mainCategories, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    let totalProducts = 0, totalStock = 0, lowStock = 0, outOfStock = 0;
    let totalCategories = 0;

    for (const mainCat of mainCategories) {
      totalCategories += mainCat.categories?.length || 0;
      for (const cat of mainCat.categories || []) {
        for (const subCat of cat.subcategories || []) {
          totalProducts += subCat.products?.length || 0;
          for (const product of subCat.products || []) {
            const stock = parseInt(product.totalStock || product.total_stock || 0);
            totalStock += stock;
            if (stock === 0) outOfStock++;
            if (stock > 0 && stock <= 5) lowStock++;
          }
        }
      }
    }

    return {
      totalMainCategories: mainCategories.length,
      totalCategories,
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
    setSelectedProductIds(new Set());
  };

const toggleProductSelection = (productId) => {
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
};


  const selectAllProducts = () => {
    const ids = new Set(displayProducts.map(p => String(p.product_id || p.productId)));
    setSelectedProductIds(ids);
  };

  const clearProductSelection = () => {
    setSelectedProductIds(new Set());
  };

const isProductSelected = (productId) => {
  return selectedProductIds.has(String(productId));
};
  // Stock status helpers
  const getStockStatusText = (stock) => {
    const s = parseInt(stock || 0);
    if (s === 0) return 'Out of Stock';
    if (s <= 5) return 'Low Stock';
    return 'In Stock';
  };

  const getStockStatusColor = (stock) => {
    const s = parseInt(stock || 0);
    if (s === 0) return '#DC2626';
    if (s <= 5) return '#F59E0B';
    return '#16A34A';
  };

  return {
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
    searchQuery,
    stats,
    selectMainCategory,
    selectCategory,
    selectSubCategory,
    resetSelection,
    toggleProductSelection,
    selectAllProducts,
    clearProductSelection,
    isProductSelected,
    setSearchQuery,
    getStockStatusText,
    getStockStatusColor,
  };
};