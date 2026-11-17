import { useEffect, useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<Record<string,string>>({});

  useEffect(() => {
    const handle = () => {
      const hash = window.location.hash.slice(1) || 'home';
      const [page, ...rest] = hash.split('/');
      setCurrentPage(page || 'home');
      setPageParams(rest.length ? { id: rest[0] } : {});
    };
    handle();
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);

  switch (currentPage) {
    case 'product':   return <ProductPage productId={pageParams.id || ''} />;
    case 'checkout':  return <CheckoutPage productId={pageParams.id || ''} />;
    case 'success':   return <SuccessPage />;
    case 'privacy':   return <PrivacyPage />;
    case 'terms':     return <TermsPage />;
    case 'x9k2m7p4admin': return <AdminPage />;
    default:          return <HomePage />;
  }
}

export default App;
