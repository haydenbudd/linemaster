import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function SupabaseDebugger() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-a6e7a38d`;

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch(`${apiBase}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const text = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
      setResult(JSON.stringify({ status: response.status, data: parsed }, null, 2));
    } catch (err) {
      setResult(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Supabase Debugger</h3>
      <p className="text-sm text-gray-600">
        Test API endpoints and inspect responses.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => testEndpoint('/health')}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg"
        >
          Health Check
        </button>
        <button
          onClick={() => testEndpoint(`/products?t=${Date.now()}`)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg"
        >
          Fetch Products
        </button>
        <button
          onClick={() => testEndpoint('/options')}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg"
        >
          Fetch Options
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Fetching...</span>
        </div>
      )}

      {result && (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm">
          {result}
        </pre>
      )}

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">Connection Info:</p>
        <p>Project: <code className="bg-gray-200 px-1 rounded">{projectId}</code></p>
        <p>API: <code className="bg-gray-200 px-1 rounded text-xs">{apiBase}</code></p>
      </div>
    </div>
  );
}
