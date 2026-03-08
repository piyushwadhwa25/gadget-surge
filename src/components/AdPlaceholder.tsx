interface AdPlaceholderProps {
  className?: string;
  label?: string;
}

export function AdPlaceholder({ className = '', label = 'Advertisement' }: AdPlaceholderProps) {
  return (
    <div
      className={`w-full flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/20 ${className}`}
      style={{ minHeight: 90, contain: 'layout' }}
    >
      <span className="text-xs text-muted-foreground/60 uppercase tracking-widest select-none">{label}</span>
    </div>
  );
}
