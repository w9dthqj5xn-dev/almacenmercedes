import React, { useState, useEffect } from 'react';
import { db_obj, firestoreModule } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';
import Header from '../components/Header';
import '../styles/Dispatch.css';

const collection = firestoreModule.collection;
const getDocs = firestoreModule.getDocs;
const updateDoc = firestoreModule.updateDoc;
const doc = firestoreModule.doc;
const query = firestoreModule.query;
const where = firestoreModule.where;

const DispatchHome = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    console.log('[DispatchHome] Mounted, loading data...');
    loadInventory();
    loadHistory();
  }, []);

  const loadInventory = async () => {
    try {
      console.log('[DispatchHome] Loading inventory from DB...');
      const q = query(collection(db_obj, 'inventory'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('[DispatchHome] Loaded inventory:', data);
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      // Si falla, cargar de localStorage o mostrar mensaje
      setInventory([]);
    }
  };

  const loadHistory = async () => {
    try {
      const q = query(
        collection(db_obj, 'dispatch_history'),
        where('dispatchedBy', '==', user?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !destination) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const qty = parseInt(quantity);

      if (qty > selectedProduct.quantity) {
        alert(`No hay suficiente stock. Stock disponible: ${selectedProduct.quantity}`);
        return;
      }

      const newQuantity = selectedProduct.quantity - qty;

      // Actualizar inventario
      await updateDoc(doc(db_obj, 'inventory', selectedProduct.id), {
        quantity: newQuantity,
        dispatched: (selectedProduct.dispatched || 0) + qty
      });

      // Registrar en historial
      const historyEntry = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: qty,
        destination,
        dispatchedBy: user.uid,
        dispatchedByEmail: user.email,
        date: new Date().toISOString(),
        status: 'completed'
      };

      // Guardar en firestore o localStorage
      const history = JSON.parse(localStorage.getItem('dispatch_history') || '[]');
      history.push(historyEntry);
      localStorage.setItem('dispatch_history', JSON.stringify(history));

      alert('✅ Despacho registrado exitosamente');

      // Limpiar formulario
      setQuantity('');
      setDestination('');
      setSelectedProduct(null);

      // Recargar datos
      loadInventory();
      loadHistory();
    } catch (error) {
      console.error('Error despachando:', error);
      alert('Error al despachar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dispatch-page" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>📦 Panel de Despacho</h1>
        
        {/* Card Principal */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Despachar Mercancía</h2>
          
          <form onSubmit={handleDispatch}>
            {/* Selector de Producto */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Selecciona Producto:
              </label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = inventory.find(p => p.id === e.target.value);
                  setSelectedProduct(product);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
                required
              >
                <option value="">-- Selecciona un producto --</option>
                {inventory.length > 0 ? (
                  inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (SKU: {item.sku}) - Stock: {item.quantity}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay productos disponibles</option>
                )}
              </select>
            </div>

            {/* Detalles del Producto */}
            {selectedProduct && (
              <div style={{ 
                background: '#f9f9f9', 
                border: '2px solid #667eea', 
                padding: '15px', 
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                <p><strong>Producto:</strong> {selectedProduct.name}</p>
                <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                <p><strong>Stock Disponible:</strong> {selectedProduct.quantity}</p>
                {selectedProduct.description && <p><strong>Descripción:</strong> {selectedProduct.description}</p>}
              </div>
            )}

            {/* Cantidad */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Cantidad a Despachar:
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="1"
                max={selectedProduct?.quantity || 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            {/* Destino */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Destino/Lugar de Envío:
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ej: Almacén 2, Tienda Centro, Cliente XYZ"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            {/* Botón Despachar */}
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '14px',
                background: selectedProduct ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: selectedProduct ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              disabled={loading || !selectedProduct}
            >
              <Send size={20} />
              {loading ? 'Despachando...' : 'Despachar'}
            </button>
          </form>
        </div>

        {/* Historial */}
        {history.length > 0 && (
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>📋 Historial de Despachos</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((item, idx) => (
                <div key={idx} style={{ 
                  padding: '12px', 
                  background: '#f9f9f9', 
                  borderLeft: '4px solid #28a745',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{item.productName}</strong>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(item.date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    <p style={{ margin: '4px 0' }}>SKU: {item.sku}</p>
                    <p style={{ margin: '4px 0', fontWeight: 600, color: '#28a745' }}>Cantidad: {item.quantity}</p>
                    <p style={{ margin: '4px 0' }}>Destino: {item.destination}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>📊 Resumen del Inventario</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Total Productos</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 700 }}>{inventory.length}</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Total en Stock</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 700 }}>
                {inventory.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Total Despachado</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 700 }}>
                {inventory.reduce((sum, item) => sum + (item.dispatched || 0), 0)}
              </p>
            </div>
          </div>

          {inventory.length > 0 && (
            <div>
              <h4 style={{ marginTop: 0, color: '#333' }}>📦 Stock Rápido</h4>
              {inventory.slice(0, 5).map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0', 
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '12px'
                }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 600, color: '#667eea' }}>{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchHome;
