type BrandMarkProps = {
  kind: "mini" | "crest";
  tone: "bronze" | "moonlight" | "raven" | "midnight";
  className?: string;
};

export function BrandMark({ kind, tone, className = "" }: BrandMarkProps) {
  return <span className={`brand-mark brand-mark--${kind} brand-mark--${tone} ${className}`} aria-hidden="true" />;
}
