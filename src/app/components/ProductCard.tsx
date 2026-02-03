import { ArrowRight, Sparkles, CheckCircle, Plug } from 'lucide-react';
import { Product } from '@/app/lib/api';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getProxiedImageUrl } from '@/app/utils/imageProxy';

interface ProductCardProps {
  product: Product;
  matchReasons?: {
    technology?: string;
    action?: string;
    environment?: string;
    features?: string[];
  };
}

export function ProductCard({ product, matchReasons }: ProductCardProps) {
  const dutyColors = {
    heavy: { 
      bg: 'from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800', 
      badgeBg: 'bg-slate-700 dark:bg-slate-600',
      text: 'text-white'
    },
    medium: { 
      bg: 'from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800', 
      badgeBg: 'bg-blue-700 dark:bg-blue-600',
      text: 'text-white'
    },
    light: { 
      bg: 'from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800', 
      badgeBg: 'bg-teal-700 dark:bg-teal-600',
      text: 'text-white'
    },
  };

  const dutyColor = dutyColors[product.duty];
  
  // Format connection type for display
  const formatConnection = (type?: string) => {
    if (!type || type === 'undefined') return null;
    return type.replace(/-/g, ' '); // Replace dashes with spaces
  };

  const connectionLabel = formatConnection(product.connector_type);
  
  // Determine if pre-wired (comes with cord attached)
  const isPreWired = connectionLabel && (
    connectionLabel.toLowerCase().includes('pre-wired') ||
    connectionLabel.toLowerCase().includes('pre wired')
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden group flex flex-col h-full">
      {/* Badges */}
      <div className="flex gap-2 p-4 bg-gradient-to-r from-accent/50 to-transparent min-h-[60px] items-start">
        {product.flagship && (
          <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            Flagship
          </div>
        )}
        <div className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">
          {product.ip}
        </div>
      </div>

      {/* Product Image */}
      <div
        className={`h-64 flex items-center justify-center p-8 bg-gradient-to-br ${dutyColor.bg}`}
      >
        <ImageWithFallback
          src={getProxiedImageUrl(product.image)}
          alt={product.series}
          className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2 min-h-[32px] flex flex-wrap items-baseline gap-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {product.series}
          </h3>
          {product.part_number || product.id ? (
            <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
              # {product.part_number || product.id.toUpperCase()}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed min-h-[44px]">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 min-h-[38px]">
          <span className={`flex items-center justify-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${dutyColor.badgeBg} ${dutyColor.text}`}>
            {product.duty}
          </span>
          <span className="flex items-center justify-center px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full">
            {product.material}
          </span>
          {connectionLabel && (
            <span className={`flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${
              isPreWired 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            }`}>
              <Plug className="w-3 h-3" />
              {connectionLabel}
            </span>
          )}
        </div>

        {/* Technical Specs */}
        {(product.voltage || product.amperage || product.certifications || product.circuitry) && (
          <div className="mb-4 grid grid-cols-2 gap-y-2 text-xs text-muted-foreground border-t border-b border-border/50 py-3">
             {product.voltage && (
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Voltage</span>
                 <span>{product.voltage}</span>
               </div>
             )}
             {product.amperage && (
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Amperage</span>
                 <span>{product.amperage}</span>
               </div>
             )}
             {product.circuitry && (
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Circuitry</span>
                 <span>{product.circuitry}</span>
               </div>
             )}
             {product.certifications && (
               <div className="col-span-2 flex flex-col mt-1">
                 <span className="font-semibold text-foreground">Certifications</span>
                 <span>{product.certifications}</span>
               </div>
             )}
          </div>
        )}

        {/* Match Reasons */}
        {matchReasons && (
          <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-green-900 dark:text-green-300">
                Why This Product
              </span>
            </div>
            <div className="space-y-1.5">
              {matchReasons.technology && (
                <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-300">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Matches your <strong>{matchReasons.technology}</strong> technology</span>
                </div>
              )}
              {matchReasons.action && (
                <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-300">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Supports <strong>{matchReasons.action}</strong> action</span>
                </div>
              )}
              {matchReasons.environment && (
                <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-300">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Rated for <strong>{matchReasons.environment}</strong> environments</span>
                </div>
              )}
              {matchReasons.features && matchReasons.features.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-300">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Includes <strong>{matchReasons.features.join(', ')}</strong></span>
                </div>
              )}
              {product.flagship && (
                <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                  <span className="text-amber-500 dark:text-amber-400 mt-0.5">⭐</span>
                  <span><strong>Flagship Product</strong> - Our most popular choice</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Button - pushed to bottom */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold rounded-xl transition-all shadow-md hover:shadow-xl group mt-auto"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}