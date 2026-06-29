import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  RefreshCw,
  Package,
  Inbox,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Loader,
  Camera,
  Plus,
  Minus,
  Building2,
  Tag,
  Info,
  Image,
  Upload,
  Trash2,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../../config/ApiConfig';
import { AppHeader } from './AppHeader';

const Colors = {
  primaryGreen: '#14532D',
  greenSoft: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  bg: '#F4F6F9',
  warn: '#F59E0B',
  success: '#16A34A',
  error: '#DC2626',
  info: '#2563EB',
  containerGrey: '#F3F4F6',
};

const STATUS_FILTERS = ['All', 'Pending', 'Accepted', 'Completed'];
const SORT_OPTIONS = ['Newest', 'Oldest', 'Quantity: High', 'Quantity: Low'];

export const IncomingStock = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [incomingData, setIncomingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(ENDPOINTS.ADMIN_INCOMING_STOCK);
      if (response.status === 200) {
        setIncomingData(response.data?.data || []);
      }
    } catch (error) {
      toast.error('Failed to load incoming stock');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStatusLabel = (status) => {
    const s = parseInt(status);
    if (s === 0) return 'Pending';
    if (s === 1) return 'Accepted';
    if (s === 2) return 'Completed';
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    const s = parseInt(status);
    if (s === 0) return Colors.warn;
    if (s === 1) return Colors.success;
    if (s === 2) return Colors.primaryGreen;
    return Colors.textGrey;
  };

  const formatDate = (raw) => {
    try {
      const dt = new Date(raw);
      if (isNaN(dt)) return raw;
      const diff = Date.now() - dt;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 259200000) return `${Math.floor(diff / 86400000)}d ago`;
      return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
    } catch { return raw; }
  };

  const getTotalQty = (transfer) => {
    return (transfer.items || []).reduce((sum, item) => {
      return sum + (item.variants || []).reduce((vSum, v) => vSum + (parseInt(v.quantity) || 0), 0);
    }, 0);
  };

  const getTotalReceived = (transfer) => {
    return (transfer.items || []).reduce((sum, item) => {
      return sum + (item.variants || []).reduce((vSum, v) => vSum + (parseInt(v.received_qty || v.receivedQty) || 0), 0);
    }, 0);
  };

  const filteredData = useMemo(() => {
    if (!incomingData) return [];
    let result = [...incomingData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        (t.items || []).some(item =>
          (item.product_name || item.productName || '').toLowerCase().includes(q) ||
          String(item.productid).includes(q) ||
          (item.brandname || '').toLowerCase().includes(q)
        )
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter(t => getStatusLabel(t.status).toLowerCase() === selectedStatus.toLowerCase());
    }

    result.sort((a, b) => {
      const aDate = new Date(a.created_at || a.createdAt || 0);
      const bDate = new Date(b.created_at || b.createdAt || 0);
      switch (sortBy) {
        case 'Oldest': return aDate - bDate;
        case 'Quantity: High': return getTotalQty(b) - getTotalQty(a);
        case 'Quantity: Low': return getTotalQty(a) - getTotalQty(b);
        default: return bDate - aDate;
      }
    });

    return result;
  }, [incomingData, searchQuery, selectedStatus, sortBy]);

  return (
    <div className="flex flex-col h-screen">
      <AppHeader
        title="Admin Incoming Stock"
        subtitle="Track incoming stock from hubs"
        actions={
          <button onClick={fetchData} className="p-2 rounded-lg hover:bg-gray-100">
            <RefreshCw size={20} className="text-gray-500" />
          </button>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex gap-2 mx-4 mt-4">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-200"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X size={15} className="text-gray-400" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="flex gap-2 mx-4 mt-3 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(status => {
            const isActive = selectedStatus === status;
            const color = status === 'All' ? Colors.primaryGreen : getStatusColor(status === 'Pending' ? 0 : status === 'Accepted' ? 1 : 2);
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${isActive ? 'border-current' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                style={isActive ? { backgroundColor: `${color}18`, color, borderColor: color } : {}}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto mx-4 mt-3 mb-4">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader size={32} className="animate-spin text-green-800" /></div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Inbox size={48} className="mb-3 opacity-40" />
              <p className="text-sm">No incoming stock found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((transfer) => (
                <TransferCard
                  key={transfer.transfer_id || transfer.transferId}
                  transfer={transfer}
                  expanded={expandedTransfer === (transfer.transfer_id || transfer.transferId)}
                  onToggle={() => setExpandedTransfer(expandedTransfer === (transfer.transfer_id || transfer.transferId) ? null : (transfer.transfer_id || transfer.transferId))}
                  onAccept={() => setShowAcceptDialog(transfer)}
                  getStatusLabel={getStatusLabel}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  getTotalQty={getTotalQty}
                  getTotalReceived={getTotalReceived}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAcceptDialog && (
          <AcceptTransferDialog
            transfer={showAcceptDialog}
            onClose={() => setShowAcceptDialog(null)}
            onSuccess={() => { setShowAcceptDialog(null); fetchData(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Transfer Card ──────────────────────────────────────────────────────────────
const TransferCard = ({ transfer, expanded, onToggle, onAccept, getStatusLabel, getStatusColor, formatDate, getTotalQty, getTotalReceived }) => {
  const statusLabel = getStatusLabel(transfer.status);
  const statusColor = getStatusColor(transfer.status);
  const isPending = parseInt(transfer.status) === 0;
  const totalItems = (transfer.items || []).length;
  const totalQty = getTotalQty(transfer);
  const totalReceived = getTotalReceived(transfer);

  return (
    <motion.div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-3.5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${statusColor}15` }}>
            <Package size={22} style={{ color: statusColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-800">Transfer #{transfer.transfer_id || transfer.transferId}</p>
              <StatusBadge label={statusLabel} color={statusColor} />
              {isPending && <AcceptButton onClick={(e) => { e.stopPropagation(); onAccept(); }} />}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(transfer.created_at || transfer.createdAt)}</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </div>

        <div className="flex justify-around">
          <StatChip icon={<Package size={12} />} label="Items" value={totalItems} color={Colors.info} />
          <StatChip icon={<Package size={12} />} label="Total Qty" value={totalQty} color={Colors.textGrey} />
          <StatChip icon={<CheckCircle size={12} />} label="Received" value={totalReceived} color={Colors.success} />
        </div>
      </div>

      {transfer.remark && (
        <div className="px-3.5 pb-3 flex items-start gap-2">
          <Info size={14} className="text-gray-400 mt-0.5" />
          <p className="text-xs text-gray-500">{transfer.remark}</p>
        </div>
      )}

      <AnimatePresence>
        {expanded && (transfer.items || []).length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-gray-50 border-t border-gray-100">
              {(transfer.items || []).map((item, idx) => (
                <ProductItemCard key={idx} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPending && !expanded && (
        <div className="px-3.5 pb-3.5">
          <button
            onClick={(e) => { e.stopPropagation(); onAccept(); }}
            className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={18} />
            Accept Transfer
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ── Product Item Card ─────────────────────────────────────────────────────────
const ProductItemCard = ({ item }) => (
  <div className="p-3.5 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden shrink-0">
        {(item.product_image || item.productImage) ? (
          <img src={item.product_image || item.productImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <Package size={22} className="text-green-800" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{item.product_name || item.productName}</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {item.brandname && <InfoTag label={item.brandname} color={Colors.info} />}
          {item.main_category && <InfoTag label={item.main_category} color={Colors.textGrey} />}
          {item.gst_percent && <InfoTag label={`GST: ${item.gst_percent}%`} color={Colors.success} />}
        </div>
      </div>
    </div>

    {(item.variants || []).length > 0 && (
      <div className="space-y-2">
        {(item.variants || []).map((variant, vIdx) => (
          <VariantRow key={vIdx} variant={variant} />
        ))}
      </div>
    )}
  </div>
);

// ── Variant Row with Multiple Dispute Images ──────────────────────────────────
const VariantRow = ({ variant }) => {
  const sentQty = parseInt(variant.quantity) || 0;
  const receivedQty = parseInt(variant.received_qty || variant.receivedQty) || 0;
  const missingQty = parseInt(variant.missing_qty || variant.missingQty) || 0;
  const disputeQty = parseInt(variant.dispute_qty || variant.disputeQty) || 0;
  
  let disputeImages = [];
  const imageData = variant.images || variant.image || variant.dispute_images;
  
  if (imageData) {
    try {
      if (typeof imageData === 'string') {
        const parsed = JSON.parse(imageData);
        disputeImages = Array.isArray(parsed) ? parsed : [imageData];
      } else if (Array.isArray(imageData)) {
        disputeImages = imageData;
      } else if (typeof imageData === 'string') {
        disputeImages = [imageData];
      }
    } catch {
      if (typeof imageData === 'string' && imageData.startsWith('http')) {
        disputeImages = [imageData];
      }
    }
  }

  const hasDispute = disputeQty > 0;
  const hasDisputeImages = hasDispute && disputeImages.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-800">{variant.value || 'Default'}</span>
        <div className="text-right">
          {variant.discount_price || variant.discountPrice ? (
            <>
              <span className="text-xs text-gray-400 line-through mr-1">₹{variant.price}</span>
              <span className="text-sm font-bold text-green-800">₹{variant.discount_price || variant.discountPrice}</span>
            </>
          ) : variant.price ? (
            <span className="text-sm font-bold text-green-800">₹{variant.price}</span>
          ) : null}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        <QtyPill label="Sent" value={sentQty} color={Colors.info} />
        <QtyPill label="Received" value={receivedQty} color={Colors.success} />
        {missingQty > 0 && <QtyPill label="Missing" value={missingQty} color={Colors.error} />}
        {hasDispute && <QtyPill label="Defective" value={disputeQty} color={Colors.warn} />}
      </div>

      {hasDispute && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
              <Camera size={12} />
              Defective Product Images ({disputeImages.length})
            </p>
          </div>
          
          {hasDisputeImages ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {disputeImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Defective product ${index + 1}`}
                    className="w-full h-24 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(img, '_blank')}
                  />
                  <button
                    onClick={() => window.open(img, '_blank')}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity"
                  >
                    <Eye size={20} className="text-white" />
                  </button>
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-yellow-600 flex items-center gap-1">
              <AlertTriangle size={14} />
              Please upload defective product images
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Multiple Image Upload Component ──────────────────────────────────────────
const MultipleImageUpload = ({ images = [], onAddImages, onRemoveImage, maxImages = 5, readOnly = false, label = "Defective Images" }) => {
  const handleFileSelect = (e) => {
    if (readOnly) return;
    
    const files = Array.from(e.target.files);
    const remainingSlots = maxImages - images.length;
    const validFiles = files.slice(0, remainingSlots);
    
    if (validFiles.length > 0) {
      onAddImages(validFiles);
    }
    
    if (files.length > remainingSlots) {
      toast.error(`Maximum ${maxImages} images allowed. ${remainingSlots} slots remaining.`);
    }
  };

  if (readOnly) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={typeof img === 'string' ? img : img.url}
              alt={`Defective ${index + 1}`}
              className="w-full h-24 rounded-lg object-cover border border-gray-200 cursor-pointer"
              onClick={() => window.open(typeof img === 'string' ? img : img.url, '_blank')}
            />
            <button
              onClick={() => window.open(typeof img === 'string' ? img : img.url, '_blank')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity"
            >
              <Eye size={20} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-gray-600 mb-2">{label} ({images.length}/{maxImages})</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={typeof img === 'string' ? img : img.url}
              alt={`Defective ${index + 1}`}
              className="w-full h-24 rounded-lg object-cover border border-gray-200"
            />
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="relative w-full h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors group">
            <Upload size={20} className="text-gray-400 group-hover:text-green-500 transition-colors" />
            <span className="text-xs text-gray-400 mt-1 group-hover:text-green-500 transition-colors">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

// ── Accept Transfer Dialog ───────────────────────────────────────────────
// const AcceptTransferDialog = ({ transfer, onClose, onSuccess }) => {
//   const [remark, setRemark] = useState('');
//   const [variantData, setVariantData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const isViewOnly = parseInt(transfer.status) !== 0;

//   useEffect(() => {
//     const data = {};
//     (transfer.items || []).forEach(item => {
//       (item.variants || []).forEach(variant => {
//         const key = `${item.productid}_${variant.variantid}`;
//         const sentQty = parseInt(variant.quantity) || 0;
        
//         let existingImages = [];
//         const imageData = variant.images || variant.image || variant.dispute_images;
//         if (imageData) {
//           try {
//             if (typeof imageData === 'string') {
//               const parsed = JSON.parse(imageData);
//               existingImages = Array.isArray(parsed) ? parsed : [imageData];
//             } else if (Array.isArray(imageData)) {
//               existingImages = imageData;
//             } else if (typeof imageData === 'string') {
//               existingImages = [imageData];
//             }
//           } catch {
//             if (typeof imageData === 'string' && imageData.startsWith('http')) {
//               existingImages = [imageData];
//             }
//           }
//         }
        
//         data[key] = {
//           productid: item.productid,
//           variantid: variant.variantid,
//           received_qty: variant.received_qty || sentQty,
//           missing_qty: variant.missing_qty || 0,
//           dispute_qty: variant.dispute_qty || 0,
//           dispute_images: existingImages,
//           maxQty: sentQty,
//           productName: item.product_name || item.productName,
//           variantValue: variant.value,
//           uploadingImages: false,
//         };
//       });
//     });
//     setVariantData(data);
    
//     if (transfer.remark) {
//       setRemark(transfer.remark);
//     }
//   }, [transfer]);

//   const updateVariant = (key, field, value) => {
//     if (isViewOnly) return;
    
//     setVariantData(prev => {
//       const updated = { ...prev[key], [field]: value };
      
//       // If dispute_qty is set to 0, clear the images
//       if (field === 'dispute_qty' && value === 0) {
//         updated.dispute_images = [];
//       }
      
//       // Update missing quantity
//       if (field !== 'dispute_images' && field !== 'uploadingImages') {
//         updated.missing_qty = updated.maxQty - (updated.received_qty + updated.dispute_qty);
//       }
      
//       return { ...prev, [key]: updated };
//     });
//   };

//   const uploadMultipleImages = async (key, files) => {
//     if (isViewOnly || !files || files.length === 0) return;
    
//     updateVariant(key, 'uploadingImages', true);
    
//     const CLOUD_NAME = "ddsnwfgaw";
//     const UPLOAD_PRESET = "FastoDriver";
    
//     const uploadedUrls = [];
    
//     try {
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', UPLOAD_PRESET);

//         const response = await fetch(
//           `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//           {
//             method: 'POST',
//             body: formData,
//           }
//         );
//         const data = await response.json();

//         if (data.secure_url) {
//           uploadedUrls.push(data.secure_url);
//         }
//       }

//       if (uploadedUrls.length > 0) {
//         setVariantData(prev => {
//           const currentImages = prev[key]?.dispute_images || [];
//           const updatedImages = [...currentImages, ...uploadedUrls];
//           return {
//             ...prev,
//             [key]: { ...prev[key], dispute_images: updatedImages }
//           };
//         });
//         toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
//       } else {
//         toast.error('Failed to upload images');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload images');
//     } finally {
//       updateVariant(key, 'uploadingImages', false);
//     }
//   };

//   const removeImage = (key, index) => {
//     if (isViewOnly) return;
    
//     setVariantData(prev => {
//       const updatedImages = [...(prev[key]?.dispute_images || [])];
//       updatedImages.splice(index, 1);
//       return {
//         ...prev,
//         [key]: { ...prev[key], dispute_images: updatedImages }
//       };
//     });
//   };

//   const handleImageUpload = (key) => {
//     if (isViewOnly) return;
    
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.multiple = true;
//     input.capture = 'environment';
//     input.onchange = async (e) => {
//       const files = Array.from(e.target.files || []);
//       if (files.length === 0) return;
      
//       const currentImages = variantData[key]?.dispute_images || [];
//       const remainingSlots = 5 - currentImages.length;
      
//       if (files.length > remainingSlots) {
//         toast.error(`Maximum 5 images allowed. ${remainingSlots} slots remaining.`);
//         return;
//       }
      
//       await uploadMultipleImages(key, files);
//     };
//     input.click();
//   };

//   const handleSubmit = async () => {
//     if (isViewOnly) {
//       onClose();
//       return;
//     }
    
//     // Validate
//     for (const [key, data] of Object.entries(variantData)) {
//       const total = data.received_qty + data.dispute_qty + data.missing_qty;
//       if (total !== data.maxQty) {
//         toast.error(`Quantity mismatch for ${data.productName} - ${data.variantValue}`);
//         return;
//       }
      
//       // Check if dispute has images
//       if (data.dispute_qty > 0) {
//         if (!data.dispute_images || data.dispute_images.length === 0) {
//           toast.error(`Please upload at least one defective image for ${data.productName} - ${data.variantValue}`);
//           return;
//         }
//       } else {
//         // If no dispute, clear images
//         data.dispute_images = [];
//       }
      
//       if (data.uploadingImages) {
//         toast.error(`Please wait for images to finish uploading`);
//         return;
//       }
//     }

//     setIsSubmitting(true);
//     try {
//       const items = Object.values(variantData).map(data => {
//         let disputeImages = data.dispute_images || [];
        
//         // Only send images if dispute quantity > 0
//         if (data.dispute_qty === 0) {
//           disputeImages = [];
//         }
        
//         const disputeImagesString = Array.isArray(disputeImages) 
//           ? JSON.stringify(disputeImages) 
//           : disputeImages;
        
//         return {
//           productid: data.productid,
//           variantid: data.variantid,
//           received_qty: data.received_qty,
//           missing_qty: data.missing_qty,
//           dispute_qty: data.dispute_qty,
//           dispute_images: disputeImagesString,
//         };
//       });

//       const response = await apiClient.post(ENDPOINTS.ACCEPT_INCOMING_TRANSFER, {
//         transfer_id: String(transfer.transfer_id || transfer.transferId),
//         status: 1,
//         remark: remark.trim(),
//         items: items,
//       });

//       if (response.status === 200 || response.status === 201) {
//         toast.success('Transfer accepted successfully');
//         onSuccess();
//       } else {
//         toast.error(response.data?.message || 'Failed to accept transfer');
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.response?.data?.message || 'Failed to accept transfer');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.9 }}
//         className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-4 border-b border-gray-200 flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
//             <CheckCircle size={20} className="text-green-800" />
//           </div>
//           <div className="flex-1">
//             <h3 className="font-bold text-gray-900">
//               {isViewOnly ? 'Transfer Details' : 'Accept Transfer'}
//             </h3>
//             <p className="text-xs text-gray-500">Transfer #{transfer.transfer_id || transfer.transferId}</p>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
//             <X size={18} className="text-gray-400" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           <div>
//             <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
//               Remark {isViewOnly && '(Read Only)'}
//             </label>
//             <textarea
//               value={remark}
//               onChange={(e) => !isViewOnly && setRemark(e.target.value)}
//               rows={2}
//               placeholder="Add any remarks..."
//               readOnly={isViewOnly}
//               className={`w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-green-200 resize-none ${
//                 isViewOnly ? 'bg-gray-50 text-gray-500' : 'bg-gray-50'
//               }`}
//             />
//           </div>

//           <p className="text-xs font-semibold text-gray-700">
//             {isViewOnly ? 'Transfer Details' : 'Confirm Received Quantities'}
//           </p>

//           {(transfer.items || []).map((item) => (
//             <div key={item.productid} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden">
//                   {(item.product_image || item.productImage) ? (
//                     <img src={item.product_image || item.productImage} alt="" className="w-full h-full object-cover" />
//                   ) : (
//                     <Package size={18} className="text-green-800" />
//                   )}
//                 </div>
//                 <span className="text-sm font-semibold text-gray-800 truncate">{item.product_name || item.productName}</span>
//               </div>

//               {(item.variants || []).map((variant) => {
//                 const key = `${item.productid}_${variant.variantid}`;
//                 const data = variantData[key];
//                 if (!data) return null;

//                 const maxQty = data.maxQty;
//                 const receivedQty = data.received_qty;
//                 const disputeQty = data.dispute_qty;
//                 const missingQty = data.missing_qty;
//                 const disputeImages = data.dispute_images || [];
//                 const isUploading = data.uploadingImages;

//                 return (
//                   <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 mb-2 last:mb-0">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-xs font-semibold">{data.variantValue || 'Default'}</span>
//                       <span className="text-xs text-blue-600 font-semibold">Sent: {maxQty}</span>
//                     </div>

//                     {!isViewOnly ? (
//                       <>
//                         <div className="grid grid-cols-3 gap-3 mb-3">
//                           <div className="text-center">
//                             <p className="text-xs text-gray-400 mb-1">Received</p>
//                             <div className="flex items-center justify-center gap-1">
//                               <button
//                                 onClick={() => receivedQty > 0 && updateVariant(key, 'received_qty', receivedQty - 1)}
//                                 disabled={receivedQty <= 0}
//                                 className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
//                               >
//                                 <Minus size={12} />
//                               </button>
//                               <span className="text-sm font-bold text-green-600 w-8">{receivedQty}</span>
//                               <button
//                                 onClick={() => (receivedQty + disputeQty) < maxQty && updateVariant(key, 'received_qty', receivedQty + 1)}
//                                 disabled={(receivedQty + disputeQty) >= maxQty}
//                                 className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
//                               >
//                                 <Plus size={12} />
//                               </button>
//                             </div>
//                           </div>

//                           <div className="text-center">
//                             <p className="text-xs text-gray-400 mb-1">Defective</p>
//                             <div className="flex items-center justify-center gap-1">
//                               <button
//                                 onClick={() => disputeQty > 0 && updateVariant(key, 'dispute_qty', disputeQty - 1)}
//                                 disabled={disputeQty <= 0}
//                                 className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
//                               >
//                                 <Minus size={12} />
//                               </button>
//                               <span className="text-sm font-bold text-orange-500 w-8">{disputeQty}</span>
//                               <button
//                                 onClick={() => (receivedQty + disputeQty) < maxQty && updateVariant(key, 'dispute_qty', disputeQty + 1)}
//                                 disabled={(receivedQty + disputeQty) >= maxQty}
//                                 className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
//                               >
//                                 <Plus size={12} />
//                               </button>
//                             </div>
//                           </div>

//                           <div className="text-center">
//                             <p className="text-xs text-gray-400 mb-1">Missing</p>
//                             <span className={`text-sm font-bold ${missingQty > 0 ? 'text-red-500' : 'text-gray-400'}`}>
//                               {missingQty}
//                             </span>
//                           </div>
//                         </div>

//                         {disputeQty > 0 && (
//                           <div className="mt-1">
//                             {isUploading && (
//                               <div className="flex items-center gap-2 mb-2 text-blue-600">
//                                 <Loader size={16} className="animate-spin" />
//                                 <span className="text-xs">Uploading images...</span>
//                               </div>
//                             )}
//                             <MultipleImageUpload
//                               images={disputeImages}
//                               onAddImages={(files) => uploadMultipleImages(key, files)}
//                               onRemoveImage={(index) => removeImage(key, index)}
//                               maxImages={5}
//                               readOnly={false}
//                               label="Defective Product Images"
//                             />
//                             {disputeImages.length > 0 && (
//                               <button
//                                 onClick={() => handleImageUpload(key)}
//                                 className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
//                               >
//                                 <Camera size={14} />
//                                 Add More Images
//                               </button>
//                             )}
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div className="grid grid-cols-4 gap-2 mb-3">
//                         <div className="text-center">
//                           <p className="text-xs text-gray-400 mb-1">Sent</p>
//                           <p className="text-sm font-bold text-blue-600">{maxQty}</p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-xs text-gray-400 mb-1">Received</p>
//                           <p className="text-sm font-bold text-green-600">{receivedQty}</p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-xs text-gray-400 mb-1">Defective</p>
//                           <p className={`text-sm font-bold ${disputeQty > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
//                             {disputeQty}
//                           </p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-xs text-gray-400 mb-1">Missing</p>
//                           <p className={`text-sm font-bold ${missingQty > 0 ? 'text-red-500' : 'text-gray-400'}`}>
//                             {missingQty}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 border-t border-gray-200 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             {isViewOnly ? 'Close' : 'Cancel'}
//           </button>
//           {!isViewOnly && (
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="flex-1 py-3 rounded-xl bg-green-800 text-white text-sm font-bold hover:bg-green-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
//             >
//               {isSubmitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
//               Accept Transfer
//             </button>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// ── Accept Transfer Dialog ───────────────────────────────────────────────
const AcceptTransferDialog = ({ transfer, onClose, onSuccess }) => {
  const [remark, setRemark] = useState('');
  const [variantData, setVariantData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isViewOnly = parseInt(transfer.status) !== 0;

  useEffect(() => {
    const data = {};
    (transfer.items || []).forEach(item => {
      (item.variants || []).forEach(variant => {
        const key = `${item.productid}_${variant.variantid}`;
        const sentQty = parseInt(variant.quantity) || 0;
        
        let existingImages = [];
        const imageData = variant.images || variant.image || variant.dispute_images;
        if (imageData) {
          try {
            if (typeof imageData === 'string') {
              const parsed = JSON.parse(imageData);
              existingImages = Array.isArray(parsed) ? parsed : [imageData];
            } else if (Array.isArray(imageData)) {
              existingImages = imageData;
            } else if (typeof imageData === 'string') {
              existingImages = [imageData];
            }
          } catch {
            if (typeof imageData === 'string' && imageData.startsWith('http')) {
              existingImages = [imageData];
            }
          }
        }
        
        data[key] = {
          productid: item.productid,
          variantid: variant.variantid,
          received_qty: variant.received_qty || sentQty,
          missing_qty: variant.missing_qty || 0,
          dispute_qty: variant.dispute_qty || 0,
          dispute_images: existingImages,
          maxQty: sentQty,
          productName: item.product_name || item.productName,
          variantValue: variant.value,
          uploadingImages: false,
        };
      });
    });
    setVariantData(data);
    
    if (transfer.remark) {
      setRemark(transfer.remark);
    }
  }, [transfer]);

  const updateVariant = (key, field, value) => {
    if (isViewOnly) return;
    
    setVariantData(prev => {
      const updated = { ...prev[key], [field]: value };
      
      // If dispute_qty is set to 0, clear the images
      if (field === 'dispute_qty' && value === 0) {
        updated.dispute_images = [];
      }
      
      // Update missing quantity
      if (field !== 'dispute_images' && field !== 'uploadingImages') {
        updated.missing_qty = updated.maxQty - (updated.received_qty + updated.dispute_qty);
      }
      
      return { ...prev, [key]: updated };
    });
  };

  const uploadMultipleImages = async (key, files) => {
    if (isViewOnly || !files || files.length === 0) return;
    
    updateVariant(key, 'uploadingImages', true);
    
    const CLOUD_NAME = "ddsnwfgaw";
    const UPLOAD_PRESET = "FastoDriver";
    
    const uploadedUrls = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      if (uploadedUrls.length > 0) {
        setVariantData(prev => {
          const currentImages = prev[key]?.dispute_images || [];
          const updatedImages = [...currentImages, ...uploadedUrls];
          return {
            ...prev,
            [key]: { ...prev[key], dispute_images: updatedImages }
          };
        });
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      } else {
        toast.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      updateVariant(key, 'uploadingImages', false);
    }
  };

  const removeImage = (key, index) => {
    if (isViewOnly) return;
    
    setVariantData(prev => {
      const updatedImages = [...(prev[key]?.dispute_images || [])];
      updatedImages.splice(index, 1);
      return {
        ...prev,
        [key]: { ...prev[key], dispute_images: updatedImages }
      };
    });
  };

  const handleImageUpload = (key) => {
    if (isViewOnly) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.capture = 'environment';
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      
      const currentImages = variantData[key]?.dispute_images || [];
      const remainingSlots = 5 - currentImages.length;
      
      if (files.length > remainingSlots) {
        toast.error(`Maximum 5 images allowed. ${remainingSlots} slots remaining.`);
        return;
      }
      
      await uploadMultipleImages(key, files);
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (isViewOnly) {
      onClose();
      return;
    }
    
    // Validate
    for (const [key, data] of Object.entries(variantData)) {
      const total = data.received_qty + data.dispute_qty + data.missing_qty;
      if (total !== data.maxQty) {
        toast.error(`Quantity mismatch for ${data.productName} - ${data.variantValue}`);
        return;
      }
      
      // Check if dispute has images
      if (data.dispute_qty > 0) {
        if (!data.dispute_images || data.dispute_images.length === 0) {
          toast.error(`Please upload at least one defective image for ${data.productName} - ${data.variantValue}`);
          return;
        }
      } else {
        // If no dispute, clear images
        data.dispute_images = [];
      }
      
      if (data.uploadingImages) {
        toast.error(`Please wait for images to finish uploading`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const items = Object.values(variantData).map(data => {
        let disputeImages = data.dispute_images || [];
        
        // Only send images if dispute quantity > 0
        if (data.dispute_qty === 0) {
          disputeImages = [];
        }
        
        // Send as array directly (not JSON string)
        return {
          productid: data.productid,
          variantid: data.variantid,
          received_qty: data.received_qty,
          missing_qty: data.missing_qty,
          dispute_qty: data.dispute_qty,
          dispute_images: disputeImages, // This will be an array like ["url1", "url2"]
        };
      });

      console.log('Submitting payload:', {
        transfer_id: String(transfer.transfer_id || transfer.transferId),
        status: 1,
        remark: remark.trim(),
        items: items,
      });

      const response = await apiClient.post(ENDPOINTS.ACCEPT_INCOMING_TRANSFER, {
        transfer_id: String(transfer.transfer_id || transfer.transferId),
        status: 1,
        remark: remark.trim(),
        items: items,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Transfer accepted successfully');
        onSuccess();
      } else {
        toast.error(response.data?.message || 'Failed to accept transfer');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to accept transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle size={20} className="text-green-800" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">
              {isViewOnly ? 'Transfer Details' : 'Accept Transfer'}
            </h3>
            <p className="text-xs text-gray-500">Transfer #{transfer.transfer_id || transfer.transferId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Remark {isViewOnly && '(Read Only)'}
            </label>
            <textarea
              value={remark}
              onChange={(e) => !isViewOnly && setRemark(e.target.value)}
              rows={2}
              placeholder="Add any remarks..."
              readOnly={isViewOnly}
              className={`w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-green-200 resize-none ${
                isViewOnly ? 'bg-gray-50 text-gray-500' : 'bg-gray-50'
              }`}
            />
          </div>

          <p className="text-xs font-semibold text-gray-700">
            {isViewOnly ? 'Transfer Details' : 'Confirm Received Quantities'}
          </p>

          {(transfer.items || []).map((item) => (
            <div key={item.productid} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden">
                  {(item.product_image || item.productImage) ? (
                    <img src={item.product_image || item.productImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={18} className="text-green-800" />
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 truncate">{item.product_name || item.productName}</span>
              </div>

              {(item.variants || []).map((variant) => {
                const key = `${item.productid}_${variant.variantid}`;
                const data = variantData[key];
                if (!data) return null;

                const maxQty = data.maxQty;
                const receivedQty = data.received_qty;
                const disputeQty = data.dispute_qty;
                const missingQty = data.missing_qty;
                const disputeImages = data.dispute_images || [];
                const isUploading = data.uploadingImages;

                return (
                  <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 mb-2 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">{data.variantValue || 'Default'}</span>
                      <span className="text-xs text-blue-600 font-semibold">Sent: {maxQty}</span>
                    </div>

                    {!isViewOnly ? (
                      <>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Received</p>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => receivedQty > 0 && updateVariant(key, 'received_qty', receivedQty - 1)}
                                disabled={receivedQty <= 0}
                                className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-bold text-green-600 w-8">{receivedQty}</span>
                              <button
                                onClick={() => (receivedQty + disputeQty) < maxQty && updateVariant(key, 'received_qty', receivedQty + 1)}
                                disabled={(receivedQty + disputeQty) >= maxQty}
                                className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Defective</p>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => disputeQty > 0 && updateVariant(key, 'dispute_qty', disputeQty - 1)}
                                disabled={disputeQty <= 0}
                                className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-bold text-orange-500 w-8">{disputeQty}</span>
                              <button
                                onClick={() => (receivedQty + disputeQty) < maxQty && updateVariant(key, 'dispute_qty', disputeQty + 1)}
                                disabled={(receivedQty + disputeQty) >= maxQty}
                                className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Missing</p>
                            <span className={`text-sm font-bold ${missingQty > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                              {missingQty}
                            </span>
                          </div>
                        </div>

                        {disputeQty > 0 && (
                          <div className="mt-1">
                            {isUploading && (
                              <div className="flex items-center gap-2 mb-2 text-blue-600">
                                <Loader size={16} className="animate-spin" />
                                <span className="text-xs">Uploading images...</span>
                              </div>
                            )}
                            <MultipleImageUpload
                              images={disputeImages}
                              onAddImages={(files) => uploadMultipleImages(key, files)}
                              onRemoveImage={(index) => removeImage(key, index)}
                              maxImages={5}
                              readOnly={false}
                              label="Defective Product Images"
                            />
                            {disputeImages.length > 0 && (
                              <button
                                onClick={() => handleImageUpload(key)}
                                className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                              >
                                <Camera size={14} />
                                Add More Images
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Sent</p>
                          <p className="text-sm font-bold text-blue-600">{maxQty}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Received</p>
                          <p className="text-sm font-bold text-green-600">{receivedQty}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Defective</p>
                          <p className={`text-sm font-bold ${disputeQty > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                            {disputeQty}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Missing</p>
                          <p className={`text-sm font-bold ${missingQty > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {missingQty}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {isViewOnly ? 'Close' : 'Cancel'}
          </button>
          {!isViewOnly && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-green-800 text-white text-sm font-bold hover:bg-green-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Accept Transfer
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
// ── Shared Components ─────────────────────────────────────────────────────────
const StatusBadge = ({ label, color }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${color}15`, color }}>
    {label}
  </span>
);

const AcceptButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-2 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1"
  >
    <CheckCircle size={12} />
    Accept
  </button>
);

const StatChip = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${color}10` }}>
    <span style={{ color }}>{icon}</span>
    <span className="text-sm font-bold" style={{ color }}>{value}</span>
    <span className="text-xs" style={{ color: `${color}99` }}>{label}</span>
  </div>
);

const InfoTag = ({ label, color }) => (
  <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${color}12`, color }}>
    {label}
  </span>
);

const QtyPill = ({ label, value, color }) => (
  <span className="px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1" style={{ backgroundColor: `${color}12`, color }}>
    {value}
    <span className="opacity-70 font-normal">{label}</span>
  </span>
);