import { useState, useEffect } from 'react';
import { Product } from '@/app/lib/api';
import { X, Save } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    series: '',
    technology: 'electrical',
    duty: 'medium',
    ip: 'IP20',
    actions: ['momentary'],
    material: '',
    description: '',
    applications: [],
    features: [],
    flagship: false,
    image: '',
    link: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        features: product.features || [], // Ensure features is always an array
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: 'actions' | 'applications' | 'features', value: string) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: newValue };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => updateField('id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., hercules-heavy"
                required
                disabled={!!product}
              />
              {product && (
                <p className="text-xs text-gray-500 mt-1">ID cannot be changed</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.series}
                onChange={(e) => updateField('series', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Hercules"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technology <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.technology}
                onChange={(e) => updateField('technology', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="electrical">Electrical</option>
                <option value="pneumatic">Pneumatic</option>
                <option value="wireless">Wireless</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duty Rating <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duty}
                onChange={(e) => updateField('duty', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Rating <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ip}
                onChange={(e) => updateField('ip', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="IP20">IP20 (Indoor)</option>
                <option value="IP40">IP40 (Dust Protected)</option>
                <option value="IP54">IP54 (Dust/Splash)</option>
                <option value="IP56">IP56 (Splash Resistant)</option>
                <option value="IP65">IP65 (Dust Tight / Water Jet)</option>
                <option value="IP66">IP66 (Dust Tight / High Pressure)</option>
                <option value="IP67">IP67 (Dust Tight / Immersion)</option>
                <option value="IP68">IP68 (Fully Sealed)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => updateField('material', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cast Iron"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['momentary', 'maintained', 'variable'].map(action => (
                <label key={action} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.actions?.includes(action)}
                    onChange={() => toggleArrayValue('actions', action)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="capitalize">{action}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applications <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['industrial', 'automotive', 'medical', 'woodworking', 'tattoo', 'general'].map(app => (
                <label key={app} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.applications?.includes(app)}
                    onChange={() => toggleArrayValue('applications', app)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="capitalize">{app}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Select the physical features this product has. This affects product filtering in the wizard.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'shield', label: 'Safety Guard/Shield' },
                { value: 'multi_stage', label: 'Multi-Stage (2-3 actuation points)' },
                { value: 'twin', label: 'Twin Pedal' },
              ].map(feature => (
                <label key={feature.value} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.features?.includes(feature.value)}
                    onChange={() => toggleArrayValue('features', feature.value)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Brief product description"
              required
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => updateField('image', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Page URL
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => updateField('link', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Flagship */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.flagship}
                onChange={(e) => updateField('flagship', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Flagship Product</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Save className="w-5 h-5" />
              {product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}