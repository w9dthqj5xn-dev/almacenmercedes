import React, { useState } from 'react';
import { Trash2, Download } from 'lucide-react';
import '../styles/DispatchHistory.css';

const DispatchHistory = ({ history, onDelete }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, product, quantity

  // Filtrar historial
  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date();
      const itemDate = item.date?.toDate?.() || new Date(item.date);
      return itemDate.toDateString() === today.toDateString();
    }
    if (filter === 'week') {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const itemDate = item.date?.toDate?.() || new Date(item.date);
      return itemDate >= weekAgo;
    }
    return true;
  });

  // Ordenar historial
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = a.date?.toDate?.() || new Date(a.date);
      const dateB = b.date?.toDate?.() || new Date(b.date);
      return dateB - dateA;
    }
    if (sortBy === 'product') {
      return a.productName.localeCompare(b.productName);
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  const formatDate = (date) => {
    const d = date?.toDate?.() || new Date(date);
    return d.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Producto', 'SKU', 'Cantidad', 'Destino', 'Fecha', 'Despachado por'];
    const rows = sortedHistory.map(item => [
      item.productName,
      item.sku,
      item.quantity,
      item.destination,
      formatDate(item.date),
      item.dispatchedEmail || 'Unknown'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-despachos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="dispatch-history-container">
      <div className="history-header">
        <h3>📋 Dispatch History ({sortedHistory.length})</h3>
        <button className="btn-export" onClick={exportToCSV} title="Download as CSV">
          <Download size={18} />
          Export
        </button>
      </div>

      <div className="history-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All dispatches</option>
          <option value="today">Today</option>
          <option value="week">Last week</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="date">Sort by: Date</option>
          <option value="product">Sort by: Product</option>
          <option value="quantity">Sort by: Quantity</option>
        </select>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="empty-state">
          <p>No dispatches registered in this period</p>
        </div>
      ) : (
        <div className="history-list">
          {sortedHistory.map(item => (
            <div key={item.id} className="history-item">
              <div className="item-left">
                <div className="item-main">
                  <h4>{item.productName}</h4>
                  <p className="sku">SKU: {item.sku}</p>
                </div>
                <div className="item-date">
                  {formatDate(item.date)}
                </div>
              </div>

              <div className="item-middle">
                <div className="detail-box">
                  <span className="label">Cantidad</span>
                  <span className="value quantity">{item.quantity} unt.</span>
                </div>
                <div className="detail-box">
                  <span className="label">Destino</span>
                  <span className="value">{item.destination}</span>
                </div>
              </div>

              <div className="item-right">
                <div className="detail-box">
                  <span className="label">Despachado por</span>
                  <span className="value user">{item.dispatchedEmail?.split('@')[0] || 'Unknown'}</span>
                </div>
                <button
                  className="btn-delete-history"
                  onClick={() => onDelete && onDelete(item.id)}
                  title="Eliminar este registro"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DispatchHistory;
