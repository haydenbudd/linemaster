import { useState, useEffect } from 'react';
import { 
  LogOut, 
  Package, 
  Settings, 
  Upload, 
  Plus, 
  Edit2, 
  Trash2,
  Search,
  Clock,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { Product, fetchProducts, createOrUpdateProduct, deleteProduct } from '@/app/lib/api';
import { getCurrentUser, signOut } from '@/app/lib/supabase';
import { projectId } from '/utils/supabase/info';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { CSVImport } from './CSVImport';

interface AdminDashboardProps {
  onLogout: () => void;
  sessionWarning?: boolean;
}

export function AdminDashboard({ onLogout, sessionWarning }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'import'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    loadProducts();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const user = await getCurrentUser();
    if (user) {
      setUserEmail(user.email || '');
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      alert('Failed to load products. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      setSaving(true);
      await createOrUpdateProduct(product);
      await loadProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Please check console.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please check console.');
    }
  };

  const handleBulkImport = async (importedProducts: Product[]) => {
    try {
      setSaving(true);
      // Import all products one by one
      for (const product of importedProducts) {
        await createOrUpdateProduct(product);
      }
      await loadProducts();
      alert(`Successfully imported ${importedProducts.length} products!`);
    } catch (err) {
      console.error('Failed to import products:', err);
      alert('Failed to import some products. Please check console.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Session Warning */}
          {sessionWarning && (
            <div className="py-2 bg-amber-50 border-b border-amber-200">
              <div className="flex items-center justify-center gap-2 text-amber-800 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Session expiring soon due to inactivity.</span>
                <span>Move your mouse to stay logged in.</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Manager</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your Linemaster product catalog
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Wizard</span>
              </a>
              <a
                href={`https://supabase.com/dashboard/project/${projectId}/editor`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View in Supabase →
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Electrical</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.technology === 'electrical').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wireless</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.technology === 'wireless').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Products ({products.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'import'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Bulk Import
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            )}

            {activeTab === 'import' && (
              <CSVImport onImport={handleBulkImport} />
            )}
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-900 font-medium">Saving...</span>
          </div>
        </div>
      )}
    </div>
  );
}