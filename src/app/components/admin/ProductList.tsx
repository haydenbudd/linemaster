import { useState } from 'react';
import { Product } from '@/app/lib/api';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAdd: () => void;
}

export function ProductList({ products, onEdit, onDelete, onAdd }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technology
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applications
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.series}
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{product.series}</div>
                      <div className="text-sm text-gray-500">{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {product.technology}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {product.duty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {product.features && product.features.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {feature === 'shield' && '🛡️ Guard'}
                          {feature === 'twin' && '👯 Twin'}
                          {feature === 'multi_stage' && '📊 Multi-Stage'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{product.applications.length} apps</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${product.series}?`)) {
                          onDelete(product.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No products found' : 'No products yet. Add your first product!'}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}