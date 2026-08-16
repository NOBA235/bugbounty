import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
const badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "border-transparent bg-violet-500/20 text-violet-300",
      secondary: "border-transparent bg-zinc-800 text-zinc-300",
      success: "border-transparent bg-emerald-500/20 text-emerald-400",
      destructive: "border-transparent bg-red-500/20 text-red-400",
      easy: "border-transparent bg-emerald-500/15 text-emerald-400",
      medium: "border-transparent bg-amber-500/15 text-amber-400",
      hard: "border-transparent bg-orange-500/15 text-orange-400",
      expert: "border-transparent bg-rose-500/15 text-rose-400",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
