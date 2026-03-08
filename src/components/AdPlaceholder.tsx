interface AdPlaceholderProps {
  className?: string;
  label?: string;
}

export function AdPlaceholder({ className = '', label = 'Advertisement' }: AdPlaceholderProps) {
  return (
    <div className={`w-full flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30 min-h-[90px] ${className}`}>
      <span className="text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}
