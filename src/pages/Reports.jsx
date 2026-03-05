import React, { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { CATEGORIES } from '../data/sampleData';
import './Reports.css';

export default function Reports() {
    const { state, stats, getExpiryStatus } = useInventory();
    const { medicines } = state;

    const categoryData = useMemo(() => {
        return CATEGORIES.map(cat => {
            const items = medicines.filter(m => m.category === cat);
            const value = items.reduce((sum, m) => sum + m.qty * m.price, 0);
            return { cat, count: items.length, value };
        }).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
    }, [medicines]);

    const maxCount = Math.max(...categoryData.map(d => d.count), 1);

    const statusData = useMemo(() => ({
        ok: medicines.filter(m => m.qty > m.reorderLevel && getExpiryStatus(m.expiryDate) === 'safe').length,
        lowStock: medicines.filter(m => m.qty <= m.reorderLevel).length,
        expiring: medicines.filter(m => getExpiryStatus(m.expiryDate) === 'soon').length,
        expired: medicines.filter(m => getExpiryStatus(m.expiryDate) === 'expired').length,
    }), [medicines, getExpiryStatus]);

    const formatCurrency = (v) => '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">📈 Reports & Analytics</h1>
                    <p className="page-subtitle">Overview of your pharmacy inventory</p>
                </div>
            </div>

            {/* Summary row */}
            <div className="reports-summary">
                <div className="summary-box">
                    <div className="summary-value">{stats.totalMedicines}</div>
                    <div className="summary-label">Total SKUs</div>
                </div>
                <div className="summary-box summary-box--danger">
                    <div className="summary-value">{stats.lowStock}</div>
                    <div className="summary-label">Low Stock</div>
                </div>
                <div className="summary-box summary-box--warning">
                    <div className="summary-value">{stats.expiringSoon}</div>
                    <div className="summary-label">Expiring Soon</div>
                </div>
                <div className="summary-box summary-box--blue">
                    <div className="summary-value">{formatCurrency(stats.totalValue)}</div>
                    <div className="summary-label">Total Value</div>
                </div>
            </div>

            <div className="reports-grid">
                {/* Category Bar Chart */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📊 Stock by Category</span>
                    </div>
                    <div className="card-body bar-chart">
                        {categoryData.length === 0 ? (
                            <div className="empty-state"><p>No data yet.</p></div>
                        ) : categoryData.map(d => (
                            <div key={d.cat} className="bar-row">
                                <div className="bar-label" title={d.cat}>{d.cat}</div>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${(d.count / maxCount) * 100}%` }}
                                    >
                                        <span className="bar-val">{d.count}</span>
                                    </div>
                                </div>
                                <div className="bar-value">{formatCurrency(d.value)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Donut-style */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">🟢 Stock Health Overview</span>
                    </div>
                    <div className="card-body">
                        <div className="status-rows">
                            <StatusRow label="Healthy" count={statusData.ok} color="green" total={medicines.length} />
                            <StatusRow label="Low Stock" count={statusData.lowStock} color="red" total={medicines.length} />
                            <StatusRow label="Expiring Soon" count={statusData.expiring} color="yellow" total={medicines.length} />
                            <StatusRow label="Expired" count={statusData.expired} color="purple" total={medicines.length} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top value medicines */}
            <div className="card" style={{ marginTop: 20 }}>
                <div className="card-header">
                    <span className="card-title">💰 Top 10 Medicines by Value</span>
                </div>
                <div className="table-wrapper" style={{ border: 'none' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th><th>Medicine</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...medicines]
                                .sort((a, b) => (b.qty * b.price) - (a.qty * a.price))
                                .slice(0, 10)
                                .map((m, i) => (
                                    <tr key={m.id}>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                                        <td><strong>{m.name}</strong></td>
                                        <td><span className="badge badge-secondary">{m.category}</span></td>
                                        <td>{m.qty}</td>
                                        <td>{formatCurrency(m.price)}</td>
                                        <td><strong style={{ color: 'var(--primary-dark)' }}>{formatCurrency(m.qty * m.price)}</strong></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusRow({ label, count, color, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const colors = {
        green: 'var(--primary)', red: 'var(--danger)',
        yellow: 'var(--warning)', purple: 'var(--secondary)'
    };
    return (
        <div className="status-row">
            <div className="status-row-header">
                <span className="status-label" style={{ color: colors[color] }}>{label}</span>
                <span className="status-count">{count} ({pct}%)</span>
            </div>
            <div className="status-track">
                <div className="status-fill" style={{ width: `${pct}%`, background: colors[color] }} />
            </div>
        </div>
    );
}
