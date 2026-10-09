import React, { useState, useEffect } from 'react';
import { db_obj, firestoreModule, isLocalMode } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Send, Package, Plus } from 'lucide-react';
import Header from '../components/Header';
import '../styles/Dispatch.css';

// Usar funciones según modo local o real
const collection = firestoreModule.collection;
const getDocs = firestoreModule.getDocs;
const updateDoc = firestoreModule.updateDoc;
const doc = firestoreModule.doc;
const addDoc = firestoreModule.addDoc || (async () => { throw new Error('addDoc no disponible en modo mock'); });
const query = firestoreModule.query;
const where = firestoreModule.where;

const DispatchHome = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { user, userRole } = useAuth();

  // Cargar inventario
  useEffect(() => {
    console.log('[DispatchHome] Component mounted, user:', user?.uid);
    loadInventory();
    loadHistory();
  }, []);

  const loadInventory = async () => {
    try {
      console.log('[DispatchHome] Loading inventory...');
      const q = query(collection(db_obj, 'inventory'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('[DispatchHome] Inventory loaded:', data);
      setInventory(data);
    } catch (error) {
      console.error('[DispatchHome] Error cargando inventario:', error);
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
      setHistory(data.sort((a, b) => b.date - a.date));
    } catch (error) {
      console.error('Error cargando historial:', error);
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

      // Actualizar inventario
      const newQuantity = selectedProduct.quantity - qty;
      const dispatched = (selectedProduct.dispatched || 0) + qty;
      
      await updateDoc(doc(db_obj, 'inventory', selectedProduct.id), {
        quantity: newQuantity,
        dispatched: dispatched,
        lastUpdated: new Date()
      });

      // Registrar en historial
      if (isLocalMode) {
        const newId = `dispatch-${Date.now()}`;
        await firestoreModule.setDoc(doc(db_obj, 'dispatch_history', newId), {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          sku: selectedProduct.sku,
          quantity: qty,
          destination: destination,
          dispatchedBy: user?.uid,
          dispatchedEmail: user?.email,
          date: new Date(),
          notes: ''
        });
      }

      // Resetear formulario
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
    <div className="dispatch-page">
      <Header />
      <div style={{ padding: '20px', color: 'black', textAlign: 'center' }}>
        <h1>✅ DispatchHome está cargando...</h1>
        <p>Usuario: {user?.email}</p>
        <p>Rol: {userRole}</p>
        <p>Inventario cargado: {inventory.length} productos</p>
      </div>
    </div>
  );
};;

export default DispatchHome;
