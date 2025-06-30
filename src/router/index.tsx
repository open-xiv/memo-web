import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "../pages/Home";
import Member from "../pages/Member";
import Fight from "../pages/Fight";
import Header from "@/components/custom/Header";
import {HeaderProvider} from "@/provider/HeaderProvider.tsx";
import ErrorPage from "@/pages/ErrorPage";

const AppLayout = () => {
    return (
        <HeaderProvider>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header/>
                <main className="flex-grow container mx-auto">
                    <Outlet/>
                </main>
            </div>
        </HeaderProvider>
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
                path: "/fight/:id",
                element: <Fight/>,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>;
}