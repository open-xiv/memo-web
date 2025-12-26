import twAnimate from "tw-animate-css";

export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            content: {
                "card-border": "hsl(var(--card-border))",
                "card-ring": "hsl(var(--card-ring))",

                "primary-border": "hsl(var(--primary-border))",
                "primary-ring": "hsl(var(--primary-ring))",

                "secondary-border": "hsl(var(--secondary-border))",
                "secondary-ring": "hsl(var(--secondary-ring))",

                "destructive-foreground": "hsl(var(--destructive-foreground))",
                "destructive-border": "hsl(var(--destructive-border))",
                "destructive-ring": "hsl(var(--destructive-ring))",

                "category": "hsl(var(--category))",
                "category-foreground": "hsl(var(--category-foreground))",
                "category-border": "hsl(var(--category-border))",
                "category-ring": "hsl(var(--category-ring))",

                "zone": "hsl(var(--zone))",
                "zone-foreground": "hsl(var(--zone-foreground))",
                "zone-border": "hsl(var(--zone-border))",
                "zone-ring": "hsl(var(--zone-ring))",

                "paragraph": "hsl(var(--paragraph))",
                "paragraph-foreground": "hsl(var(--paragraph-foreground))",
                "paragraph-ring": "hsl(var(--paragraph-ring))",

                "subparagraph": "hsl(var(--subparagraph))",
                "subparagraph-foreground": "hsl(var(--subparagraph-foreground))",
                "subparagraph-ring": "hsl(var(--subparagraph-ring))",
            },
        },
    },
    plugins: [
        twAnimate,
    ],
};
