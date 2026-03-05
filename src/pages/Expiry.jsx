import React, { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import './Expiry.css';

export default function Expiry() {
    const { state, getExpiryStatus } = useInventory();
    const { medicines } = state;

    const { expired, soon, safe } = useMemo(() => ({
        expired: medicines.filter(m => getExpiryStatus(m.expiryDate) === 'expired'),
        soon: medicines.filter(m => getExpiryStatus(m.expiryDate) === 'soon'),
        safe: medicines.filter(m => getExpiryStatus(m.expiryDate) === 'safe'),
    }), [medicines, getExpiryStatus]);

    const getDaysLeft = (expiryDate) => {
        const diff = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">📅 Expiry Tracker</h1>
                    <p className="page-subtitle">Monitor medicine expiry dates</p>
                </div>
            </div>

            {/* Summary pills */}
            <div className="expiry-summary">
                <div className="expiry-pill expiry-pill--danger">
                    <span className="pill-num">{expired.length}</span>
                    <span>Expired</span>
                </div>
                <div className="expiry-pill expiry-pill--warning">
                    <span className="pill-num">{soon.length}</span>
                    <span>Expiring within 30 days</span>
                </div>
                <div className="expiry-pill expiry-pill--success">
                    <span className="pill-num">{safe.length}</span>
                    <span>Safe</span>
                </div>
            </div>

            <ExpirySection
                title="🚫 Expired"
                color="danger"
                items={expired}
                getDaysLeft={getDaysLeft}
                emptyText="No expired medicines."
            />
            <ExpirySection
                title="⚠️ Expiring Within 30 Days"
                color="warning"
                items={soon}
                getDaysLeft={getDaysLeft}
                emptyText="No medicines expiring soon."
            />
            <ExpirySection
                title="✅ Safe"
                color="success"
                items={safe}
                getDaysLeft={getDaysLeft}
                emptyText="No safe medicines?"
                collapsed
            />
        </div>
    );
}

function ExpirySection({ title, color, items, getDaysLeft, emptyText, collapsed }) {
    const [open, setOpen] = React.useState(!collapsed);

    return (
        <div className={`expiry-section expiry-section--${color}`} style={{ marginBottom: 18 }}>
            <div className="expiry-section-header" onClick={() => setOpen(o => !o)}>
                <span>{title} ({items.length})</span>
                <span className="collapse-icon">{open ? '▲' : '▼'}</span>
            </div>
            {open && (
                items.length === 0 ? (
                    <div className="card">
                        <div className="card-body">
                            <div className="empty-state" style={{ padding: '24px 0' }}>
                                <p>{emptyText}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="table-wrapper" style={{ border: 'none' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Medicine</th>
                                        <th>Category</th>
                                        <th>Qty</th>
                                        <th>Expiry Date</th>
                                        <th>Days Left</th>
                                        <th>Batch</th>
                                        <th>Supplier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(m => {
                                        const days = getDaysLeft(m.expiryDate);
                                        return (
                                            <tr key={m.id}>
                                                <td><div className="med-name">{m.name}</div></td>
                                                <td><span className="badge badge-secondary">{m.category}</span></td>
                                                <td>{m.qty} {m.unit}</td>
                                                <td>{m.expiryDate}</td>
                                                <td>
                                                    <span className={`days-badge days-badge--${color}`}>
                                                        {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                                                    </span>
                                                </td>
                                                <td><code style={{ fontSize: '0.8rem' }}>{m.batchNo}</code></td>
                                                <td>{m.supplier || '—'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
