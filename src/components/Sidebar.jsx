import React from 'react';
import './Sidebar.css';

const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'inventory', icon: '💊', label: 'Inventory' },
    { id: 'lowstock', icon: '⚠️', label: 'Low Stock' },
    { id: 'expiry', icon: '📅', label: 'Expiry Tracker' },
    { id: 'suppliers', icon: '🏭', label: 'Suppliers' },
    { id: 'reports', icon: '📈', label: 'Reports' },
];

export default function Sidebar({ active, onNavigate }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">💉</div>
                <div>
                    <div className="brand-name">PharmaCare</div>
                    <div className="brand-sub">Inventory System</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        {active === item.id && <span className="nav-indicator" />}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="user-avatar">P</div>
                    <div>
                        <div className="user-name">Pharmacist</div>
                        <div className="user-role">Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
