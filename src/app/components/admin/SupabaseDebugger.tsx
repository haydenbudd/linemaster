import { useState } from 'react';
import { RefreshCw, Search, ChevronLeft, Activity, Package, List, Terminal, Send } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import {
  Product, Option,
  fetchProducts, fetchProduct,
  fetchOptions, fetchOptionsByCategory,
} from '@/app/lib/api';

type DebugSection = 'diagnostics' | 'products' | 'options' | 'raw';

const OPTION_CATEGORIES = [
  'application', 'technology', 'action', 'environment',
  'feature', 'connector', 'console_style', 'pedal_count',
  'medical_feature', 'accessory',
] as const;

interface DiagnosticResult {
  serverStatus: 'ok' | 'error';
  responseTimeMs: number;
  timestamp: string | null;
  products: Product[];
  options: Option[];
}

interface RawResult {
  status: number;
  timeMs: number;
  sizeBytes: number;
  data: unknown;
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function Pill({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

export function SupabaseDebugger() {
  const [activeSection, setActiveSection] = useState<DebugSection>('diagnostics');
  const [loading, setLoading] = useState(false);

  // Diagnostics
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);

  // Products
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productIdInput, setProductIdInput] = useState('');
  const [showProductJson, setShowProductJson] = useState(false);
  const [productsFetched, setProductsFetched] = useState(false);

  // Options
  const [optionsList, setOptionsList] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Raw
  const [rawEndpoint, setRawEndpoint] = useState('/health');
  const [rawResult, setRawResult] = useState<RawResult | null>(null);

  const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-a6e7a38d`;

  // --- Diagnostics ---
  const runDiagnostics = async () => {
    setLoading(true);
    setDiagnostics(null);
    const start = performance.now();
    try {
      const healthRes = fetch(`${apiBase}/health`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const [health, products, options] = await Promise.all([
        healthRes.then(r => r.json()).catch(() => null),
        fetchProducts().catch(() => [] as Product[]),
        fetchOptions().catch(() => [] as Option[]),
      ]);
      const elapsed = Math.round(performance.now() - start);
      setDiagnostics({
        serverStatus: health?.status === 'ok' ? 'ok' : 'error',
        responseTimeMs: elapsed,
        timestamp: health?.timestamp || null,
        products,
        options,
      });
    } catch {
      setDiagnostics({
        serverStatus: 'error',
        responseTimeMs: Math.round(performance.now() - start),
        timestamp: null,
        products: [],
        options: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Products ---
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProductList(data);
      setProductsFetched(true);
    } catch (err) {
      console.error('Debug: Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductById = async () => {
    if (!productIdInput.trim()) return;
    setLoading(true);
    setSelectedProduct(null);
    try {
      const data = await fetchProduct(productIdInput.trim());
      setSelectedProduct(data);
    } catch (err) {
      console.error('Debug: Failed to fetch product', err);
      alert(`Product "${productIdInput}" not found or fetch failed.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productList.filter(p =>
    p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.series.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.part_number || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  // --- Options ---
  const loadAllOptions = async () => {
    setLoading(true);
    setSelectedCategory('');
    try {
      const data = await fetchOptions();
      setOptionsList(data);
    } catch (err) {
      console.error('Debug: Failed to fetch options', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptionsByCategory = async (category: string) => {
    setLoading(true);
    setSelectedCategory(category);
    try {
      const data = await fetchOptionsByCategory(category);
      setOptionsList(data);
    } catch (err) {
      console.error('Debug: Failed to fetch options', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Raw ---
  const testRawEndpoint = async () => {
    if (!rawEndpoint.trim()) return;
    setLoading(true);
    setRawResult(null);
    const start = performance.now();
    try {
      const response = await fetch(`${apiBase}${rawEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const elapsed = Math.round(performance.now() - start);
      const text = await response.text();
      const size = new Blob([text]).size;
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = text; }
      setRawResult({ status: response.status, timeMs: elapsed, sizeBytes: size, data: parsed });
    } catch (err) {
      setRawResult({
        status: 0,
        timeMs: Math.round(performance.now() - start),
        sizeBytes: 0,
        data: { error: err instanceof Error ? err.message : String(err) },
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Tab navigation ---
  const tabs: { id: DebugSection; label: string; icon: React.ReactNode }[] = [
    { id: 'diagnostics', label: 'Diagnostics', icon: <Activity className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'options', label: 'Options', icon: <List className="w-4 h-4" /> },
    { id: 'raw', label: 'Raw', icon: <Terminal className="w-4 h-4" /> },
  ];

  const handleTabChange = (tab: DebugSection) => {
    setActiveSection(tab);
    // Auto-fetch products on first visit
    if (tab === 'products' && !productsFetched) {
      loadProducts();
    }
  };

  // --- Render helpers ---
  const renderDiagnostics = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          Run Diagnostics
        </button>
      </div>

      {diagnostics && (
        <div className="space-y-4">
          {/* Server Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Server</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${diagnostics.serverStatus === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-semibold">{diagnostics.serverStatus === 'ok' ? 'Connected' : 'Error'}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Response Time</div>
                <span className="text-sm font-semibold">{diagnostics.responseTimeMs}ms</span>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Server Time</div>
                <span className="text-sm font-semibold">{diagnostics.timestamp ? new Date(diagnostics.timestamp).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Products Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Products ({diagnostics.products.length} total)
            </h4>
            {diagnostics.products.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">By Technology</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(groupBy(diagnostics.products, p => p.technology)).map(([tech, items]) => (
                      <Pill key={tech} color="blue">{tech}: {items.length}</Pill>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">By Duty</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(groupBy(diagnostics.products, p => p.duty)).map(([duty, items]) => (
                      <Pill key={duty} color="purple">{duty}: {items.length}</Pill>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">By IP Rating</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(groupBy(diagnostics.products, p => p.ip)).map(([ip, items]) => (
                      <Pill key={ip} color="green">{ip}: {items.length}</Pill>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">Flagship</div>
                  <Pill color="amber">{diagnostics.products.filter(p => p.flagship).length} flagship products</Pill>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No products found</p>
            )}
          </div>

          {/* Options Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Options ({diagnostics.options.length} total)
            </h4>
            {diagnostics.options.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(groupBy(diagnostics.options, o => o.category)).map(([cat, items]) => (
                  <Pill key={cat} color="gray">{cat}: {items.length}</Pill>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No options found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderProductDetail = (product: Product) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedProduct(null)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to list
        </button>
        <button
          onClick={() => setShowProductJson(!showProductJson)}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          {showProductJson ? 'Hide' : 'View'} Raw JSON
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          {product.image && (
            <img src={product.image} alt={product.series} className="w-24 h-24 object-contain rounded-lg bg-gray-50 border" />
          )}
          <div>
            <h4 className="text-xl font-bold text-gray-900">{product.series}</h4>
            {product.part_number && <p className="text-sm text-gray-500">#{product.part_number}</p>}
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {[
            ['ID', product.id],
            ['Technology', product.technology],
            ['Duty', product.duty],
            ['IP Rating', product.ip],
            ['Material', product.material],
            ['Connector', product.connector_type || '--'],
            ['Voltage', product.voltage || '--'],
            ['Amperage', product.amperage || '--'],
            ['Certifications', product.certifications || '--'],
            ['Circuitry', product.circuitry || '--'],
            ['Flagship', product.flagship ? 'Yes' : 'No'],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
              <div className="font-medium text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Actions</div>
            <div className="flex flex-wrap gap-1">
              {(product.actions || []).map(a => <Pill key={a} color="blue">{a}</Pill>)}
              {(!product.actions || product.actions.length === 0) && <span className="text-sm text-gray-400">--</span>}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Applications</div>
            <div className="flex flex-wrap gap-1">
              {(product.applications || []).map(a => <Pill key={a} color="green">{a}</Pill>)}
              {(!product.applications || product.applications.length === 0) && <span className="text-sm text-gray-400">--</span>}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Features</div>
            <div className="flex flex-wrap gap-1">
              {(product.features || []).map(f => <Pill key={f} color="purple">{f}</Pill>)}
              {(!product.features || product.features.length === 0) && <span className="text-sm text-gray-400">--</span>}
            </div>
          </div>
          {product.link && (
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Link</div>
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">{product.link}</a>
            </div>
          )}
        </div>
      </div>

      {showProductJson && (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs">
          {JSON.stringify(product, null, 2)}
        </pre>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      {/* Fetch by ID */}
      <div className="flex gap-2">
        <input
          type="text"
          value={productIdInput}
          onChange={(e) => setProductIdInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadProductById()}
          placeholder="Fetch by product ID..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={loadProductById}
          disabled={loading || !productIdInput.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg flex items-center gap-1"
        >
          <Search className="w-3.5 h-3.5" />
          Fetch
        </button>
        <button
          onClick={loadProducts}
          disabled={loading}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg"
          title="Refresh products"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Detail view */}
      {selectedProduct && renderProductDetail(selectedProduct)}

      {/* List view */}
      {!selectedProduct && (
        <>
          {/* Search filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Filter by ID, series, or part number..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <p className="text-xs text-gray-500">
            Showing {filteredProducts.length} of {productList.length} products
          </p>

          {productList.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">ID</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Series</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Tech</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Duty</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">IP</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Actions</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Connector</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-gray-600">{p.id}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{p.series}</td>
                      <td className="px-3 py-2"><Pill color="blue">{p.technology}</Pill></td>
                      <td className="px-3 py-2"><Pill color="purple">{p.duty}</Pill></td>
                      <td className="px-3 py-2"><Pill color={p.ip === 'IP68' ? 'green' : 'gray'}>{p.ip}</Pill></td>
                      <td className="px-3 py-2 text-xs text-gray-600">{(p.actions || []).join(', ')}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{p.connector_type || '--'}</td>
                      <td className="px-3 py-2 text-center">{p.flagship ? <span className="text-amber-500 font-bold">*</span> : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && productsFetched && (
              <p className="text-sm text-gray-500 text-center py-8">No products found in database.</p>
            )
          )}
        </>
      )}
    </div>
  );

  const renderOptions = () => (
    <div className="space-y-4">
      {/* Category buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={loadAllOptions}
          disabled={loading}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            selectedCategory === '' && optionsList.length > 0
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          } disabled:bg-gray-50`}
        >
          All
        </button>
        {OPTION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => loadOptionsByCategory(cat)}
            disabled={loading}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            } disabled:bg-gray-50`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 py-4">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Fetching options...</span>
        </div>
      )}

      {optionsList.length > 0 && (
        <>
          <p className="text-xs text-gray-500">
            {optionsList.length} option{optionsList.length !== 1 ? 's' : ''}
            {selectedCategory ? ` in "${selectedCategory.replace(/_/g, ' ')}"` : ' (all categories)'}
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">ID</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Category</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Label</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Description</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Icon</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Sort</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Available For</th>
                  <th className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Hide For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {optionsList.map((o) => (
                  <tr key={`${o.category}-${o.id}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{o.id}</td>
                    <td className="px-3 py-2"><Pill color="gray">{o.category}</Pill></td>
                    <td className="px-3 py-2 font-medium text-gray-900">{o.label}</td>
                    <td className="px-3 py-2 text-xs text-gray-500 max-w-[200px] truncate">{o.description || '--'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{o.icon || '--'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600 text-center">{o.sortOrder ?? '--'}</td>
                    <td className="px-3 py-2">
                      {o.availableFor && o.availableFor.length > 0
                        ? <div className="flex flex-wrap gap-1">{o.availableFor.map(a => <Pill key={a} color="green">{a}</Pill>)}</div>
                        : <span className="text-xs text-gray-400">--</span>
                      }
                    </td>
                    <td className="px-3 py-2">
                      {o.hideFor && o.hideFor.length > 0
                        ? <div className="flex flex-wrap gap-1">{o.hideFor.map(h => <Pill key={h} color="amber">{h}</Pill>)}</div>
                        : <span className="text-xs text-gray-400">--</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && optionsList.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">Select a category above to fetch options.</p>
      )}
    </div>
  );

  const renderRaw = () => (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Send a GET request to any endpoint on the Supabase Edge Function.
      </p>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <span className="pl-3 text-xs text-gray-400 font-mono whitespace-nowrap select-none">{apiBase}</span>
          <input
            type="text"
            value={rawEndpoint}
            onChange={(e) => setRawEndpoint(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && testRawEndpoint()}
            placeholder="/health"
            className="flex-1 px-2 py-2 text-sm font-mono border-none focus:ring-0 focus:outline-none"
          />
        </div>
        <button
          onClick={testRawEndpoint}
          disabled={loading || !rawEndpoint.trim()}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Send
        </button>
      </div>

      {/* Quick endpoint buttons */}
      <div className="flex flex-wrap gap-2">
        {['/health', '/products', '/options', `/products?t=${Date.now()}`].map(ep => (
          <button
            key={ep}
            onClick={() => { setRawEndpoint(ep); }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-mono"
          >
            {ep}
          </button>
        ))}
      </div>

      {rawResult && (
        <>
          <div className="flex gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <span>Status: <span className={`font-bold ${rawResult.status >= 200 && rawResult.status < 300 ? 'text-green-600' : 'text-red-600'}`}>{rawResult.status || 'Error'}</span></span>
            <span>Time: <span className="font-bold">{rawResult.timeMs}ms</span></span>
            <span>Size: <span className="font-bold">{rawResult.sizeBytes > 1024 ? `${(rawResult.sizeBytes / 1024).toFixed(1)} KB` : `${rawResult.sizeBytes} B`}</span></span>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs">
            {JSON.stringify(rawResult.data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Supabase Debugger</h3>
        <p className="text-sm text-gray-600">
          Inspect data, test endpoints, and diagnose issues.
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeSection === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      {activeSection === 'diagnostics' && renderDiagnostics()}
      {activeSection === 'products' && renderProducts()}
      {activeSection === 'options' && renderOptions()}
      {activeSection === 'raw' && renderRaw()}

      {/* Connection Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">Connection Info:</p>
        <p>Project: <code className="bg-gray-200 px-1 rounded">{projectId}</code></p>
        <p>API: <code className="bg-gray-200 px-1 rounded text-xs">{apiBase}</code></p>
      </div>
    </div>
  );
}
