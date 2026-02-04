interface ProductCountBadgeProps {
  count: number;
}

export function ProductCountBadge({ count }: ProductCountBadgeProps) {
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary/8 text-primary">
      {count} {count === 1 ? 'product' : 'products'}
    </span>
  );
}
