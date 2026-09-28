import { cn } from "@/lib/utils";

export function Frame({
  children,
  className,
  tone = "quiet",
  shape = "rect",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "quiet" | "strong";
  shape?: "rect" | "pill" | "box";
}) {
  return (
    <span
      className={cn(
        "border p-[2px] transition-colors duration-200",
        shape === "pill" && "inline-flex rounded-full",
        shape === "rect" && "inline-flex shrink-0 rounded-[11px]",
        shape === "box" && "flex w-full rounded-lg",
        tone === "quiet" ? "border-white/[0.09]" : "border-white/[0.2]",
        className
      )}
    >
      {children}
    </span>
  );
}
