import React, { useState, ChangeEvent } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Product } from '@/app/lib/api';

interface CSVImportProps {
  onImport: (products: Product[]) => void;
  existingProducts: Product[];
  onDeleteAll?: () => void;
}

export function CSVImport({ onImport, existingProducts = [], onDeleteAll }: CSVImportProps) {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Helper: Normalize header strings to find matches easily
  const cleanHeader = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');

  const downloadTemplate = () => {
    const template = `id,series,technology,duty,ip,actions,material,description,applications,features,recommended_for,connector_type,certifications,voltage,amperage,flagship,image,link,Part,Number of Pedals,Circuits Controlled,Stages,Microswitch,Color,Guard,Gated,Interlock
hercules-heavy,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Heavy-duty switch,"industrial,automotive","shield,sealed",industrial,hardwired,"UL,CSA","125-250V","20A",true,https://linemaster.com/img.png,https://linemaster.com/prod/1,531-SWHO,1,SPDT,Single,20A 125VAC,Orange,Yes,No,No
`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Robust CSV Line Parser
  const parseCSVLine = (line: string, delimiter = ','): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Handle escaped quote ("") inside quotes
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);
    setDebugInfo(null);

    try {
      const text = await file.text();
      // Handle different line endings (Windows \r\n vs Unix \n)
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      
      if (lines.length < 2) throw new Error('CSV file is empty');

      // Auto-detect delimiter
      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : ',';

      // 1. Map Headers
      const rawHeaders = parseCSVLine(firstLine, delimiter).map(h => h.trim());
      const headerMap: Record<string, number> = {};
      
      rawHeaders.forEach((h, index) => {
        const cleaned = cleanHeader(h);
        headerMap[cleaned] = index;
        // Also map exact string for strict lookups
        headerMap[h.toLowerCase()] = index; 
      });

      // Index Existing Products
      const productMap = new Map<string, Product>();
      if (Array.isArray(existingProducts)) {
        existingProducts.forEach(p => {
          if (p.id) productMap.set(p.id.toLowerCase(), p);
          if (p.part_number) productMap.set(p.part_number.toLowerCase(), p);
        });
      }

      const productsToUpdate: Product[] = [];
      const errors: string[] = [];

      // Improved getValue with strict priority
      const getValue = (values: string[], ...keys: string[]) => {
        // 1. Exact Matches First
        for (const key of keys) {
           const cleanKey = cleanHeader(key);
           if (headerMap[cleanKey] !== undefined && values[headerMap[cleanKey]]) {
              return values[headerMap[cleanKey]].trim();
           }
        }
        
        // 2. Partial Matches Second (fallback)
        for (const key of keys) {
           const cleanKey = cleanHeader(key);
           const matchingHeader = Object.keys(headerMap).find(k => k.includes(cleanKey));
           if (matchingHeader && headerMap[matchingHeader] !== undefined) {
              const val = values[headerMap[matchingHeader]];
              if (val) return val.trim();
           }
        }
        return '';
      };

      // 2. Process Rows
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i], delimiter);
          if (values.length < 2) continue; 

          // 3. Identify Product
          const rawId = getValue(values, 'id', 'sku', 'productid');
          const partNumber = getValue(values, 'part', 'partnumber', 'part#', 'partno');
          
          let id = '';
          
          // CRITICAL FIX: Prioritize Part Number for uniqueness
          // If a part number exists, use it as the ID source to prevent merging distinct variants into one "Series" product
          if (partNumber) {
            id = partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-');
          } else if (rawId) {
            id = rawId.toLowerCase().replace(/[^a-z0-9]/g, '-');
          }

          if (!id) {
             continue; 
          }

          let existing: Product | undefined = productMap.get(id);

          // Fallback check: if we generated an ID from part number, check if it already exists
          if (!existing && partNumber) {
             existing = productMap.get(partNumber.toLowerCase());
          }
          
          // 4. Merge Data
          const baseProduct: Product = existing ? { ...existing } : {
            id: id,
            series: '',
            technology: 'electrical',
            duty: 'medium',
            ip: '',
            actions: [],
            material: '',
            description: '',
            applications: [],
            features: [],
            flagship: false,
            image: '',
            link: ''
          };

          const update = (field: keyof Product, val: string) => {
            if (val && val !== '') (baseProduct as any)[field] = val;
          };
          
          const updateArray = (field: keyof Product, val: string) => {
            if (val && val !== '') (baseProduct as any)[field] = val.split(',').map(s => s.trim());
          };

          // Standard Fields
          update('series', getValue(values, 'series'));
          update('technology', getValue(values, 'technology', 'tech'));
          update('duty', getValue(values, 'duty') as any);
          update('ip', getValue(values, 'ip', 'rating'));
          update('material', getValue(values, 'material'));
          update('description', getValue(values, 'description', 'desc'));
          update('connector_type', getValue(values, 'connectortype', 'connector', 'connection', 'cord', 'plug', 'termination'));
          update('certifications', getValue(values, 'certifications', 'certs', 'approval'));
          update('voltage', getValue(values, 'voltage', 'volts', 'vac'));
          update('amperage', getValue(values, 'amperage', 'amps'));
          update('link', getValue(values, 'link', 'url', 'website', 'productpage'));
          update('part_number', partNumber);
          
          // --- ROBUST IMAGE DETECTION ---
          // 1. Try explicit columns
          let imageVal = getValue(values, 'image', 'img', 'photo', 'picture', 'thumbnail', 'asset', 'imageurl');
          
          // 2. Try 'link' or 'url' columns if they look like images
          if (!imageVal) {
             const possibleUrl = getValue(values, 'url', 'link');
             if (possibleUrl.match(/\.(png|jpg|jpeg|webp|gif)/i)) {
                imageVal = possibleUrl;
             }
          }

          // 3. Deep Scan: Check EVERY column for an image URL
          if (!imageVal) {
             const imageCandidate = values.find(v => 
                v.toLowerCase().startsWith('http') && 
                v.toLowerCase().match(/\.(png|jpg|jpeg|webp|gif)($|\?)/)
             );
             if (imageCandidate) {
                imageVal = imageCandidate.trim();
             }
          }
          
          update('image', imageVal);
          // -----------------------------

          // Boolean
          const flagshipVal = getValue(values, 'flagship');
          if (flagshipVal) baseProduct.flagship = (flagshipVal.toLowerCase() === 'true' || flagshipVal === '1');

          // Arrays
          updateArray('actions', getValue(values, 'actions', 'action'));
          updateArray('applications', getValue(values, 'applications', 'application', 'apps'));
          updateArray('recommended_for', getValue(values, 'recommended', 'recommendedfor'));
          
          // Features
          const featureString = getValue(values, 'features', 'feature');
          const features = featureString ? featureString.split(',').map(s => s.trim()) : (existing?.features || []);
          
          if (getValue(values, 'guard').toLowerCase() === 'yes') features.push('shield');
          if (getValue(values, 'gated').toLowerCase() === 'yes') features.push('gated');
          if (getValue(values, 'interlock').toLowerCase() === 'yes') features.push('interlock');
          if (getValue(values, 'shield').toLowerCase() === 'yes') features.push('shield');
          
          baseProduct.features = [...new Set(features)];

          // Custom/Extra Fields
          update('circuitry', getValue(values, 'circuitry', 'circuits', 'circuitscontrolled'));
          update('stages', getValue(values, 'stages', 'stage'));
          update('configuration', getValue(values, 'configuration', 'config'));
          update('pfc_config', getValue(values, 'pfcconfig', 'pfc'));
          update('interior_sub', getValue(values, 'interiorsub', 'interior'));
          update('microswitch', getValue(values, 'microswitch', 'switch'));
          update('potentiometer', getValue(values, 'potentiometer', 'pot'));
          update('color', getValue(values, 'color', 'colour'));

          const pedalCount = getValue(values, 'numberofpedals', 'pedals', 'pedalcount');
          if (pedalCount) baseProduct.pedal_count = parseInt(pedalCount);

          const switchQty = getValue(values, 'microswitchqty', 'switchqty');
          if (switchQty) baseProduct.microswitch_qty = parseInt(switchQty);

          // Pneumatic/Air detection
          const fullText = [
            baseProduct.technology,
            baseProduct.description,
            baseProduct.series
          ].join(' ').toLowerCase();

          const isPneumatic = fullText.includes('pneumatic') || fullText.includes('air ') || fullText.includes(' air');

          if (isPneumatic) {
            baseProduct.technology = 'pneumatic';
          }

          if (fullText.includes('wireless') || fullText.includes('rf ')) {
            baseProduct.technology = 'wireless';
          }

          productsToUpdate.push(baseProduct);

        } catch (err) {
          errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      // DEBUG PREVIEW
      if (productsToUpdate.length > 0) {
         const p = productsToUpdate[0];
         setDebugInfo(`
         ✅ Processed ${productsToUpdate.length} products
         
         🔍 PREVIEW (First Item):
         ID: ${p.id}
         Part: ${p.part_number}
         Image: ${p.image || '❌ MISSING'}
         Tech: ${p.technology}
         Conn: ${p.connector_type || '(empty)'}
         `);
      } else {
         setDebugInfo('❌ No valid products found. Check if your CSV has headers.');
      }

      setResult({ success: productsToUpdate.length, errors });
      if (productsToUpdate.length > 0) {
        onImport(productsToUpdate);
      }

    } catch (err) {
      setResult({ success: 0, errors: [err instanceof Error ? err.message : 'Import failed'] });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Bulk Import / Update</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-900 mb-2">Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Smart Update:</strong> Existing products (matched by ID or Part Number) are UPDATED. New ones are CREATED.</li>
            <li><strong>Empty Cells:</strong> Leaving a cell empty in the CSV keeps the existing data in Supabase (safe to update partial info).</li>
            <li><strong>Images:</strong> Paste the full URL. Headers like 'Image', 'Img', 'Photo' are automatically detected.</li>
            <li><strong>Pneumatic/Air:</strong> The system automatically detects air switches and removes electrical connector data.</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" /> Download Template
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <FileText className="w-5 h-5" />
            {importing ? 'Processing...' : 'Upload CSV'}
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={importing} />
          </label>
        </div>

        {onDeleteAll && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Danger Zone
            </h4>
            <p className="text-sm text-gray-500 mb-3">
              Need to start fresh? You can delete all existing products before importing new data.
            </p>
            <button 
              onClick={onDeleteAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Data
            </button>
          </div>
        )}

        {debugInfo && (
           <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap shadow-inner">
              {debugInfo}
           </div>
        )}

        {result && result.errors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
             <div className="flex items-center gap-2 font-bold mb-2">
                <AlertCircle className="w-4 h-4" /> Import Warnings
             </div>
             <ul className="list-disc list-inside space-y-1">
                {result.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                {result.errors.length > 5 && <li>...and {result.errors.length - 5} more</li>}
             </ul>
          </div>
        )}
      </div>
    </div>
  );
}
