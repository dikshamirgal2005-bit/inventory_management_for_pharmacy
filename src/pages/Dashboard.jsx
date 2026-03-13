import React from 'react';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip } from 'recharts';
import StatCard from '../components/StatCard';
import { useInventory } from '../context/InventoryContext';
import './Dashboard.css';

export default function Dashboard() {
    const { state, stats, getExpiryStatus } = useInventory();
    const { medicines } = state;

    const recent = [...medicines].slice(0, 5);
    const lowStockItems = medicines.filter(m => m.qty <= m.reorderLevel).slice(0, 5);

    const formatCurrency = (v) => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    // --- Chart Data Processing ---

    // 1. Stock Status Pie Chart
    let healthy = 0;
    medicines.forEach(m => {
        if (m.qty > m.reorderLevel) healthy++;
    });

    const stockStatusData = [
        { name: 'Healthy Stock', value: healthy, color: '#10b981' }, // green
        { name: 'Low Stock', value: stats.lowStock, color: '#f59e0b' }, // warning/yellow
        { name: 'Expired', value: stats.expired, color: '#ef4444' } // danger/red
    ].filter(d => d.value > 0); // only show portions that have values

    // 2. Weekly Stock Movement (Mock Data for Hackathon presentation showing trend)
    const weeklyActivityData = [
        { day: 'Mon', supplied: 45, dispensed: 60 },
        { day: 'Tue', supplied: 100, dispensed: 40 },
        { day: 'Wed', supplied: 20, dispensed: 85 },
        { day: 'Thu', supplied: 0, dispensed: 45 },
        { day: 'Fri', supplied: 150, dispensed: 90 },
        { day: 'Sat', supplied: 30, dispensed: 110 },
        { day: 'Sun', supplied: 0, dispensed: 30 },
    ];

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

            {/* Charts Section */}
            <div className="dashboard-grid charts-section" style={{ marginBottom: '20px' }}>
                {/* Stock Status Pie Chart */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📊 Inventory Status</span>
                    </div>
                    <div className="card-body" style={{ height: '300px', padding: '10px' }}>
                        {stockStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stockStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stockStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <PieTooltip
                                        formatter={(value) => [`${value} items`, 'Count']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-state">No inventory data available</div>
                        )}
                    </div>
                </div>

                {/* Weekly Activity Bar Chart */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📈 Weekly Pharmacy Activity</span>
                    </div>
                    <div className="card-body" style={{ height: '300px', padding: '10px 20px 10px 0' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                <BarTooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
                                <Bar dataKey="supplied" name="Stock Added" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="dispensed" name="Stock Dispensed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
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
