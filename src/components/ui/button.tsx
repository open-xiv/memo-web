import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px] aria-invalid:ring-status-danger/20 dark:aria-invalid:ring-status-danger/40 aria-invalid:border-status-danger",
    {
        variants: {
            variant: {
                default:
                    "bg-accent-pink text-on-accent-pink shadow-xs hover:bg-accent-pink/90",
                destructive:
                    "bg-status-danger text-white shadow-xs hover:bg-status-danger/90 focus-visible:ring-status-danger/20 dark:focus-visible:ring-status-danger/40 dark:bg-status-danger/60",
                outline:
                    "border bg-surface shadow-xs hover:bg-surface-muted hover:text-on-surface-muted dark:bg-surface-input/30 dark:border-surface-input dark:hover:bg-surface-input/50",
                secondary:
                    "bg-accent-amber text-on-accent-amber shadow-xs hover:bg-accent-amber/80",
                ghost:
                    "hover:bg-surface-muted hover:text-on-surface-muted dark:hover:bg-surface-muted/50",
                link: "text-accent-pink-strong underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
                    className,
                    variant,
                    size,
                    asChild = false,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
