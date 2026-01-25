import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Jimpitan } from '@/lib/supabase/types';
import { formatRupiah, formatShortDate } from './format';

/**
 * Export data to PDF format
 * @param data - Array of Jimpitan data to export
 * @param month - Month number (1-12)
 * @param year - Year number
 * @param appName - Application name for the header
 */
export const exportToPDF = (
  data: Jimpitan[],
  month: number,
  year: number,
  appName: string
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(appName, 14, 20);
  doc.setFontSize(12);
  doc.text(`Laporan Jimpitan - ${month}/${year}`, 14, 30);
  
  // Table data
  const tableData = data.map((item) => [
    formatShortDate(item.collection_date),
    formatRupiah(item.amount),
    item.notes || '-'
  ]);
  
  // Total
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  // Generate table
  autoTable(doc, {
    head: [['Tanggal', 'Jumlah', 'Catatan']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] },
    foot: [['', 'Total', formatRupiah(total)]],
    footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  // Save
  doc.save(`jimpitan-${month}-${year}.pdf`);
};

/**
 * Export data to Excel format
 * @param data - Array of Jimpitan data to export
 * @param month - Month number (1-12)
 * @param year - Year number
 */
export const exportToExcel = (
  data: Jimpitan[],
  month: number,
  year: number
) => {
  // Prepare data
  const worksheetData = [
    ['Laporan Jimpitan'],
    [`Periode: ${month}/${year}`],
    [],
    ['Tanggal', 'Jumlah', 'Catatan'],
    ...data.map((item) => [
      formatShortDate(item.collection_date),
      item.amount,
      item.notes || '-'
    ]),
    [],
    ['', 'Total', data.reduce((sum, item) => sum + item.amount, 0)]
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // Tanggal
    { wch: 20 }, // Jumlah
    { wch: 30 }  // Catatan
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Jimpitan');
  
  // Save
  XLSX.writeFile(wb, `jimpitan-${month}-${year}.xlsx`);
};

/**
 * Export weekly summary to PDF
 * @param weeklyData - Array of weekly data with week and amount
 * @param month - Month number (1-12)
 * @param year - Year number
 * @param appName - Application name for the header
 */
export const exportWeeklySummaryToPDF = (
  weeklyData: { week: string; amount: number }[],
  month: number,
  year: number,
  appName: string
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(appName, 14, 20);
  doc.setFontSize(12);
  doc.text(`Ringkasan Mingguan - ${month}/${year}`, 14, 30);
  
  // Table data
  const tableData = weeklyData.map((item) => [
    item.week,
    formatRupiah(item.amount)
  ]);
  
  // Total
  const total = weeklyData.reduce((sum, item) => sum + item.amount, 0);
  
  // Generate table
  autoTable(doc, {
    head: [['Minggu', 'Jumlah']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] },
    foot: [['Total', formatRupiah(total)]],
    footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  // Save
  doc.save(`ringkasan-mingguan-${month}-${year}.pdf`);
};

/**
 * Export weekly summary to Excel
 * @param weeklyData - Array of weekly data with week and amount
 * @param month - Month number (1-12)
 * @param year - Year number
 */
export const exportWeeklySummaryToExcel = (
  weeklyData: { week: string; amount: number }[],
  month: number,
  year: number
) => {
  // Prepare data
  const worksheetData = [
    ['Ringkasan Mingguan'],
    [`Periode: ${month}/${year}`],
    [],
    ['Minggu', 'Jumlah'],
    ...weeklyData.map((item) => [
      item.week,
      item.amount
    ]),
    [],
    ['Total', weeklyData.reduce((sum, item) => sum + item.amount, 0)]
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // Minggu
    { wch: 20 }  // Jumlah
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Ringkasan Mingguan');
  
  // Save
  XLSX.writeFile(wb, `ringkasan-mingguan-${month}-${year}.xlsx`);
};
