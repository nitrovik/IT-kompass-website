import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition duration-200 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] text-white shadow-brand hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(8,124,240,.28)]",
        secondary: "border border-line-strong bg-white text-ink hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(16,42,77,.08)]",
        outline: "border border-line-strong bg-white/70 text-ink hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white",
        onDark: "border border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/10",
        ghost: "text-ink hover:bg-sky",
        link: "p-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-10 px-4 text-[13px]",
        lg: "h-12 px-6 text-[15px]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
));
Button.displayName = "Button";

export { buttonVariants };
