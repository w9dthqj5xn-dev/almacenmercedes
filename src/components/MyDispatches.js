import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref as dbRef, get } from 'firebase/database';
import { rtDatabase_obj, isLocalMode } from '../config/firebase';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/MyDispatches.css';

const MyDispatches = () => {
  const { user } = useAuth();
  const [myDispatches, setMyDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadMyDispatches();
  }, [user]);

  const loadMyDispatches = async () => {
    try {
      setLoading(true);
      let allDispatches = {};

      if (isLocalMode) {
        const mockFirestore = JSON.parse(localStorage.getItem('mock_firestore') || '{}');
        allDispatches = mockFirestore.dispatch_history || {};
      } else {
        const dispatchesRef = dbRef(rtDatabase_obj, 'dispatches');
        const snapshot = await get(dispatchesRef);
        if (snapshot.exists()) {
          allDispatches = snapshot.val();
        }
      }

      // Filtrar solo los despachos del usuario actual
      const filtered = Object.entries(allDispatches)
        .filter(([_, dispatch]) => {
          return dispatch && (dispatch.userEmail === user?.email || dispatch.dispatchedEmail === user?.email);
        })
        .map(([id, dispatch]) => ({
          id,
          ...dispatch
        }))
        .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));

      setMyDispatches(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error loading my dispatches:', error);
      setLoading(false);
    }
  };

  const toggleExpandDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const groupDispatchesByDate = () => {
    const grouped = {};
    myDispatches.forEach(dispatch => {
      const date = dispatch.date || new Date(dispatch.createdAt || dispatch.timestamp).toLocaleDateString('en-US');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(dispatch);
    });

    return Object.keys(grouped)
      .sort((a, b) => {
        try {
          return new Date(b) - new Date(a);
        } catch {
          return 0;
        }
      })
      .reduce((acc, date) => {
        acc[date] = grouped[date];
        return acc;
      }, {});
  };

  const calculateStats = () => {
    return {
      totalDispatches: myDispatches.length,
      totalQuantity: myDispatches.reduce((sum, d) => sum + (d.quantity || 0), 0),
      totalRevenue: myDispatches.reduce((sum, d) => sum + (parseFloat(d.cost) || 0), 0),
      totalDays: Object.keys(groupDispatchesByDate()).length
    };
  };

  const exportMyDispatches = () => {
    if (myDispatches.length === 0) {
      alert('No dispatches to export');
      return;
    }

    const data = myDispatches.map(d => ({
      'Dispatch ID': d.id,
      'Product': d.productName || 'Unknown',
      'SKU': d.productSku || '-',
      'Quantity': d.quantity,
      'Recipient': d.recipientName || d.destination || '-',
      'Cost': `$${parseFloat(d.cost || 0).toFixed(2)}`,
      'Date': d.date || new Date(d.createdAt || d.timestamp).toLocaleDateString('en-US'),
      'Time': d.time || new Date(d.createdAt || d.timestamp).toLocaleTimeString('en-US')
    }));

    // Create CSV
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    // Download
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-dispatches-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="my-dispatches">Loading your dispatch history...</div>;
  }

  const stats = calculateStats();
  const groupedDispatches = groupDispatchesByDate();

  return (
    <div className="my-dispatches">
      <div className="my-dispatches-header">
        <h3>📦 My Dispatch History</h3>
        <div className="my-dispatches-stats">
          <div className="stat">
            <span className="label">Total Dispatches</span>
            <span className="value">{stats.totalDispatches}</span>
          </div>
          <div className="stat">
            <span className="label">Total Units</span>
            <span className="value">{stats.totalQuantity}</span>
          </div>
          <div className="stat">
            <span className="label">Total Revenue</span>
            <span className="value">${stats.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="label">Active Days</span>
            <span className="value">{stats.totalDays}</span>
          </div>
        </div>
      </div>

      <div className="my-dispatches-list">
        {Object.keys(groupedDispatches).length === 0 ? (
          <div className="empty-state">
            <p>You haven't made any dispatches yet</p>
            <p>Start creating dispatches from the form above</p>
          </div>
        ) : (
          <>
            {myDispatches.length > 0 && (
              <button className="btn-export" onClick={exportMyDispatches}>
                <Download size={18} />
                Export CSV
              </button>
            )}
            {Object.keys(groupedDispatches).map(date => {
              const dayDispatches = groupedDispatches[date];
              const dayTotal = dayDispatches.reduce((sum, d) => sum + (parseFloat(d.cost) || 0), 0);
              const isExpanded = expandedDates[date];

              return (
                <div key={date} className="dispatch-day">
                  <div
                    className="day-header"
                    onClick={() => toggleExpandDate(date)}
                  >
                    <div className="day-info">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      <span className="date">{date}</span>
                    </div>
                    <div className="day-summary">
                      <span>
                        <span className="count">{dayDispatches.length} dispatches</span>
                        <span className="total">${dayTotal.toFixed(2)}</span>
                      </span>
                    </div>
                </div>

                  {isExpanded && (
                    <div className="day-details">
                      <table className="dispatches-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Recipient</th>
                            <th>Cost</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayDispatches.map(dispatch => (
                            <tr key={dispatch.id}>
                              <td className="product-name">
                                <span className="sku">{dispatch.productSku}</span>
                                {dispatch.productName}
                              </td>
                              <td className="quantity">{dispatch.quantity}</td>
                              <td>{dispatch.recipientName || dispatch.destination || '-'}</td>
                              <td className="cost">${parseFloat(dispatch.cost || 0).toFixed(2)}</td>
                              <td className="time">
                                {dispatch.time || new Date(dispatch.createdAt || dispatch.timestamp).toLocaleTimeString('en-US')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default MyDispatches;
