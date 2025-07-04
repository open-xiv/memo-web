import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "../pages/Home";
import Member from "../pages/Member";
import Header from "@/components/custom/Header";
import {HeaderProvider} from "@/provider/HeaderProvider.tsx";
import ErrorPage from "@/pages/ErrorPage";

const AppLayout = () => {
    return (
        <HeaderProvider>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header/>
                <main className="flex-grow m-4 mt-1">
                    <div className={`mx-auto container`}>
                        <Outlet/>
                    </div>
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
            }
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>;
}