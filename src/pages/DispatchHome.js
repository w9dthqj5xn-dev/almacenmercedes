import React, { useState, useEffect } from 'react';
import { db_obj, firestoreModule } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const collection = firestoreModule.collection;
const getDocs = firestoreModule.getDocs;
const updateDoc = firestoreModule.updateDoc;
const doc = firestoreModule.doc;
const query = firestoreModule.query;

const DispatchHome = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [dispatchData, setDispatchData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
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
    }
  };

  const handleQuantityChange = (productId, value) => {
    setDispatchData({
      ...dispatchData,
      [productId]: {
        ...dispatchData[productId],
        quantity: value
      }
    });
  };

  const handleDestinationChange = (productId, value) => {
    setDispatchData({
      ...dispatchData,
      [productId]: {
        ...dispatchData[productId],
        destination: value
      }
    });
  };

  const handleDispatch = async (product) => {
    const data = dispatchData[product.id] || {};
    const quantity = parseInt(data.quantity) || 0;
    const destination = data.destination || '';

    if (!quantity || quantity <= 0) {
      alert('Ingresa una cantidad válida');
      return;
    }

    if (!destination) {
      alert('Ingresa un destino');
      return;
    }

    if (quantity > product.quantity) {
      alert(`No hay suficiente stock. Disponible: ${product.quantity}`);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Actualizar stock en Firebase
      const newQuantity = product.quantity - quantity;
      await updateDoc(doc(db_obj, 'inventory', product.id), {
        quantity: newQuantity,
        dispatched: (product.dispatched || 0) + quantity,
        lastDispatched: new Date().toISOString()
      });
      console.log('[DispatchHome] Stock updated in Firebase');

      // 2. Guardar despacho en historial (localStorage)
      const history = JSON.parse(localStorage.getItem('dispatch_history') || '[]');
      history.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: quantity,
        destination: destination,
        dispatchedBy: user.uid,
        dispatchedByEmail: user.email,
        date: new Date().toISOString(),
        status: 'completed'
      });
      localStorage.setItem('dispatch_history', JSON.stringify(history));
      console.log('[DispatchHome] Dispatch saved to history');

      alert(`✅ Despacho registrado: ${quantity} unidades de ${product.name} hacia ${destination}`);

      // 3. Limpiar formulario
      setDispatchData({
        ...dispatchData,
        [product.id]: { quantity: '', destination: '' }
      });

      // 4. Recargar inventario para mostrar cambios
      await loadInventory();
    } catch (error) {
      console.error('Error despachando:', error);
      alert('Error al registrar despacho: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <h1 style={{ color: '#333' }}>📦 Panel de Despacho</h1>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <p>Usuario: <strong>{user?.email}</strong></p>
          <p>Productos disponibles: <strong>{inventory.length}</strong></p>
        </div>

        {inventory.length === 0 ? (
          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '8px',
            textAlign: 'center',
            color: '#999'
          }}>
            <p>No hay productos disponibles para despachar</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {inventory.map(product => (
              <div key={product.id} style={{ 
                background: 'white', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {/* Foto del producto */}
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {product.photoPreview ? (
                    <img 
                      src={product.photoPreview} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <p style={{ fontSize: '48px', margin: '0' }}>📦</p>
                      <p style={{ margin: '10px 0 0 0' }}>Sin foto</p>
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    <strong>SKU:</strong> {product.sku}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    <strong>Stock Actual:</strong> <span style={{ color: product.quantity > 0 ? '#28a745' : '#dc3545', fontWeight: 600 }}>{product.quantity}</span>
                  </p>
                  {product.description && (
                    <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '13px' }}>
                      {product.description}
                    </p>
                  )}

                  {/* Formulario de despacho */}
                  {product.quantity > 0 ? (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px' }}>
                          Cantidad a Despachar (máx: {product.quantity}):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={product.quantity}
                          value={dispatchData[product.id]?.quantity || ''}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          placeholder="0"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px' }}>
                          Destino:
                        </label>
                        <input
                          type="text"
                          value={dispatchData[product.id]?.destination || ''}
                          onChange={(e) => handleDestinationChange(product.id, e.target.value)}
                          placeholder="Ej: Almacén 2, Cliente XYZ"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <button
                        onClick={() => handleDispatch(product)}
                        disabled={loading}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {loading ? 'Despachando...' : '✈️ Despachar'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', textAlign: 'center', color: '#dc3545', fontWeight: 600 }}>
                      Sin stock disponible
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchHome;
