import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Member from "../pages/Member";
import Header from "@/components/layout/Header.tsx";
import { HeaderProvider } from "@/provider/HeaderProvider.tsx";
import ErrorPage from "@/pages/ErrorPage";
import Help from "@/pages/Help.tsx";
import { ThemeProvider } from "@/provider/ThemeProvider.tsx";
import Footer from "@/components/layout/Footer.tsx";

const AppLayout = () => {
    return (
            <ThemeProvider attribute={"class"} defaultTheme={"dark"} enableSystem={false}>
                <HeaderProvider>
                    <div className="min-h-screen flex flex-col bg-background">
                        <Header />
                        <main className="flex m-4 mt-1">
                            <div className={`mx-auto container`}>
                                <Outlet />
                            </div>
                        </main>
                        <Footer />
                    </div>
                </HeaderProvider>
            </ThemeProvider>
    );
};

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/member/:player",
                element: <Member />,
            },
            {
                path: "/help",
                element: <Help />,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}