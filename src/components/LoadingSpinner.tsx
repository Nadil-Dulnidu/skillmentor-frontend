import { cn } from "@/lib/utils";
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  "data-id"?: string;
}
export const LoadingSpinner = ({ size = "md", text, className, "data-id": dataId }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} data-id={dataId}>
      <div className={cn("animate-spin rounded-full border-primary/30 border-t-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
};
