import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-on-surface placeholder:text-on-surface-muted selection:bg-accent-pink selection:text-on-accent-pink dark:bg-surface-input/30 border-surface-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-status-danger/20 dark:aria-invalid:ring-status-danger/40 aria-invalid:border-status-danger",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
