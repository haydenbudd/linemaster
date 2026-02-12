import { Suspense, lazy } from 'react';
import { Router, Routes } from '@/app/components/Router';
import { Layout } from '@/app/components/layout/Layout';
import HomePage from '@/app/pages/HomePage';
import ProductsPage from '@/app/pages/ProductsPage';
import CustomSolutionsPage from '@/app/pages/CustomSolutionsPage';
import AboutPage from '@/app/pages/AboutPage';
import IndustriesPage from '@/app/pages/IndustriesPage';
import ServicesPage from '@/app/pages/ServicesPage';

const AdminContainer = lazy(() =>
  import('@/app/components/admin/AdminContainer').then(module => ({
    default: module.AdminContainer
  }))
);

function AppRoutes() {
  const routes = [
    { path: '/', component: HomePage },
    { path: '/products', component: ProductsPage },
    { path: '/custom-solutions', component: CustomSolutionsPage },
    { path: '/about', component: AboutPage },
    { path: '/industries', component: IndustriesPage },
    { path: '/services', component: ServicesPage },
  ];

  return <Routes routes={routes} />;
}

function AdminRoute() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#0A1628] text-white">Loading admin...</div>}>
      <AdminContainer />
    </Suspense>
  );
}

export default function App() {
  // Check if on admin route
  if (window.location.pathname === '/admin') {
    return <AdminRoute />;
  }

  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}
