import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export const exportToPDF = (inventory, filename = 'inventario') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Título
    doc.setFontSize(18);
    doc.text('📦 INVENTARIO DE ALMACÉN', pageWidth / 2, 15, { align: 'center' });

    // Fecha
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 22, { align: 'center' });

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
      head: [['Producto', 'SKU', 'Descripción', 'Stock', 'Despachado', 'Total']],
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
    doc.text(`Total Productos: ${inventory.length}`, 14, finalY);
    doc.text(`Stock Total: ${totalStock}`, 14, finalY + 6);
    doc.text(`Total Despachado: ${totalDispatched}`, 14, finalY + 12);

    // Guardar
    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generando PDF:', error);
    return false;
  }
};

export const exportToCSV = (inventory, filename = 'inventario') => {
  try {
    const data = inventory.map(item => ({
      'Producto': item.name,
      'SKU': item.sku,
      'Descripción': item.description || '-',
      'Stock': item.quantity,
      'Despachado': item.dispatched || 0,
      'Total': item.quantity + (item.dispatched || 0),
      'Fecha Creación': item.created?.toDate?.()?.toLocaleDateString('es-ES') || '-',
      'Última Actualización': item.lastUpdated?.toDate?.()?.toLocaleDateString('es-ES') || '-'
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
    console.error('Error generando CSV:', error);
    return false;
  }
};

export const exportDispatchHistoryToPDF = (history, filename = 'historial-despachos') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(18);
    doc.text('📋 HISTORIAL DE DESPACHOS', pageWidth / 2, 15, { align: 'center' });

    // Fecha
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 22, { align: 'center' });

    // Tabla
    const tableData = history.map(item => [
      item.productName,
      item.sku,
      item.quantity,
      item.destination,
      item.date?.toDate?.()?.toLocaleDateString('es-ES') || new Date(item.date).toLocaleDateString('es-ES'),
      item.dispatchedEmail?.split('@')[0] || 'Unknown'
    ]);

    doc.autoTable({
      head: [['Producto', 'SKU', 'Cantidad', 'Destino', 'Fecha', 'Despachado por']],
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
    console.error('Error generando PDF de historial:', error);
    return false;
  }
};

export const exportDispatchHistoryToCSV = (history, filename = 'historial-despachos') => {
  try {
    const data = history.map(item => ({
      'Producto': item.productName,
      'SKU': item.sku,
      'Cantidad': item.quantity,
      'Destino': item.destination,
      'Fecha': item.date?.toDate?.()?.toLocaleDateString('es-ES') || new Date(item.date).toLocaleDateString('es-ES'),
      'Hora': item.date?.toDate?.()?.toLocaleTimeString('es-ES') || new Date(item.date).toLocaleTimeString('es-ES'),
      'Despachado por': item.dispatchedEmail || 'Unknown',
      'Notas': item.notes || '-'
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
    console.error('Error generando CSV de historial:', error);
    return false;
  }
};
