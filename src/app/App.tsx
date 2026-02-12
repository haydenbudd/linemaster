import { Suspense, lazy } from 'react';
import { Router, Routes } from '@/app/components/Router';
import { Layout } from '@/app/components/layout/Layout';
import HomePage from '@/app/pages/HomePage';
import ProductsPage from '@/app/pages/ProductsPage';
import CustomSolutionsPage from '@/app/pages/CustomSolutionsPage';
import AboutPage from '@/app/pages/AboutPage';
import IndustriesPage from '@/app/pages/IndustriesPage';
import ServicesPage from '@/app/pages/ServicesPage';
import ContactPage from '@/app/pages/ContactPage';
import RequestQuotePage from '@/app/pages/RequestQuotePage';
import CareersPage from '@/app/pages/CareersPage';
import SupportPage from '@/app/pages/SupportPage';
import BlogPage from '@/app/pages/BlogPage';
import CatalogPage from '@/app/pages/CatalogPage';
import SwitchWizardPage from '@/app/pages/SwitchWizardPage';
import PrivacyPage from '@/app/pages/PrivacyPage';
import TermsPage from '@/app/pages/TermsPage';

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
    { path: '/contact', component: ContactPage },
    { path: '/request-quote', component: RequestQuotePage },
    { path: '/careers', component: CareersPage },
    { path: '/support', component: SupportPage },
    { path: '/blog', component: BlogPage },
    { path: '/catalog', component: CatalogPage },
    { path: '/switch-wizard', component: SwitchWizardPage },
    { path: '/privacy', component: PrivacyPage },
    { path: '/terms', component: TermsPage },
    { path: '/shop', component: ProductsPage },
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
