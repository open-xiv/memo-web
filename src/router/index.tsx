import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Header from '@/components/layout/Header.tsx';
import { HeaderProvider } from '@/provider/HeaderProvider.tsx';
import ErrorPage from '@/pages/ErrorPage';
import { ThemeProvider } from '@/provider/ThemeProvider.tsx';
import Footer from '@/components/layout/Footer.tsx';

const Home = lazy(() => import('../pages/Home'));
const Member = lazy(() => import('../pages/Member'));
const Help = lazy(() => import('../pages/Help'));

const AppLayout = () => {
    return (
        <ThemeProvider attribute={'class'} defaultTheme={'dark'} enableSystem={false}>
            <HeaderProvider>
                <div className="min-h-screen flex flex-col bg-background">
                    <Header />
                    <main className="flex m-4 mt-1">
                        <div className={`mx-auto container`}>
                            <Suspense>
                                <Outlet />
                            </Suspense>
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
                path: '/',
                element: <Home />,
            },
            {
                path: '/member/:player',
                element: <Member />,
            },
            {
                path: '/help',
                element: <Help />,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
