import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref as dbRef, get, set as dbSet, update as dbUpdate } from 'firebase/database';
import { rtDatabase_obj } from '../config/firebase';
import Header from '../components/Header';
import '../styles/Dispatch.css';

const DispatchHome = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dispatchQuantity, setDispatchQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState('');
  const [dispatchCost, setDispatchCost] = useState('');
  const [dispatchError, setDispatchError] = useState('');
  const [dispatchSuccess, setDispatchSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadInventory(),
        loadDispatches()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const productsRef = dbRef(rtDatabase_obj, 'products');
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const products = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setInventory(products);
      } else {
        setInventory([]);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      setInventory([]);
    }
  };

  const loadDispatches = async () => {
    try {
      const dispatchesRef = dbRef(rtDatabase_obj, 'dispatches');
      const snapshot = await get(dispatchesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dispatchList = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDispatches(dispatchList);
      }
    } catch (error) {
      console.error('Error loading dispatches:', error);
    }
  };

  const handleDispatch = async (product) => {
    if (!dispatchQuantity || dispatchQuantity <= 0) {
      setDispatchError('❌ Ingresa una cantidad válida (mayor a 0)');
      setTimeout(() => setDispatchError(''), 3000);
      return;
    }

    if (!recipientName.trim()) {
      setDispatchError('❌ Ingresa el nombre de la empresa o persona');
      setTimeout(() => setDispatchError(''), 3000);
      return;
    }

    if (!dispatchCost || parseFloat(dispatchCost) < 0) {
      setDispatchError('❌ Ingresa un costo válido');
      setTimeout(() => setDispatchError(''), 3000);
      return;
    }

    if (dispatchQuantity > product.quantity) {
      setDispatchError(`❌ No hay suficiente stock. Disponible: ${product.quantity}`);
      setTimeout(() => setDispatchError(''), 3000);
      return;
    }

    try {
      setLoading(true);

      // Crear el registro de despacho
      const dispatchId = `DESP-${Date.now()}`;
      const dispatchRecord = {
        id: dispatchId,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: parseInt(dispatchQuantity),
        cost: parseFloat(dispatchCost),
        recipientName: recipientName.trim(),
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES')
      };

      // Guardar el despacho
      const dispatchRef = dbRef(rtDatabase_obj, `dispatches/${dispatchId}`);
      await dbSet(dispatchRef, dispatchRecord);

      // Actualizar el inventario (restar stock)
      const newQuantity = product.quantity - parseInt(dispatchQuantity);
      const productRef = dbRef(rtDatabase_obj, `products/${product.id}`);
      await dbUpdate(productRef, {
        quantity: newQuantity,
        dispatched: (product.dispatched || 0) + parseInt(dispatchQuantity)
      });

      setDispatchSuccess(`✅ Despacho registrado: ${dispatchQuantity} ${product.name} para ${recipientName}`);
      setSelectedProduct(null);
      setDispatchQuantity(1);
      setRecipientName('');
      setDispatchCost('');
      setTimeout(() => setDispatchSuccess(''), 3000);

      // Recargar datos
      await loadData();
    } catch (error) {
      console.error('Error dispatching product:', error);
      setDispatchError('❌ Error al registrar el despacho');
      setTimeout(() => setDispatchError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dispatch-container">
        <div className="loader"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="dispatch-container">
      <Header />

      {/* Mensajes */}
      {dispatchError && <div className="alert error">{dispatchError}</div>}
      {dispatchSuccess && <div className="alert success">{dispatchSuccess}</div>}

      {/* Main Content */}
      <div className="dispatch-content">
        {/* Inventario disponible */}
        <section className="inventory-section">
          <h2>📋 Inventario Disponible</h2>
          
          {inventory.length === 0 ? (
            <p className="empty-state">No hay productos disponibles</p>
          ) : (
            <div className="inventory-grid">
              {inventory.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="sku-badge">{product.sku}</span>
                  </div>
                  
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-stats">
                    <div className="stat">
                      <span className="label">Stock Disponible:</span>
                      <span className={`value ${product.quantity > 0 ? 'available' : 'unavailable'}`}>
                        {product.quantity} unidades
                      </span>
                    </div>
                    <div className="stat">
                      <span className="label">Ya Despachados:</span>
                      <span className="value">{product.dispatched || 0}</span>
                    </div>
                  </div>

                  {selectedProduct?.id === product.id ? (
                    <div className="dispatch-form">
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Nombre de empresa o persona"
                        className="text-input"
                      />
                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={dispatchQuantity}
                        onChange={(e) => setDispatchQuantity(e.target.value)}
                        placeholder="Cantidad"
                        className="quantity-input"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dispatchCost}
                        onChange={(e) => setDispatchCost(e.target.value)}
                        placeholder="Costo ($)"
                        className="cost-input"
                      />
                      <div className="button-group">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDispatch(product)}
                          disabled={loading}
                        >
                          {loading ? 'Procesando...' : 'Confirmar Despacho'}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedProduct(null);
                            setRecipientName('');
                            setDispatchQuantity(1);
                            setDispatchCost('');
                          }}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-action"
                      onClick={() => {
                        setSelectedProduct(product);
                        setDispatchQuantity(1);
                      }}
                      disabled={product.stock === 0}
                    >
                      📤 Hacer Despacho
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Historial de despachos */}
        <section className="dispatch-history-section">
          <h2>📤 Historial de Despachos</h2>
          
          {dispatches.length === 0 ? (
            <p className="empty-state">No hay despachos registrados</p>
          ) : (
            <div className="dispatches-table">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto (SKU)</th>
                    <th>Cantidad</th>
                    <th>Usuario</th>
                    <th>ID Despacho</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatches.map(dispatch => (
                    <tr key={dispatch.id}>
                      <td>{dispatch.date}</td>
                      <td>
                        {dispatch.productName}
                        <br />
                        <small>{dispatch.productSku}</small>
                      </td>
                      <td className="quantity-cell">{dispatch.quantity}</td>
                      <td>{dispatch.userEmail}</td>
                      <td className="id-cell">{dispatch.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DispatchHome;
