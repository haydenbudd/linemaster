import csvText from './products.csv?raw';

export interface CatalogProduct {
  id: string;
  series: string;
  part: string;
  type: 'Electrical' | 'Electrical Pneumatic' | 'Pneumatic Flow Control';
  onOff: 'Maintained' | 'Momentary';
  wireless: boolean;
  linear: boolean;
  configuration: string;
  numberOfPedals: number;
  circuitsControlled: number;
  stages: string;
  guard: string;
  ipRating: string;
  gated: boolean;
  material: string;
  color: string;
  link: string;
  pfcConfig: string;
}

function parseCSVLine(line: string): string[] {
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
}

function parseCSV(text: string): CatalogProduct[] {
  const lines = text.trim().split('\n');
  return lines.slice(1).filter(line => line.trim()).map((line, index) => {
    const f = parseCSVLine(line);
    return {
      id: `prod-${index}`,
      series: f[0]?.trim() || '',
      part: f[1]?.trim() || '',
      type: (f[7]?.trim() || 'Electrical') as CatalogProduct['type'],
      onOff: f[4]?.trim() === 'Main' ? 'Maintained' as const : 'Momentary' as const,
      wireless: f[5]?.trim() === 'Yes',
      linear: f[6]?.trim() === 'Yes',
      configuration: f[18]?.trim() || '',
      numberOfPedals: parseInt(f[14]?.trim()) || 1,
      circuitsControlled: parseInt(f[15]?.trim()) || 0,
      stages: f[17]?.trim() || '',
      guard: f[24]?.trim() || '',
      ipRating: f[26]?.trim() || '',
      gated: f[27]?.trim() === 'Yes',
      material: f[29]?.trim() || '',
      color: f[30]?.trim() || '',
      link: f[31]?.trim() || '',
      pfcConfig: f[13]?.trim() || '',
    };
  }).filter(p => p.series && p.part);
}

export const catalogProducts = parseCSV(csvText);
export const uniqueSeries = [...new Set(catalogProducts.map(p => p.series))].sort();
export const uniqueTypes = [...new Set(catalogProducts.map(p => p.type))].sort();
export const uniqueConfigurations = [...new Set(catalogProducts.map(p => p.configuration).filter(Boolean))].sort();
export const uniqueMaterials = [...new Set(catalogProducts.map(p => p.material).filter(Boolean))].sort();
export const uniqueColors = [...new Set(catalogProducts.map(p => p.color).filter(Boolean))].sort();
