// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// export const generateInvoice = (orderProfile) => {
//   const order = orderProfile?.order;
//   const items = orderProfile?.items || [];
  
//   if (!order) return;

//   const doc = new jsPDF({
//     orientation: 'portrait',
//     unit: 'mm',
//     format: 'a4',
//   });

//   const primaryGreen = [20, 83, 45];
//   const darkGray = [31, 41, 55];
//   const lightGray = [107, 114, 128];

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
//   let yPos = margin;

//   // ── Header Background ─────────────────────────────────────────────
//   doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
//   doc.rect(0, 0, pageWidth, 40, 'F');

//   // ── Company Name ──────────────────────────────────────────────────
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(20);
//   doc.setFont('helvetica', 'bold');
//   doc.text('City Panel', margin, 20);

//   doc.setFontSize(8);
//   doc.setFont('helvetica', 'normal');
//   doc.text('Grocery Delivery Management', margin, 28);
//   doc.text('Lucknow, Uttar Pradesh', margin, 34);

//   // ── INVOICE Title ─────────────────────────────────────────────────
//   doc.setFontSize(18);
//   doc.setTextColor(255, 255, 255);
//   doc.text('INVOICE', pageWidth - margin, 22, { align: 'right' });

//   // ── Bill To & Invoice Details ─────────────────────────────────────
//   yPos = 52;
  
//   doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'bold');
//   doc.text('Bill To:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   yPos += 6;
//   doc.text(order.customer_name || 'N/A', margin, yPos);
//   yPos += 5;
//   doc.text(order.customer_phone || order.phone || 'N/A', margin, yPos);
//   yPos += 5;
//   const fullAddress = `${order.address || ''}${order.landmark ? ', ' + order.landmark : ''} - ${order.pincode || ''}`;
  
//   const addressLines = doc.splitTextToSize(fullAddress, 80);
//   addressLines.forEach(line => {
//     doc.text(line, margin, yPos);
//     yPos += 5;
//   });

//   // Right - Invoice Details
//   let ry = 52;
//   const rightX = pageWidth - margin;
//   const labelX = pageWidth - 60;
  
//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'bold');
//   doc.text('Invoice No:', labelX, ry);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   doc.text(order.order_no || 'N/A', rightX, ry, { align: 'right' });
//   ry += 6;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(10);
//   doc.text('Date:', labelX, ry);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   doc.text(formatDate(order.created_at), rightX, ry, { align: 'right' });
//   ry += 6;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(10);
//   doc.text('Payment:', labelX, ry);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   doc.text((order.payment_method || 'COD').toUpperCase(), rightX, ry, { align: 'right' });
//   ry += 6;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(10);
//   doc.text('Status:', labelX, ry);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   doc.text(getStatusText(order.status), rightX, ry, { align: 'right' });

//   // ── Divider ───────────────────────────────────────────────────────
//   yPos = Math.max(yPos, 80) + 5;
//   doc.setDrawColor(200, 200, 200);
//   doc.setLineWidth(0.3);
//   doc.line(margin, yPos, pageWidth - margin, yPos);

//   // ── Items Table ───────────────────────────────────────────────────
//   yPos += 8;
//   doc.setFontSize(11);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
//   doc.text('Order Items', margin, yPos);

//   yPos += 6;
  
//   // ✅ Remove # column - only 4 columns
//   const tableHeaders = [['Product Name', 'Price', 'Qty', 'Total']];
//   const tableData = items.map((item) => [
//     item.product_name || 'Product',
//     `₹${parseFloat(item.price || 0).toFixed(2)}`,
//     String(item.qty || 1),
//     `₹${parseFloat(item.total_price || 0).toFixed(2)}`,
//   ]);

//   autoTable(doc, {
//     startY: yPos,
//     head: tableHeaders,
//     body: tableData,
//     theme: 'grid',
//     // ✅ Disable row numbering
//     showHead: 'everyPage',
//     headStyles: {
//       fillColor: primaryGreen,
//       textColor: [255, 255, 255],
//       fontSize: 8,
//       fontStyle: 'bold',
//       halign: 'center',
//     },
//     bodyStyles: {
//       fontSize: 8,
//       textColor: darkGray,
//     },
//     columnStyles: {
//       0: { cellWidth: 'auto', halign: 'left' },
//       1: { cellWidth: 30, halign: 'right' },
//       2: { cellWidth: 18, halign: 'center' },
//       3: { cellWidth: 32, halign: 'right' },
//     },
//     alternateRowStyles: {
//       fillColor: [248, 250, 252],
//     },
//     margin: { left: margin, right: margin },
//     // ✅ Remove any default row numbering
//     rowPageBreak: 'avoid',
//     didParseCell: function(data) {
//       // Prevent any automatic numbering
//       if (data.column.index === 0) {
//         data.cell.styles.halign = 'left';
//       }
//     },
//   });

//   // ── Totals Section ────────────────────────────────────────────────
//   const finalY = doc.lastAutoTable.finalY + 8;
//   const totalsLabelX = pageWidth - 70;
//   const totalsValueX = pageWidth - margin;

//   const totalAmount = parseFloat(order.total_amount || 0);
//   const deliveryCharge = parseFloat(order.delivery_charge || 0);
//   const deliveryBoyCharge = parseFloat(order.deliveryboy_charge || 0);
//   const extraCharge = parseFloat(order.extra_charge || 0);
//   const finalAmount = parseFloat(order.final_amount || 0);

//   let ty = finalY;
//   const lineHeight = 5;

//   doc.setFontSize(9);
  
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  
//   doc.text('Subtotal', totalsLabelX, ty);
//   doc.text(`₹${totalAmount.toFixed(2)}`, totalsValueX, ty, { align: 'right' });
//   ty += lineHeight;

//   doc.text('Delivery Charge', totalsLabelX, ty);
//   doc.text(`₹${deliveryCharge.toFixed(2)}`, totalsValueX, ty, { align: 'right' });
//   ty += lineHeight;

//   doc.text('Delivery Boy Charge', totalsLabelX, ty);
//   doc.text(`₹${deliveryBoyCharge.toFixed(2)}`, totalsValueX, ty, { align: 'right' });
//   ty += lineHeight;

//   if (extraCharge > 0) {
//     doc.text('Extra Charge', totalsLabelX, ty);
//     doc.text(`₹${extraCharge.toFixed(2)}`, totalsValueX, ty, { align: 'right' });
//     ty += lineHeight;
//   }

//   ty += 1;
//   doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
//   doc.setLineWidth(0.6);
//   doc.line(totalsLabelX, ty, totalsValueX, ty);
//   ty += 4;

//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(11);
//   doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
//   doc.text('TOTAL', totalsLabelX, ty);
//   doc.text(`₹${finalAmount.toFixed(2)}`, totalsValueX, ty, { align: 'right' });

//   // ── OTP Section ───────────────────────────────────────────────────
//   if (order.otp) {
//     const otpY = Math.min(ty + 15, pageHeight - 45);
//     doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
//     doc.roundedRect(margin, otpY, pageWidth - (margin * 2), 18, 3, 3, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.text('DELIVERY OTP:', margin + 5, otpY + 7);
//     doc.setFontSize(13);
//     doc.text(order.otp, margin + 5, otpY + 15);
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Share this OTP with delivery partner', pageWidth - margin - 5, otpY + 10, { align: 'right' });
//   }

//   // ── Footer ────────────────────────────────────────────────────────
//   const footerY = pageHeight - 15;
//   doc.setDrawColor(220, 220, 220);
//   doc.setLineWidth(0.2);
//   doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

//   doc.setFontSize(7);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
//   doc.text('Thank you for your order! | For any queries, contact City Panel Support', pageWidth / 2, footerY, { align: 'center' });
//   doc.text('This is a computer-generated invoice', pageWidth / 2, footerY + 4, { align: 'center' });

//   // ── Open PDF & Download ──────────────────────────────────────────
//   const pdfBlob = doc.output('blob');
//   const pdfUrl = URL.createObjectURL(pdfBlob);
  
//   window.open(pdfUrl, '_blank');
  
//   const fileName = `Invoice_${order.order_no || 'order'}.pdf`;
//   const downloadLink = document.createElement('a');
//   downloadLink.href = pdfUrl;
//   downloadLink.download = fileName;
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
  
//   setTimeout(() => {
//     URL.revokeObjectURL(pdfUrl);
//   }, 5000);
// };

// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   return new Date(dateString).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// const getStatusText = (status) => {
//   const statusMap = {
//     0: 'Placed',
//     1: 'Confirmed',
//     2: 'Picked',
//     3: 'Out for Delivery',
//     4: 'In Transit',
//     5: 'Delivered',
//     6: 'Cancelled',
//   };
//   return statusMap[status] || 'Unknown';
// };

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (orderProfile) => {
  const order = orderProfile?.order;
  const items = orderProfile?.items || [];
  
  if (!order) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryGreen = [20, 83, 45];
  const darkGray = [31, 41, 55];
  const lightGray = [107, 114, 128];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Rupee symbol
  const rupeeSymbol = 'Rs. ';

  // ── Header ────────────────────────────────────────────────────────
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('City Panel', pageWidth / 2, 13, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Grocery Delivery Management | Lucknow, Uttar Pradesh', pageWidth / 2, 20, { align: 'center' });
  doc.text('support@citypanel.com | +91-XXXXXXXXXX', pageWidth / 2, 26, { align: 'center' });

  // ── INVOICE Title ─────────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('INVOICE', pageWidth / 2, 45, { align: 'center' });

  // ── Divider Line ──────────────────────────────────────────────────
  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, 50, pageWidth - margin, 50);

  // ── Bill To & Invoice Info Section ────────────────────────────────
  let yPos = 56;

  // Bill To Section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Bill To:', margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPos += 6;
  doc.text(order.customer_name || 'N/A', margin, yPos);
  yPos += 5;
  doc.text(order.customer_phone || order.phone || 'N/A', margin, yPos);
  yPos += 5;
  
  const fullAddress = `${order.address || ''}${order.landmark ? ', ' + order.landmark : ''} - ${order.pincode || ''}`;
  const addressLines = doc.splitTextToSize(fullAddress, 80);
  addressLines.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });

  // Invoice Details - Right Side
  const rightStartX = 115;
  const rightValueX = pageWidth - margin;
  let ry = 56;
  const lineSpacing = 5.5;

  const addInfoRow = (label, value) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(label, rightStartX, ry);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(value, rightValueX, ry, { align: 'right' });
    ry += lineSpacing;
  };

  addInfoRow('Invoice No:', order.order_no || 'N/A');
  addInfoRow('Date:', formatDate(order.created_at));
  addInfoRow('Payment:', (order.payment_method || 'COD').toUpperCase());
  addInfoRow('Status:', getStatusText(order.status));

  // ── Divider ───────────────────────────────────────────────────────
  yPos = Math.max(yPos, ry) + 5;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ── Order Items Table with autoTable ──────────────────────────────
  yPos += 8;
  
  const tableBody = items.map((item) => [
    item.product_name || 'Product',
    `${rupeeSymbol}${parseFloat(item.price || 0).toFixed(2)}`,
    String(item.qty || 1),
    `${rupeeSymbol}${parseFloat(item.total_price || 0).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Product', 'Price', 'Qty', 'Total']],
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      textColor: darkGray,
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 70, halign: 'left' },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 40, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
    tableLineColor: [226, 232, 240],
    tableLineWidth: 0.1,
  });

  // ── Totals Section - LEFT SIDE ────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;
  
  const totalAmount = parseFloat(order.total_amount || 0);
  const deliveryCharge = parseFloat(order.delivery_charge || 0);
  const deliveryBoyCharge = parseFloat(order.deliveryboy_charge || 0);
  const extraCharge = parseFloat(order.extra_charge || 0);
  const finalAmount = parseFloat(order.final_amount || 0);

  let ty = finalY;
  const totalsStartX = margin;
  const amountX = margin + 60;
  const lineGap = 5;

  // Subtotal
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Subtotal:', totalsStartX, ty);
  doc.text(`${rupeeSymbol}${totalAmount.toFixed(2)}`, amountX, ty);
  ty += lineGap;

  // Delivery Charge
  doc.text('Delivery Charge:', totalsStartX, ty);
  doc.text(`${rupeeSymbol}${deliveryCharge.toFixed(2)}`, amountX, ty);
  ty += lineGap;

  // Delivery Boy Charge
  doc.text('Delivery Boy Charge:', totalsStartX, ty);
  doc.text(`${rupeeSymbol}${deliveryBoyCharge.toFixed(2)}`, amountX, ty);
  ty += lineGap;

  // Extra Charge (agar hai toh)
  if (extraCharge > 0) {
    doc.text('Extra Charge:', totalsStartX, ty);
    doc.text(`${rupeeSymbol}${extraCharge.toFixed(2)}`, amountX, ty);
    ty += lineGap;
  }

  // Separator line
  ty += 2;
  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(0.5);
  doc.line(totalsStartX, ty, amountX + 30, ty);
  ty += 4;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text('Total Amount:', totalsStartX, ty);
  doc.text(`${rupeeSymbol}${finalAmount.toFixed(2)}`, amountX, ty);

  // ── Footer ────────────────────────────────────────────────────────
  const footerY = pageHeight - 15;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('Thank you for your order! | For any queries, contact City Panel Support', pageWidth / 2, footerY, { align: 'center' });
  doc.text('This is a computer-generated invoice', pageWidth / 2, footerY + 4, { align: 'center' });

  // ── Save & Download ──────────────────────────────────────────────
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  window.open(pdfUrl, '_blank');
  
  const fileName = `Invoice_${order.order_no || 'order'}.pdf`;
  const downloadLink = document.createElement('a');
  downloadLink.href = pdfUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 5000);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusText = (status) => {
  const statusMap = {
    0: 'Placed',
    1: 'Confirmed',
    2: 'Picked',
    3: 'Out for Delivery',
    4: 'In Transit',
    5: 'Delivered',
    6: 'Cancelled',
  };
  return statusMap[status] || 'Unknown';
};