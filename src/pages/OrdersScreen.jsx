// src/pages/Orders.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Package,
    User,
    Clock,
    IndianRupee,
    CheckCircle,
    XCircle,
    Truck,
    AlertCircle,
    RefreshCw,
    Search,
    ChevronDown,
    Hash,
    TrendingUp,
    Target,
    Ban,
    Eye,
    Filter,
} from 'lucide-react';
import { useOrdersViewModel } from '../hooks/useOrdersSectionSeparate';

const Colors = {
    primaryGreen: '#14532D',
    primaryLightGreen: '#4ADE80',
    primaryExtraLightGreen: '#F0FDF4',
    textBlack: '#1F2937',
    textGrey1: '#6B7280',
    containerGrey2: '#F3F4F6',
    white: '#FFFFFF',
};

// Status configuration
const STATUS_CONFIG = {
    0: { label: 'Placed', color: 'bg-blue-100 text-blue-700', icon: <Clock size={14} />, bg: '#EFF6FF', textColor: '#1D4ED8' },
    1: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} />, bg: '#ECFDF5', textColor: '#15803D' },
    2: { label: 'Picked', color: 'bg-indigo-100 text-indigo-700', icon: <Package size={14} />, bg: '#EEF2FF', textColor: '#4338CA' },
    3: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: <Truck size={14} />, bg: '#FFF7ED', textColor: '#C2410C' },
    4: { label: 'In Transit', color: 'bg-purple-100 text-purple-700', icon: <Truck size={14} />, bg: '#F5F3FF', textColor: '#6D28D9' },
    5: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} />, bg: '#ECFDF5', textColor: '#047857' },
    6: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} />, bg: '#FEF2F2', textColor: '#B91C1C' },
};

export const Orders = () => {
    const navigate = useNavigate();
    const { ordersData, isLoading, error, fetchOrders } = useOrdersViewModel();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter orders
    const filteredOrders = useMemo(() => {
        return ordersData?.orders?.filter(order => {
            const matchesSearch =
                order.order_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                order.status?.toString() === statusFilter;

            return matchesSearch && matchesStatus;
        }) || [];
    }, [ordersData, searchQuery, statusFilter]);

    // Summary Cards
    const summaryCards = [
        { title: 'Total Orders', value: ordersData?.total || 0, icon: <ShoppingCart size={24} />, color: '#3B82F6', bg: '#EFF6FF' },
        { title: 'Placed', value: ordersData?.placed || 0, icon: <Clock size={24} />, color: '#1D4ED8', bg: '#DBEAFE' },
        { title: 'Confirmed', value: ordersData?.confirmed || 0, icon: <CheckCircle size={24} />, color: '#15803D', bg: '#DCFCE7' },
        { title: 'Completed', value: ordersData?.completed || 0, icon: <Target size={24} />, color: '#047857', bg: '#D1FAE5' },
        { title: 'Cancelled', value: ordersData?.cancelled || 0, icon: <Ban size={24} />, color: '#B91C1C', bg: '#FEE2E2' },
        { title: 'Revenue', value: `₹${ordersData?.total_revenue || '0'}`, icon: <IndianRupee size={24} />, color: '#D97706', bg: '#FEF3C7' },
    ];

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount || 0);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-48" />
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                            <div className="h-8 bg-gray-200 rounded w-12" />
                        </div>
                    ))}
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Failed to Load Orders</h2>
                <p className="text-sm mb-4 text-gray-500">{error}</p>
                <button
                    onClick={() => fetchOrders()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-green-800 hover:bg-green-900"
                >
                    <RefreshCw size={16} />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                        <ShoppingCart size={24} style={{ color: Colors.primaryGreen }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>Orders</h1>
                        <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
                            Manage and track all orders
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchOrders()}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <RefreshCw size={20} style={{ color: Colors.textGrey1 }} />
                </motion.button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {summaryCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-xl p-4 shadow-sm border border-gray-100 bg-white"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">{card.title}</span>
                            <div className="p-1.5 rounded-lg" style={{ backgroundColor: card.bg }}>
                                <span style={{ color: card.color }}>{card.icon}</span>
                            </div>
                        </div>
                        <p className="text-xl font-bold" style={{ color: Colors.textBlack }}>{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order number or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-200"
                        />
                    </div>
                </div>

                {/* Status Filter Chips */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All ({ordersData?.total || 0})
                    </button>
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                        const countKey = status === '0' ? 'placed' :
                            status === '1' ? 'confirmed' :
                                status === '5' ? 'completed' :
                                    status === '6' ? 'cancelled' : null;
                        const count = countKey ? (ordersData?.[countKey] || 0) : 0;
                        if (count === 0) return null;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === status
                                        ? config.color
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {config.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.02 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div
                                className="p-4 cursor-pointer flex items-center justify-between"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <Hash size={18} style={{ color: Colors.primaryGreen }} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                                                {order.order_no}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[order.status]?.color || 'bg-gray-100'}`}>
                                                {STATUS_CONFIG[order.status]?.icon}
                                                {STATUS_CONFIG[order.status]?.label}
                                            </span>
                                        </div>
                                        <p className="text-xs mt-0.5" style={{ color: Colors.textGrey1 }}>
                                            {order.customer_name} • {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <p className="text-sm font-bold" style={{ color: Colors.primaryGreen }}>
                                        {formatCurrency(order.total_amount)}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}

                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/orders/${order.id}/profile`);  // Updated path
                                        }}
                                        className="p-2 rounded-lg bg-green-50 text-green-800 hover:bg-green-100 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </motion.button>
                                    <motion.div
                                        animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={18} style={{ color: Colors.textGrey1 }} />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedOrder === order.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 border-t border-gray-100">
                                            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <QuickDetail icon={<User size={14} />} label="Customer" value={order.customer_name} />
                                                <QuickDetail icon={<Hash size={14} />} label="Order No" value={order.order_no} />
                                                <QuickDetail icon={<IndianRupee size={14} />} label="Amount" value={formatCurrency(order.total_amount)} />
                                                <QuickDetail icon={<Clock size={14} />} label="Date" value={formatDate(order.created_at)} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-16">
                        <Package size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900">No orders found</p>
                        <p className="text-sm mt-1 text-gray-500">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Quick Detail Component
const QuickDetail = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span className="text-gray-400">{icon}</span>
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);