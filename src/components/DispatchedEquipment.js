import React, { useState, useEffect } from 'react';
import { ref as dbRef, get } from 'firebase/database';
import { rtDatabase_obj } from '../config/firebase';

const DispatchedEquipment = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadDispatches(),
        loadUsers(),
        loadProducts()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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

  const loadUsers = async () => {
    try {
      const usersRef = dbRef(rtDatabase_obj, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userList = Object.keys(data).map(key => ({
          uid: key,
          email: data[key].email
        }));
        setUsers(userList);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsRef = dbRef(rtDatabase_obj, 'products');
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productList = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name
        }));
        setProducts(productList);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const getFilteredDispatches = () => {
    return dispatches.filter(dispatch => {
      const matchUser = !filterUser || dispatch.userEmail === filterUser;
      const matchProduct = !filterProduct || dispatch.productId === filterProduct;
      return matchUser && matchProduct;
    });
  };

  const filteredData = getFilteredDispatches();
  const totalQuantity = filteredData.reduce((sum, d) => sum + d.quantity, 0);

  if (loading) {
    return <div className="loading">Cargando despachos...</div>;
  }

  return (
    <div className="dispatched-equipment">
      <div className="equipment-header">
        <h3>📤 Equipos Despachados</h3>
        <div className="equipment-stats">
          <div className="stat">
            <span className="label">Total Despachos:</span>
            <span className="value">{filteredData.length}</span>
          </div>
          <div className="stat">
            <span className="label">Total Cantidad:</span>
            <span className="value">{totalQuantity}</span>
          </div>
        </div>
      </div>

      <div className="equipment-filters">
        <div className="filter-group">
          <label>Filtrar por Usuario:</label>
          <select 
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los usuarios</option>
            {users.map(user => (
              <option key={user.uid} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filtrar por Producto:</label>
          <select 
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los productos</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="btn-reset"
          onClick={() => {
            setFilterUser('');
            setFilterProduct('');
          }}
        >
          Limpiar Filtros
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-state">
          <p>No hay despachos registrados</p>
        </div>
      ) : (
        <div className="equipment-table">
          <table>
            <thead>
              <tr>
                <th>ID Despacho</th>
                <th>Fecha</th>
                <th>Producto (SKU)</th>
                <th>Cantidad</th>
                <th>Usuario</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(dispatch => {
                const time = new Date(dispatch.createdAt).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                return (
                  <tr key={dispatch.id}>
                    <td className="id-cell">{dispatch.id}</td>
                    <td>{dispatch.date}</td>
                    <td>
                      <strong>{dispatch.productName}</strong>
                      <br />
                      <small className="sku">{dispatch.productSku}</small>
                    </td>
                    <td className="quantity-cell">{dispatch.quantity}</td>
                    <td className="user-cell">{dispatch.userEmail}</td>
                    <td className="time-cell">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DispatchedEquipment;
