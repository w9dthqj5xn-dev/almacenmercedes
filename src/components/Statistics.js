import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../styles/Statistics.css';

const Statistics = ({ inventory }) => {
  // Preparar datos para gráficos
  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalDispatched = inventory.reduce((sum, item) => sum + (item.dispatched || 0), 0);
  const lowStockProducts = inventory.filter(item => item.quantity < 10).length;

  // Datos para gráfico de pie (Stock vs Despachado)
  const stockData = [
    { name: 'En Stock', value: totalStock },
    { name: 'Despachado', value: totalDispatched }
  ];

  // Datos para gráfico de barras (Top 5 productos)
  const topProducts = inventory
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(item => ({
      name: item.name.substring(0, 10),
      stock: item.quantity,
      despachado: item.dispatched || 0
    }));

  // Datos para gráfico de línea (Productos por rango de stock)
  const stockRanges = [
    { range: '0-5', count: inventory.filter(i => i.quantity >= 0 && i.quantity <= 5).length },
    { range: '6-10', count: inventory.filter(i => i.quantity >= 6 && i.quantity <= 10).length },
    { range: '11-20', count: inventory.filter(i => i.quantity >= 11 && i.quantity <= 20).length },
    { range: '21-50', count: inventory.filter(i => i.quantity >= 21 && i.quantity <= 50).length },
    { range: '50+', count: inventory.filter(i => i.quantity > 50).length }
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  return (
    <div className="statistics-container">
      <div className="stats-overview">
        <div className="stat-card">
          <h4>Total Productos</h4>
          <p className="stat-value">{totalProducts}</p>
          <p className="stat-subtitle">Ítems en inventario</p>
        </div>
        <div className="stat-card highlight">
          <h4>Stock Total</h4>
          <p className="stat-value">{totalStock}</p>
          <p className="stat-subtitle">Unidades disponibles</p>
        </div>
        <div className="stat-card">
          <h4>Despachado</h4>
          <p className="stat-value">{totalDispatched}</p>
          <p className="stat-subtitle">Unidades enviadas</p>
        </div>
        <div className="stat-card alert">
          <h4>Bajo Stock</h4>
          <p className="stat-value">{lowStockProducts}</p>
          <p className="stat-subtitle">Productos con &lt; 10 unidades</p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Gráfico de Pie - Stock vs Despachado */}
        <div className="chart-container">
          <h4>📊 Distribución: Stock vs Despachado</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras - Top 5 Productos */}
        <div className="chart-container">
          <h4>📈 Top 5 Productos por Stock</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#667eea" name="En Stock" />
              <Bar dataKey="despachado" fill="#f093fb" name="Despachado" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Línea - Distribución por Rango */}
        <div className="chart-container full-width">
          <h4>📊 Distribución de Productos por Rango de Stock</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stockRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#667eea" 
                name="Cantidad de Productos"
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
