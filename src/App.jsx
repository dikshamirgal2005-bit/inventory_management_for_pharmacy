import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import LowStock from './pages/LowStock';
import Expiry from './pages/Expiry';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import './App.css';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  lowstock: 'Low Stock Alerts',
  expiry: 'Expiry Tracker',
  suppliers: 'Suppliers',
  reports: 'Reports',
};

function PageRouter({ active }) {
  switch (active) {
    case 'dashboard': return <Dashboard />;
    case 'inventory': return <Inventory />;
    case 'lowstock': return <LowStock />;
    case 'expiry': return <Expiry />;
    case 'suppliers': return <Suppliers />;
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
  const { stats } = useInventory();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="app-shell">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
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
  return (
    <InventoryProvider>
      <AppShell />
    </InventoryProvider>
  );
}
