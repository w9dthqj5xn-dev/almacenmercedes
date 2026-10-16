import React, { useState, useEffect } from 'react';
import { db_obj, storage_obj, firestoreModule, isLocalMode } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Edit2, Image as ImageIcon, Download, Users } from 'lucide-react';
import Header from '../components/Header';
import PhotoGallery from '../components/PhotoGallery';
import SearchFilters from '../components/SearchFilters';
import UserManagement from '../components/UserManagement';
import { exportToPDF, exportToCSV } from '../utils/exportData';
import '../styles/Admin.css';

// Usar funciones según modo local o real
const collection = firestoreModule.collection;
const query = firestoreModule.query;
const getDocs = firestoreModule.getDocs;
const updateDoc = firestoreModule.updateDoc;
const doc = firestoreModule.doc;
const deleteDoc = firestoreModule.deleteDoc;

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
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedProductPhotos, setSelectedProductPhotos] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    sku: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState([]);

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
      const q = query(collection(db_obj, 'inventory'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInventory(data);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  };

  // Comprimir imagen para ahorrar espacio en localStorage
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Limitar tamaño máximo a 800px (mantener calidad pero reducir tamaño)
          const maxSize = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimir a JPEG con calidad 70%
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Comprimir todas las fotos
    const compressedPreviews = files.map(file => compressImage(file));

    Promise.all(compressedPreviews).then(previews => {
      setPhotoPreview(prev => [...prev, ...previews]);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files]
      }));
    });
  };

  const removePhoto = (index) => {
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Subir fotos a Storage (solo en modo real)
      const photoUrls = [];
      
      if (isLocalMode) {
        // En modo local, usar las data URLs de preview
        photoUrls.push(...photoPreview);
      } else if (storage_obj) {
        // En modo real, subir a Firebase Storage
        for (const photo of formData.photos) {
          const storageRef = ref(storage_obj, `inventory/${Date.now()}_${photo.name}`);
          await uploadBytes(storageRef, photo);
          const url = await getDownloadURL(storageRef);
          photoUrls.push(url);
        }
      }

      const data = {
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity),
        sku: formData.sku,
        photos: photoUrls,
        lastUpdated: new Date(),
        dispatched: 0,
        created: editingId ? new Date(inventory.find(i => i.id === editingId)?.created) : new Date()
      };

      if (editingId) {
        await updateDoc(doc(db_obj, 'inventory', editingId), data);
      } else {
        // En modo mock, usar setDoc en lugar de addDoc
        if (isLocalMode) {
          const newId = `product-${Date.now()}`;
          await firestoreModule.setDoc(doc(db_obj, 'inventory', newId), data);
        }
      }

      setFormData({ name: '', description: '', quantity: '', sku: '', photos: [] });
      setPhotoPreview([]);
      setEditingId(null);
      setShowForm(false);
      loadInventory();
    } catch (error) {
      console.error('Error guardando producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      sku: item.sku,
      photos: []
    });
    setPhotoPreview(item.photos || []);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteDoc(doc(db_obj, 'inventory', id));
        loadInventory();
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-container">
        <div className="admin-header">
          <h2>📊 Dashboard Administrativo</h2>
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              📦 Inventario
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              Usuarios
            </button>
          </div>
        </div>

        {activeTab === 'inventory' && (
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
                      sku: newSku, 
                      photos: [] 
                    });
                  } else {
                    setEditingId(null);
                    setFormData({ name: '', description: '', quantity: '', sku: '', photos: [] });
                  }
                  setPhotoPreview([]);
                }}
              >
                <Plus size={20} />
                Nuevo Producto
              </button>
            </div>

            {showForm && (
          <div className="form-section">
            <h3>{editingId ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Cable USB"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SKU (Automático) *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="SKU-001"
                    title="El SKU se genera automáticamente, pero puedes modificarlo"
                    required
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción detallada del producto"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Cantidad en Stock *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group full">
                <span>Fotos del Producto (múltiples) - Opcional</span>
                <div className="photo-upload-wrapper">
                  <label className="photo-upload" htmlFor="photo-input">
                    <input
                      id="photo-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-area">
                      <ImageIcon size={32} />
                      <span>Haz click para seleccionar fotos</span>
                      <small>o arrastra archivos aquí</small>
                    </div>
                  </label>
                </div>
              </div>

              {photoPreview.length > 0 && (
                <div className="photo-preview">
                  <h4>Fotos Seleccionadas ({photoPreview.length}):</h4>
                  <div className="preview-grid">
                    {photoPreview.map((preview, index) => (
                      <div key={index} className="preview-item">
                        <img src={preview} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="remove-btn"
                          title="Eliminar esta foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', quantity: '', sku: '', photos: [] });
                    setPhotoPreview([]);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <SearchFilters inventory={inventory} onFilter={setFilteredInventory} />

        <div className="inventory-section">
          <div className="inventory-header">
            <h3>📋 Inventario ({filteredInventory.length})</h3>
            <div className="inventory-actions">
              <button 
                className="btn-export-pdf"
                onClick={() => exportToPDF(filteredInventory, 'inventario')}
                title="Descargar inventario como PDF"
              >
                <Download size={18} />
                PDF
              </button>
              <button 
                className="btn-export-csv"
                onClick={() => exportToCSV(filteredInventory, 'inventario')}
                title="Descargar inventario como CSV"
              >
                <Download size={18} />
                CSV
              </button>
            </div>
          </div>
          
          {filteredInventory.length === 0 ? (
            <div className="empty-state">
              <p>No hay productos registrados</p>
            </div>
          ) : (
            <div className="inventory-grid">
              {filteredInventory.map(item => (
                <div key={item.id} className="product-card">
                  <div className="product-image">
                    {item.photos && item.photos.length > 0 ? (
                      <div 
                        className="image-wrapper clickable"
                        onClick={() => {
                          setSelectedProductPhotos(item.photos);
                          setSelectedProductName(item.name);
                          setGalleryOpen(true);
                        }}
                        title={item.photos.length > 1 ? 'Click para ver todas las fotos' : 'Foto del producto'}
                      >
                        <img src={item.photos[0]} alt={item.name} />
                        {item.photos.length > 1 && (
                          <div className="photo-badge">{item.photos.length}</div>
                        )}
                      </div>
                    ) : (
                      <div className="no-image">Sin foto</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{item.name}</h4>
                    <p className="sku">SKU: {item.sku}</p>
                    <p className="description">{item.description}</p>
                    <div className="stock-info">
                      <span className="quantity">Stock: <strong>{item.quantity}</strong></span>
                      <span className="dispatched">Despachados: <strong>{item.dispatched || 0}</strong></span>
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
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <UserManagement />
          </div>
        )}

        <PhotoGallery
          photos={selectedProductPhotos}
          productName={selectedProductName}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
