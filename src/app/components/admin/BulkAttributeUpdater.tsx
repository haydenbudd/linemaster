import { useState } from 'react';
import { Product, createOrUpdateProducts } from '@/app/lib/api';
import { RefreshCw } from 'lucide-react';

interface BulkAttributeUpdaterProps {
  products: Product[];
  onUpdate: () => void;
}

export function BulkAttributeUpdater({ products, onUpdate }: BulkAttributeUpdaterProps) {
  const [field, setField] = useState<string>('connector_type');
  const [filterField, setFilterField] = useState<string>('technology');
  const [filterValue, setFilterValue] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const editableFields = [
    'connector_type', 'voltage', 'amperage', 'certifications',
    'circuitry', 'material', 'duty', 'ip', 'description',
  ];

  const filterFields = ['technology', 'duty', 'material', 'ip'];

  const filteredProducts = filterValue
    ? products.filter((p: any) => p[filterField] === filterValue)
    : products;

  const uniqueFilterValues = [...new Set(products.map((p: any) => p[filterField]).filter(Boolean))];

  const handleApply = async () => {
    if (!newValue.trim() || filteredProducts.length === 0) return;

    if (!window.confirm(`Update "${field}" to "${newValue}" for ${filteredProducts.length} products?`)) {
      return;
    }

    try {
      setUpdating(true);
      const updated = filteredProducts.map(p => ({
        ...p,
        [field]: newValue.trim(),
      }));
      await createOrUpdateProducts(updated);
      onUpdate();
    } catch (err) {
      console.error('Bulk update failed:', err);
      alert('Bulk update failed. Check console.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Bulk Attribute Updater</h3>
      <p className="text-sm text-gray-600">
        Update a single attribute across multiple products at once.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by</label>
          <select
            value={filterField}
            onChange={(e) => { setFilterField(e.target.value); setFilterValue(''); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {filterFields.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter value</label>
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All products ({products.length})</option>
            {uniqueFilterValues.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field to update</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {editableFields.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New value</label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new value..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleApply}
          disabled={updating || !newValue.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {updating && <RefreshCw className="w-4 h-4 animate-spin" />}
          Apply to {filteredProducts.length} products
        </button>
        <span className="text-sm text-gray-500">
          {filteredProducts.length} of {products.length} products selected
        </span>
      </div>
    </div>
  );
}
