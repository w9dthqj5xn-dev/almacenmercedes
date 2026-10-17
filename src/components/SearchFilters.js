import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import '../styles/SearchFilters.css';

const SearchFilters = ({ inventory, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minStock: 0,
    maxStock: 999,
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply search and filters
  const applyFilters = React.useCallback(() => {
    const filtered = inventory.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStock = 
        item.quantity >= filters.minStock && 
        item.quantity <= filters.maxStock;

      return matchSearch && matchStock;
    });

    onFilter(filtered);
  }, [searchTerm, filters, inventory, onFilter]);

  // Apply filters when they change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      minStock: 0,
      maxStock: 999,
      category: 'all'
    });
    onFilter(inventory);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== 0 && v !== 999).length + (searchTerm ? 1 : 0);

  return (
    <div className="search-filters-container">
      <div className="search-box">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, SKU or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <button
        className={`toggle-filters ${activeFilterCount > 0 ? 'active' : ''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        🔧 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Minimum Stock</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minStock}
              onChange={(e) => setFilters({...filters, minStock: parseInt(e.target.value)})}
              className="range-slider"
            />
            <span className="range-value">{filters.minStock}</span>
          </div>

          <div className="filter-group">
            <label>Maximum Stock</label>
            <input
              type="range"
              min="0"
              max="999"
              value={filters.maxStock}
              onChange={(e) => setFilters({...filters, maxStock: parseInt(e.target.value)})}
              className="range-slider"
            />
            <span className="range-value">{filters.maxStock}</span>
          </div>

          <button
            className="btn-reset-filters"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="active-filters">
        {searchTerm && (
          <span className="filter-tag">
            Search: <strong>{searchTerm}</strong>
            <button onClick={() => setSearchTerm('')}><X size={14} /></button>
          </span>
        )}
        {(filters.minStock > 0 || filters.maxStock < 999) && (
          <span className="filter-tag">
            Stock: <strong>{filters.minStock}-{filters.maxStock}</strong>
            <button onClick={() => setFilters({...filters, minStock: 0, maxStock: 999})}><X size={14} /></button>
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
