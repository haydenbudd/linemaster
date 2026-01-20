import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/app/lib/api';

interface CSVImportProps {
  onImport: (products: Product[]) => void;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const downloadTemplate = () => {
    const template = `id,series,technology,duty,ip,actions,material,description,applications,features,recommended_for,connector_type,flagship,image,link
hercules-example,Hercules Heavy,electrical,heavy,IP56,\\\"momentary,maintained\\\",Cast Iron,Heavy-duty industrial footswitch,\\\"industrial,automotive\\\",\\\"shield,sealed\\\",\\\"industrial,automotive\\\",hardwired,true,https://linemaster.com/wp-content/uploads/2025/04/hercules.png,https://linemaster.com/product/167/hercules/
clipper-example,Clipper,electrical,medium,IP20,\\\"momentary,maintained\\\",Cast Iron,Industry standard classic cast iron,\\\"industrial,woodworking,general\\\",\\\"twin,guard\\\",\\\"industrial,woodworking\\\",terminal-block,true,https://linemaster.com/wp-content/uploads/2025/04/clipper.png,https://linemaster.com/product/115/clipper/
dolphin-example,Dolphin,electrical,light,IP20,momentary,Polymeric,Omni-directional for precision control,\\\"general,tattoo\\\",multi_stage,general,plug-in,false,https://linemaster.com/wp-content/uploads/2025/04/dolphin.png,https://linemaster.com/product/129/dolphin/
guardian-example,Guardian Pro,pneumatic,heavy,IP68,\\\"momentary,maintained\\\",Stainless Steel,Fully sealed for harsh environments,\\\"industrial,food-processing\\\",\\\"shield,sealed,interlock\\\",\\\"industrial,food-processing\\\",hardwired,true,https://linemaster.com/wp-content/uploads/2025/04/guardian.png,https://linemaster.com/product/200/guardian/
`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const products: Product[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          
          if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: Column count mismatch`);
            continue;
          }

          const product: any = {};
          headers.forEach((header, idx) => {
            const value = values[idx]?.trim();
            
            // Parse array fields
            if (header === 'actions' || header === 'applications' || header === 'features' || header === 'recommended_for') {
              product[header] = value ? value.split(',').map(v => v.trim()) : [];
            } else if (header === 'flagship') {
              product[header] = value === 'true' || value === '1';
            } else {
              product[header] = value || '';
            }
          });

          // Validate required fields
          if (!product.id || !product.series || !product.technology) {
            errors.push(`Row ${i + 1}: Missing required fields (id, series, or technology)`);
            continue;
          }

          products.push(product as Product);
        } catch (err) {
          errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Parse error'}`);
        }
      }

      setResult({ success: products.length, errors });
      
      if (products.length > 0) {
        onImport(products);
      }
    } catch (err) {
      setResult({ 
        success: 0, 
        errors: [err instanceof Error ? err.message : 'Failed to parse CSV'] 
      });
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset file input
    }
  };

  // Simple CSV parser that handles quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Bulk Import from CSV</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>First row must contain column headers</li>
            <li>Required columns: id, series, technology, duty, ip, material, description</li>
            <li>Use comma-separated values for arrays (actions, applications, features, recommended_for)</li>
            <li>Use "true" or "false" for flagship field</li>
            <li><strong>Features column:</strong> Use values: shield, twin, multi_stage (comma-separated for multiple)</li>
            <li><strong>Recommended_for column:</strong> Application IDs where product excels (e.g., "industrial,automotive")</li>
            <li><strong>Connector_type column:</strong> Use: hardwired, plug-in, terminal-block, or custom value</li>
            <li><strong>Image URLs:</strong> Just paste the full URL from your website (e.g., https://linemaster.com/wp-content/uploads/...)</li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">🔧 Features Column - Physical Characteristics</h4>
          <div className="text-sm text-purple-800 space-y-3">
            <p className="font-medium">Use these standardized feature codes to describe your switches:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg">
                <code className="text-purple-900 font-bold">shield</code>
                <p className="text-xs mt-1">Safety guard or protective shield</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <code className="text-purple-900 font-bold">twin</code>
                <p className="text-xs mt-1">Twin pedal or dual control</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <code className="text-purple-900 font-bold">multi_stage</code>
                <p className="text-xs mt-1">Multi-stage actuation (2-3 points)</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <code className="text-purple-900 font-bold">sealed</code>
                <p className="text-xs mt-1">Sealed enclosure for harsh environments</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <code className="text-purple-900 font-bold">guard</code>
                <p className="text-xs mt-1">Protective guard around pedal</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <code className="text-purple-900 font-bold">interlock</code>
                <p className="text-xs mt-1">Interlock safety mechanism</p>
              </div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg mt-3">
              <p className="font-semibold text-indigo-900 mb-1">💡 Examples:</p>
              <ul className="text-xs space-y-1">
                <li>• Single feature: <code className="bg-white px-2 py-0.5 rounded">shield</code></li>
                <li>• Multiple features: <code className="bg-white px-2 py-0.5 rounded">"shield,sealed,interlock"</code></li>
                <li>• No features: <em>leave the column empty</em></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <h4 className="font-medium text-cyan-900 mb-2">📍 Other Important Fields</h4>
          <div className="text-sm text-cyan-800 space-y-2">
            <div>
              <strong>Recommended For:</strong> Application IDs where this product shines
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Helps with smart product matching</li>
                <li>Example: <code className="bg-white px-1 rounded">"industrial,automotive"</code></li>
              </ul>
            </div>
            <div>
              <strong>Connector Type:</strong> How the switch connects
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><code className="bg-white px-1 rounded">hardwired</code> - Direct wiring connection</li>
                <li><code className="bg-white px-1 rounded">plug-in</code> - Standard plug connector</li>
                <li><code className="bg-white px-1 rounded">terminal-block</code> - Screw terminal connections</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">💡 Quick Tip: Adding Images</h4>
          <p className="text-sm text-green-800 mb-2">
            Already have image links? Just copy-paste them into the <strong>image</strong> column:
          </p>
          <code className="text-xs bg-white px-2 py-1 rounded block overflow-x-auto">
            https://linemaster.com/wp-content/uploads/2025/04/hercules.png
          </code>
          <p className="text-xs text-green-700 mt-2">
            The template shows examples with real Linemaster image URLs. Use the same format!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Template
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <FileText className="w-5 h-5" />
            {importing ? 'Importing...' : 'Upload CSV'}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={importing}
            />
          </label>
        </div>

        {result && (
          <div className={`border rounded-lg p-4 ${
            result.errors.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-3">
              {result.errors.length > 0 ? (
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.errors.length > 0 ? 'text-yellow-900' : 'text-green-900'
                }`}>
                  {result.success > 0 && `Successfully imported ${result.success} product${result.success !== 1 ? 's' : ''}`}
                  {result.errors.length > 0 && ` (${result.errors.length} error${result.errors.length !== 1 ? 's' : ''})`}
                </p>
                
                {result.errors.length > 0 && (
                  <div className="mt-2 text-sm text-yellow-800">
                    <p className="font-medium mb-1">Errors:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      {result.errors.slice(0, 10).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                      {result.errors.length > 10 && (
                        <li>... and {result.errors.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}