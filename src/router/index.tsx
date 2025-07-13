import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "../pages/Home";
import Member from "../pages/Member";
import Header from "@/components/custom/Header";
import {HeaderProvider} from "@/provider/HeaderProvider.tsx";
import ErrorPage from "@/pages/ErrorPage";
import Help from "@/pages/Help.tsx";
import {ThemeProvider} from "@/components/custom/ThemeProvider";

const AppLayout = () => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <HeaderProvider>
                <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
                    <Header/>
                    <main className="flex-grow m-4 mt-1">
                        <div className={`mx-auto container`}>
                            <Outlet/>
                        </div>
                    </main>
                </div>
            </HeaderProvider>
        </ThemeProvider>
    );
};

const router = createBrowserRouter([
    {
        element: <AppLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/member/:name",
                element: <Member/>,
            },
            {
                path: "/help",
                element: <Help/>
            }
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>;
}