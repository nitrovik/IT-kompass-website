import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-transform duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#269BFF] text-[#07111F] shadow-[0_12px_30px_rgba(38,155,255,.24)] hover:-translate-y-0.5 hover:bg-[#6EC5FF]",
        secondary: "bg-white text-[#07111F] hover:-translate-y-0.5 hover:bg-slate-100",
        outline: "border border-white/15 bg-white/[0.03] text-white hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07]",
        ghost: "text-slate-200 hover:bg-white/[0.05] hover:text-white",
        link: "p-0 text-[#8bd1ff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-6 text-base",
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
