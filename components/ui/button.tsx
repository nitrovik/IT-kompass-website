import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
  Knapper: løfter seg 1 px, får litt mer lys og en lysrefleks som glir over (primær),
  og pilen (klassen btn-arrow) flytter seg. Legg «group» på lenken for pilbevegelsen.
*/
const buttonVariants = cva(
  "group inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold tracking-[-.005em] transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-px active:translate-y-0 active:duration-75 disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "btn-sheen bg-[linear-gradient(180deg,#1580e6,#0a6ed1_55%,#0861bd)] text-white shadow-brand hover:shadow-[0_1px_1px_rgba(7,88,173,.25),0_16px_32px_-10px_rgba(10,110,209,.7)]",
        secondary: "border border-line-strong bg-white text-ink shadow-[0_1px_2px_rgba(14,39,71,.05)] hover:border-[#9fc0e0] hover:shadow-[0_10px_24px_-12px_rgba(14,39,71,.25)]",
        outline: "border border-line-strong bg-white/60 text-ink backdrop-blur hover:border-brand/40 hover:bg-white",
        onDark: "border border-white/20 bg-white/[.06] text-white backdrop-blur hover:border-white/40 hover:bg-white/[.12]",
        light: "btn-sheen bg-white text-navy-900 shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)] hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,.55)]",
        ghost: "text-ink hover:bg-sky",
        link: "p-0 text-brand hover:translate-y-0",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-10 px-4 text-[13.5px]",
        lg: "h-[52px] px-6 text-[15px]",
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
