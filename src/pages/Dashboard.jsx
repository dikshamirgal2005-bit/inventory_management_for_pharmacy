import React from 'react';
import StatCard from '../components/StatCard';
import { useInventory } from '../context/InventoryContext';
import './Dashboard.css';

export default function Dashboard() {
    const { state, stats, getExpiryStatus } = useInventory();
    const { medicines } = state;

    const recent = [...medicines].slice(0, 5);
    const lowStockItems = medicines.filter(m => m.qty <= m.reorderLevel).slice(0, 5);

    const formatCurrency = (v) => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    return (
        <div className="page">
            {/* Stat Cards */}
            <div className="stats-grid">
                <StatCard icon="💊" label="Total Medicines" value={stats.totalMedicines} color="green" sub="in inventory" />
                <StatCard icon="⚠️" label="Low Stock" value={stats.lowStock} color="red" sub="need restock" />
                <StatCard icon="📅" label="Expiring Soon" value={stats.expiringSoon} color="yellow" sub="within 30 days" />
                <StatCard icon="💰" label="Inventory Value" value={formatCurrency(stats.totalValue)} color="blue" sub="total valuation" />
                {stats.expired > 0 && (
                    <StatCard icon="🚫" label="Expired" value={stats.expired} color="purple" sub="remove immediately" />
                )}
            </div>

            {/* Two-column section */}
            <div className="dashboard-grid">
                {/* Recent Medicines */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📋 Recent Medicines</span>
                    </div>
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Qty</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map(m => {
                                    const expStatus = getExpiryStatus(m.expiryDate);
                                    const isLow = m.qty <= m.reorderLevel;
                                    return (
                                        <tr key={m.id}>
                                            <td><strong>{m.name}</strong></td>
                                            <td><span className="badge badge-secondary">{m.category}</span></td>
                                            <td>{m.qty} {m.unit}</td>
                                            <td>
                                                {isLow
                                                    ? <span className="badge badge-danger">Low Stock</span>
                                                    : expStatus === 'expired'
                                                        ? <span className="badge badge-danger">Expired</span>
                                                        : expStatus === 'soon'
                                                            ? <span className="badge badge-warning">Expiring Soon</span>
                                                            : <span className="badge badge-success">OK</span>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">🔔 Low Stock Alerts</span>
                    </div>
                    {lowStockItems.length === 0 ? (
                        <div className="card-body">
                            <div className="empty-state">
                                <div className="empty-icon">✅</div>
                                <strong>All stock levels are healthy!</strong>
                            </div>
                        </div>
                    ) : (
                        <div className="low-stock-list">
                            {lowStockItems.map(m => (
                                <div key={m.id} className="low-stock-item">
                                    <div>
                                        <div className="low-stock-name">{m.name}</div>
                                        <div className="low-stock-meta">{m.category} · Reorder at {m.reorderLevel}</div>
                                    </div>
                                    <div className="low-stock-qty" style={{ color: m.qty === 0 ? 'var(--danger)' : 'var(--warning)' }}>
                                        {m.qty} left
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
