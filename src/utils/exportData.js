import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export const exportToPDF = (inventory, filename = 'inventory') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(18);
    doc.text('📦 WAREHOUSE INVENTORY', pageWidth / 2, 15, { align: 'center' });

    // Fecha
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, pageWidth / 2, 22, { align: 'center' });

    // Tabla de datos
    const tableData = inventory.map(item => [
      item.name,
      item.sku,
      item.description || '-',
      item.quantity,
      item.dispatched || 0,
      `${item.quantity + (item.dispatched || 0)}`
    ]);

    doc.autoTable({
      head: [['Product', 'SKU', 'Description', 'Stock', 'Dispatched', 'Total']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' }
      }
    });

    // Estadísticas al final
    const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const totalDispatched = inventory.reduce((sum, item) => sum + (item.dispatched || 0), 0);
    const finalY = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Products: ${inventory.length}`, 14, finalY);
    doc.text(`Total Stock: ${totalStock}`, 14, finalY + 6);
    doc.text(`Total Dispatched: ${totalDispatched}`, 14, finalY + 12);

    // Guardar
    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const exportToCSV = (inventory, filename = 'inventory') => {
  try {
    const data = inventory.map(item => ({
      'Product': item.name,
      'SKU': item.sku,
      'Description': item.description || '-',
      'Stock': item.quantity,
      'Dispatched': item.dispatched || 0,
      'Total': item.quantity + (item.dispatched || 0),
      'Created Date': item.created?.toDate?.()?.toLocaleDateString('en-US') || '-',
      'Last Updated': item.lastUpdated?.toDate?.()?.toLocaleDateString('en-US') || '-'
    }));

    const csv = Papa.unparse(data, {
      header: true,
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ',',
      newline: '\n',
      encoding: 'UTF-8'
    });

    // Agregar BOM para que Excel reconozca UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating CSV:', error);
    return false;
  }
};

export const exportDispatchHistoryToPDF = (history, filename = 'dispatch-history') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(18);
    doc.text('📋 DISPATCH HISTORY', pageWidth / 2, 15, { align: 'center' });

    // Fecha
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, pageWidth / 2, 22, { align: 'center' });

    // Tabla
    const tableData = history.map(item => [
      item.productName,
      item.sku,
      item.quantity,
      item.destination,
      item.date?.toDate?.()?.toLocaleDateString('en-US') || new Date(item.date).toLocaleDateString('en-US'),
      item.dispatchedEmail?.split('@')[0] || 'Unknown'
    ]);

    doc.autoTable({
      head: [['Product', 'SKU', 'Quantity', 'Destination', 'Date', 'Dispatched by']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [250, 112, 154],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 }
      }
    });

    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating dispatch history PDF:', error);
    return false;
  }
};

export const exportDispatchHistoryToCSV = (history, filename = 'dispatch-history') => {
  try {
    const data = history.map(item => ({
      'Product': item.productName,
      'SKU': item.sku,
      'Quantity': item.quantity,
      'Destination': item.destination,
      'Date': item.date?.toDate?.()?.toLocaleDateString('en-US') || new Date(item.date).toLocaleDateString('en-US'),
      'Time': item.date?.toDate?.()?.toLocaleTimeString('en-US') || new Date(item.date).toLocaleTimeString('en-US'),
      'Dispatched by': item.dispatchedEmail || 'Unknown',
      'Notes': item.notes || '-'
    }));

    const csv = Papa.unparse(data, {
      header: true,
      quotes: true,
      delimiter: ',',
      newline: '\n'
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating dispatch history CSV:', error);
    return false;
  }
};
