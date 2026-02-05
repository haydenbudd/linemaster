import { ArrowRight, Sparkles, CheckCircle, Plug } from 'lucide-react';
import { Product } from '@/app/lib/api';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getProxiedImageUrl } from '@/app/utils/imageProxy';
import { GlassCard } from '@/app/components/GlassCard';

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
  const dutyColors: Record<string, { badge: string }> = {
    heavy: { badge: 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f]' },
    medium: { badge: 'bg-primary text-primary-foreground' },
    light: { badge: 'bg-[#34c759] text-white' },
  };

  const dutyColor = dutyColors[product.duty] || dutyColors.medium;

  const formatConnection = (type?: string) => {
    if (!type || type === 'undefined') return null;
    return type.replace(/-/g, ' ');
  };

  const connectionLabel = formatConnection(product.connector_type);

  const isPreWired = connectionLabel && (
    connectionLabel.toLowerCase().includes('pre-wired') ||
    connectionLabel.toLowerCase().includes('pre wired')
  );

  return (
    <GlassCard
      cornerRadius={22}
      padding="0"
      blurAmount={0.15}
      saturation={140}
      displacementScale={40}
      overLight
      tiltOnHover
      className="flex flex-col h-full group"
    >
      {/* Badges */}
      <div className="flex gap-2 p-4 min-h-[52px] items-start">
        {product.flagship && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#ff9500] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
            <Sparkles className="w-3 h-3" />
            Flagship
          </div>
        )}
        <div className="flex items-center px-2.5 py-1 bg-primary/8 text-primary text-[10px] font-semibold uppercase tracking-wider rounded-full border border-primary/15">
          {product.ip}
        </div>
      </div>

      {/* Product Image */}
      <div className="h-40 sm:h-56 flex items-center justify-center p-6 bg-black/[0.02] dark:bg-white/[0.02]">
        <ImageWithFallback
          src={getProxiedImageUrl(product.image)}
          alt={product.series}
          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-[1.02]"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1.5 min-h-[28px] flex flex-wrap items-baseline gap-2">
          <h3 className="text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {product.series}
          </h3>
          {product.part_number || product.id ? (
            <span className="text-xs font-medium text-muted-foreground">
              #{product.part_number || String(product.id).toUpperCase()}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed min-h-[40px]">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5 min-h-[32px]">
          <span className={`flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${dutyColor.badge}`}>
            {product.duty}
          </span>
          <span className="flex items-center px-2.5 py-1 bg-black/[0.04] dark:bg-white/[0.06] text-foreground text-[10px] font-semibold uppercase tracking-wider rounded-full">
            {product.material}
          </span>
          {connectionLabel && (
            <span className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
              isPreWired
                ? 'bg-[#af52de]/10 text-[#af52de]'
                : 'bg-[#ff9500]/10 text-[#ff9500]'
            }`}>
              <Plug className="w-2.5 h-2.5" />
              {connectionLabel}
            </span>
          )}
        </div>

        {/* Technical Specs */}
        {(product.voltage || product.amperage || product.certifications || product.circuitry) && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs text-muted-foreground border-t border-foreground/5 py-3">
             {product.voltage && (
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground text-[11px]">Voltage</span>
                 <span>{product.voltage}</span>
               </div>
             )}
             {product.amperage && (
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground text-[11px]">Amperage</span>
                 <span>{product.amperage}</span>
               </div>
             )}
             {product.circuitry && (
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground text-[11px]">Circuitry</span>
                 <span>{product.circuitry}</span>
               </div>
             )}
             {product.certifications && (
               <div className="col-span-1 sm:col-span-2 flex flex-col mt-1">
                 <span className="font-semibold text-foreground text-[11px]">Certifications</span>
                 <span className="line-clamp-2">{product.certifications}</span>
               </div>
             )}
          </div>
        )}

        {/* Match Reasons */}
        {matchReasons && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#34c759]/6 border border-[#34c759]/12">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#34c759]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#34c759]">
                Why This Product
              </span>
            </div>
            <div className="space-y-1">
              {matchReasons.technology && (
                <div className="flex items-start gap-1.5 text-xs text-foreground/70">
                  <span className="text-[#34c759] mt-0.5 text-[10px]">&#10003;</span>
                  <span>Matches <strong className="text-foreground">{matchReasons.technology}</strong></span>
                </div>
              )}
              {matchReasons.action && (
                <div className="flex items-start gap-1.5 text-xs text-foreground/70">
                  <span className="text-[#34c759] mt-0.5 text-[10px]">&#10003;</span>
                  <span>Supports <strong className="text-foreground">{matchReasons.action}</strong></span>
                </div>
              )}
              {matchReasons.environment && (
                <div className="flex items-start gap-1.5 text-xs text-foreground/70">
                  <span className="text-[#34c759] mt-0.5 text-[10px]">&#10003;</span>
                  <span>Rated for <strong className="text-foreground">{matchReasons.environment}</strong></span>
                </div>
              )}
              {matchReasons.features && matchReasons.features.length > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-foreground/70">
                  <span className="text-[#34c759] mt-0.5 text-[10px]">&#10003;</span>
                  <span>Includes <strong className="text-foreground">{matchReasons.features.join(', ')}</strong></span>
                </div>
              )}
              {product.flagship && (
                <div className="flex items-start gap-1.5 text-xs text-[#ff9500]">
                  <span className="mt-0.5 text-[10px]">&#9733;</span>
                  <span><strong>Flagship</strong> - Most popular choice</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Button */}
        <a
          href={product.link || `https://linemaster.com/?s=${encodeURIComponent(product.part_number || product.series || product.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 mt-auto text-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </GlassCard>
  );
}
