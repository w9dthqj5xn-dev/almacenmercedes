import React, { useState, useEffect } from 'react';
import { isLocalMode, rtDatabase_obj } from '../config/firebase';
import { ref as dbRef, get, set, update, remove } from 'firebase/database';
import { Plus, Trash2, Edit2, Download, Users, Truck } from 'lucide-react';
import Header from '../components/Header';
import SearchFilters from '../components/SearchFilters';
import UserManagement from '../components/UserManagement';
import DispatchedEquipment from '../components/DispatchedEquipment';
import { exportToPDF, exportToCSV } from '../utils/exportData';
import '../styles/Admin.css';

// Generar SKU automático basado en cantidad de productos existentes
const generateSKU = (existingCount) => {
  const count = String(existingCount + 1).padStart(4, '0');
  return `SKU-${count}`;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    sku: ''
  });
  const [loading, setLoading] = useState(false);

  // Cargar inventario
  useEffect(() => {
    loadInventory();
  }, []);

  // Actualizar filtered cuando cambia inventory
  useEffect(() => {
    setFilteredInventory(inventory);
  }, [inventory]);

  const loadInventory = async () => {
    try {
      if (isLocalMode) {
        // Modo local: cargar del localStorage
        const mockInventory = JSON.parse(localStorage.getItem('mock_inventory') || '{}');
        const data = Object.entries(mockInventory).map(([id, item]) => ({
          id,
          ...item
        }));
        setInventory(data);
      } else {
        // Modo Firebase: cargar del Realtime Database
        const productsRef = dbRef(rtDatabase_obj, 'products');
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const productsData = snapshot.val();
          const data = Object.entries(productsData).map(([id, item]) => ({
            id,
            ...item
          }));
          setInventory(data);
        } else {
          setInventory([]);
        }
      }
    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validar campos requeridos
      if (!formData.name || !formData.quantity) {
        alert('Please complete product name and quantity');
        setLoading(false);
        return;
      }

      // Generar ID para el producto
      const productId = editingId || `product-${Date.now()}`;

      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        sku: formData.sku.trim() || `SKU-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
        dispatched: 0,
        created: editingId ? inventory.find(i => i.id === editingId)?.created : new Date().toISOString()
      };

      console.log('💾 Saving product:', data);

      if (isLocalMode) {
        // Modo local: guardar en localStorage
        const mockInventory = JSON.parse(localStorage.getItem('mock_inventory') || '{}');
        if (editingId) {
          mockInventory[editingId] = { ...mockInventory[editingId], ...data };
          console.log('✅ Product updated in localStorage');
        } else {
          mockInventory[productId] = data;
          console.log('✅ New product saved in localStorage:', productId);
        }
        localStorage.setItem('mock_inventory', JSON.stringify(mockInventory));
      } else {
        // Modo Firebase: guardar en Realtime Database
        try {
          if (editingId) {
            const productRef = dbRef(rtDatabase_obj, `products/${editingId}`);
            await update(productRef, data);
            console.log('✅ Product updated in Firebase');
          } else {
            const newProductRef = dbRef(rtDatabase_obj, `products/${productId}`);
            await set(newProductRef, data);
            console.log('✅ New product created in Firebase:', productId);
          }
        } catch (dbError) {
          console.error('❌ Database error:', dbError);
          alert(`Error saving to database: ${dbError.message}`);
          setLoading(false);
          return;
        }
      }

      // Limpiar formulario
      setFormData({ name: '', description: '', quantity: '', sku: '' });
      setEditingId(null);
      setShowForm(false);
      
      // Recargar inventario
      await loadInventory();
      
      // Mostrar confirmación
      alert(`✅ Product saved successfully!`);
    } catch (error) {
      console.error('❌ General error saving product:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      sku: item.sku
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        if (isLocalMode) {
          // Modo local: eliminar del localStorage
          const mockInventory = JSON.parse(localStorage.getItem('mock_inventory') || '{}');
          delete mockInventory[id];
          localStorage.setItem('mock_inventory', JSON.stringify(mockInventory));
        } else {
          // Modo Firebase: eliminar del Realtime Database
          const productRef = dbRef(rtDatabase_obj, `products/${id}`);
          await remove(productRef);
        }
        loadInventory();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-container">
        <div className="admin-header">
          <h2>📊 Admin Dashboard</h2>
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              📦 Inventory
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              Users
            </button>
            <button
              className={`tab-btn ${activeTab === 'dispatches' ? 'active' : ''}`}
              onClick={() => setActiveTab('dispatches')}
            >
              <Truck size={18} />
              Dispatched Equipment
            </button>
          </div>
        </div>
        <React.Fragment>
        {activeTab === 'inventory' ? (
          <div className="tab-content">
            <div style={{ marginBottom: '20px' }}>
              <button 
                className="btn-primary"
                onClick={() => {
                  const newShowForm = !showForm;
                  setShowForm(newShowForm);
                  if (newShowForm) {
                    // Al abrir el formulario, generar SKU automático
                    const newSku = generateSKU(inventory.length);
                    setFormData({ 
                      name: '', 
                      description: '', 
                      quantity: '', 
                      sku: newSku
                    });
                  } else {
                    setEditingId(null);
                    setFormData({ name: '', description: '', quantity: '', sku: '' });
                  }
                }}
              >
                <Plus size={20} />
                New Product
              </button>
            </div>

            {showForm && (
          <div className="form-section">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g: USB Cable"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SKU (Auto-generated) *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    readOnly
                    placeholder="SKU-001"
                    title="SKU is auto-generated"
                    required
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed product description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', quantity: '', sku: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <SearchFilters inventory={inventory} onFilter={setFilteredInventory} />

        <div className="inventory-section">
          <div className="inventory-header">
            <h3>📋 Inventory ({filteredInventory.length})</h3>
            <div className="inventory-actions">
              <button 
                className="btn-export-pdf"
                onClick={() => exportToPDF(filteredInventory, 'inventory')}
                title="Download inventory as PDF"
              >
                <Download size={18} />
                PDF
              </button>
              <button 
                className="btn-export-csv"
                onClick={() => exportToCSV(filteredInventory, 'inventory')}
                title="Download inventory as CSV"
              >
                <Download size={18} />
                CSV
              </button>
            </div>
          </div>
          
          {filteredInventory.length === 0 ? (
            <div className="empty-state">
              <p>No products registered</p>
            </div>
          ) : (
            <div className="inventory-grid">
              {filteredInventory.map(item => (
                <div key={item.id} className="product-card">
                  <div className="product-info">
                    <h4>{item.name}</h4>
                    <p className="sku">SKU: {item.sku}</p>
                    <p className="description">{item.description}</p>
                    <div className="stock-info">
                      <span className="quantity">Stock: <strong>{item.quantity}</strong></span>
                      <span className="dispatched">Dispatched: <strong>{item.dispatched || 0}</strong></span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        ) : activeTab === 'users' ? (
          <div className="tab-content">
            <UserManagement />
          </div>
        ) : (
          <div className="tab-content">
            <DispatchedEquipment />
          </div>
        )}
        </React.Fragment>
      </div>
    </div>
  );
};

export default AdminDashboard;
