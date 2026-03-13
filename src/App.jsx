import React, { useState, useEffect } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import LowStock from './pages/LowStock';
import Expiry from './pages/Expiry';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  lowstock: 'Low Stock Alerts',
  expiry: 'Expiry Tracker',
  suppliers: 'Suppliers',
  orders: 'Order Tracking',
  reports: 'Reports',
};

function PageRouter({ active }) {
  switch (active) {
    case 'dashboard': return <Dashboard />;
    case 'inventory': return <Inventory />;
    case 'lowstock': return <LowStock />;
    case 'expiry': return <Expiry />;
    case 'suppliers': return <Suppliers />;
    case 'orders': return <OrderTracking />;
    case 'reports': return <Reports />;
    default: return <Dashboard />;
  }
}

function Toast() {
  const { state } = useInventory();
  if (!state.toast) return null;
  return (
    <div className={`toast toast-${state.toast.type}`}>
      <span>{state.toast.type === 'success' ? '✅' : state.toast.type === 'danger' ? '❌' : 'ℹ️'}</span>
      {state.toast.message}
    </div>
  );
}

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { stats } = useInventory();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="app-shell">
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <div className="header-page-title">{PAGE_LABELS[activePage]}</div>
            <div className="header-date">{dateStr}</div>
          </div>
          <div className="header-right">
            <div className="header-badge" title={`${stats.lowStock} low stock alerts`}>
              <div className="header-badge-icon" onClick={() => setActivePage('lowstock')}>⚠️</div>
              {stats.lowStock > 0 && <span className="badge-dot" />}
            </div>
            <div className="header-badge" title={`${stats.expiringSoon} expiring soon`}>
              <div className="header-badge-icon" onClick={() => setActivePage('expiry')}>📅</div>
              {stats.expiringSoon > 0 && <span className="badge-dot" />}
            </div>
          </div>
        </header>
        <main className="page-content">
          <PageRouter active={activePage} />
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const isRegistering = React.useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (isRegistering.current) return;
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading PharmaCare...</div>;
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onNavigate={setAuthView} onLoginSuccess={() => { }} />
    ) : (
      <Register
        onNavigate={setAuthView}
        onRegisterSuccess={() => setAuthView('login')}
        onRegisterStart={() => { isRegistering.current = true; }}
        onRegisterEnd={() => { isRegistering.current = false; }}
      />
    );
  }

  return (
    <InventoryProvider>
      <AppShell />
    </InventoryProvider>
  );
}
