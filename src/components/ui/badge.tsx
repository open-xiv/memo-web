import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px] aria-invalid:ring-status-danger/20 dark:aria-invalid:ring-status-danger/40 aria-invalid:border-status-danger transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-accent-pink text-on-accent-pink [a&]:hover:bg-accent-pink/90",
                secondary:
                    "border-transparent bg-accent-amber text-on-accent-amber [a&]:hover:bg-accent-amber/90",
                destructive:
                    "border-transparent bg-status-danger text-white [a&]:hover:bg-status-danger/90 focus-visible:ring-status-danger/20 dark:focus-visible:ring-status-danger/40 dark:bg-status-danger/60",
                outline:
                    "text-on-surface [a&]:hover:bg-surface-muted [a&]:hover:text-on-surface-muted",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Badge({
                   className,
                   variant,
                   asChild = false,
                   ...props
               }: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
