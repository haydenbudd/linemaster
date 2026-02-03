interface ProductCountBadgeProps {
  count: number;
}

export function ProductCountBadge({ count }: ProductCountBadgeProps) {
  return (
    <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
      {count} {count === 1 ? 'product' : 'products'}
    </span>
  );
}
