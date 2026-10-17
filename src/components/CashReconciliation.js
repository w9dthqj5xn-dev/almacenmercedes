import React, { useState, useEffect } from 'react';
import { ref as dbRef, get, remove, update } from 'firebase/database';
import { rtDatabase_obj, isLocalMode } from '../config/firebase';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/CashReconciliation.css';

const CashReconciliation = () => {
  const [reconciliationData, setReconciliationData] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDispatchesByDate();
  }, []);

  const loadDispatchesByDate = async () => {
    try {
      setLoading(true);
      let dispatchData = {};

      if (isLocalMode) {
        const mockFirestore = JSON.parse(localStorage.getItem('mock_firestore') || '{}');
        dispatchData = mockFirestore.dispatch_history || {};
        
        // Si no hay datos en dispatch_history, intentar cargar de dispatches
        if (Object.keys(dispatchData).length === 0) {
          const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
          // Buscar despachos en usuarios
          Object.values(mockUsers).forEach(user => {
            if (user.dispatches && Array.isArray(user.dispatches)) {
              user.dispatches.forEach(dispatch => {
                dispatchData[dispatch.id] = dispatch;
              });
            }
          });
        }
      } else {
        const dispatchRef = dbRef(rtDatabase_obj, 'dispatches');
        const snapshot = await get(dispatchRef);
        if (snapshot.exists()) {
          dispatchData = snapshot.val();
        }
      }

      // Agrupar despachos por fecha
      const grouped = {};
      Object.entries(dispatchData).forEach(([id, dispatch]) => {
        if (!dispatch) return;
        
        // Usar la fecha que ya está formateada o crear una nueva
        let dateStr = dispatch.date;
        if (!dateStr) {
          dateStr = new Date(dispatch.createdAt || dispatch.timestamp).toLocaleDateString('en-US');
        }
        
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push({ id, ...dispatch });
      });

      // Ordenar fechas (más recientes primero) y despachos por hora
      const sorted = Object.keys(grouped)
        .sort((a, b) => {
          try {
            return new Date(b) - new Date(a);
          } catch {
            return 0;
          }
        })
        .reduce((acc, date) => {
          acc[date] = grouped[date].sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });
          return acc;
        }, {});

      setReconciliationData(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dispatches:', error);
      setMessage('❌ Error loading cash reconciliation data');
      setLoading(false);
    }
  };

  const calculateDailyTotals = (dispatches) => {
    return {
      quantity: dispatches.reduce((sum, d) => sum + (d.quantity || 0), 0),
      cost: dispatches.reduce((sum, d) => sum + (parseFloat(d.cost) || 0), 0),
      count: dispatches.length
    };
  };

  const toggleExpandDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const handleDeleteDispatch = async (dispatchId, dispatchData) => {
    if (!window.confirm('Are you sure you want to delete this dispatch? This action will remove it from the user\'s record as well.')) {
      return;
    }

    try {
      if (isLocalMode) {
        // Modo local: eliminar de localStorage
        const mockFirestore = JSON.parse(localStorage.getItem('mock_firestore') || '{}');
        if (mockFirestore.dispatch_history && mockFirestore.dispatch_history[dispatchId]) {
          delete mockFirestore.dispatch_history[dispatchId];
          localStorage.setItem('mock_firestore', JSON.stringify(mockFirestore));
        }

        // También eliminar del usuario si está guardado ahí
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
        Object.values(mockUsers).forEach(user => {
          if (user.dispatches && Array.isArray(user.dispatches)) {
            user.dispatches = user.dispatches.filter(d => d.id !== dispatchId);
          }
        });
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));

        // Restaurar cantidad en inventario
        if (dispatchData.productId) {
          const mockInventory = JSON.parse(localStorage.getItem('mock_inventory') || '{}');
          if (mockInventory[dispatchData.productId]) {
            const product = mockInventory[dispatchData.productId];
            product.quantity = (product.quantity || 0) + (dispatchData.quantity || 0);
            product.dispatched = (product.dispatched || 0) - (dispatchData.quantity || 0);
            localStorage.setItem('mock_inventory', JSON.stringify(mockInventory));
          }
        }
      } else {
        // Modo Firebase
        const dispatchRef = dbRef(rtDatabase_obj, `dispatches/${dispatchId}`);
        await remove(dispatchRef);

        // Restaurar cantidad en inventario
        if (dispatchData.productId) {
          const productRef = dbRef(rtDatabase_obj, `products/${dispatchData.productId}`);
          const productSnapshot = await get(productRef);
          if (productSnapshot.exists()) {
            const product = productSnapshot.val();
            await update(productRef, {
              quantity: (product.quantity || 0) + (dispatchData.quantity || 0),
              dispatched: (product.dispatched || 0) - (dispatchData.quantity || 0)
            });
          }
        }
      }

      setMessage('✅ Dispatch deleted successfully');
      await loadDispatchesByDate();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting dispatch:', error);
      setMessage('❌ Error deleting dispatch');
    }
  };

  if (loading) {
    return <div className="cash-reconciliation">Loading cash reconciliation data...</div>;
  }

  const allDates = Object.keys(reconciliationData);
  const totalRevenue = Object.values(reconciliationData).reduce((sum, dispatches) => {
    return sum + dispatches.reduce((daySum, d) => daySum + (parseFloat(d.cost) || 0), 0);
  }, 0);

  return (
    <div className="cash-reconciliation">
      <div className="reconciliation-header">
        <h3>💰 Daily Cash Reconciliation</h3>
        <div className="reconciliation-stats">
          <div className="stat">
            <span className="label">Total Days:</span>
            <span className="value">{allDates.length}</span>
          </div>
          <div className="stat">
            <span className="label">Total Revenue:</span>
            <span className="value">${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="label">Total Dispatches:</span>
            <span className="value">{Object.values(reconciliationData).reduce((sum, d) => sum + d.length, 0)}</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="reconciliation-list">
        {allDates.length === 0 ? (
          <div className="empty-state">
            <p>No dispatch records found</p>
          </div>
        ) : (
          allDates.map(date => {
            const dayDispatches = reconciliationData[date];
            const dailyTotals = calculateDailyTotals(dayDispatches);
            const isExpanded = expandedDates[date];

            return (
              <div key={date} className="reconciliation-day">
                <div
                  className="day-header"
                  onClick={() => toggleExpandDate(date)}
                >
                  <div className="day-title">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="date">{date}</span>
                  </div>
                  <div className="day-summary">
                    <span className="count">{dailyTotals.count} dispatches</span>
                    <span className="quantity">{dailyTotals.quantity} units</span>
                    <span className="total">${dailyTotals.cost.toFixed(2)}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="day-details">
                    <table className="dispatches-table">
                      <thead>
                        <tr>
                          <th>Dispatch ID</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Recipient</th>
                          <th>Cost</th>
                          <th>User</th>
                          <th>Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayDispatches.map(dispatch => (
                          <tr key={dispatch.id}>
                            <td className="dispatch-id">{dispatch.id}</td>
                            <td>{dispatch.productName || 'Unknown'}</td>
                            <td className="quantity">{dispatch.quantity}</td>
                            <td>{dispatch.recipientName || dispatch.destination || '-'}</td>
                            <td className="cost">${parseFloat(dispatch.cost || 0).toFixed(2)}</td>
                            <td>{dispatch.userEmail?.split('@')[0] || 'Unknown'}</td>
                            <td className="time">
                              {dispatch.time || new Date(dispatch.createdAt || dispatch.timestamp).toLocaleTimeString('en-US')}
                            </td>
                            <td>
                              <button
                                className="btn-delete"
                                onClick={() => handleDeleteDispatch(dispatch.id, dispatch)}
                                title="Delete this dispatch"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CashReconciliation;
