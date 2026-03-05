import React from 'react';
import { useInventory } from '../context/InventoryContext';
import './LowStock.css';

export default function LowStock() {
    const { state, getExpiryStatus } = useInventory();
    const lowItems = state.medicines.filter(m => m.qty <= m.reorderLevel);

    const critical = lowItems.filter(m => m.qty === 0);
    const warning = lowItems.filter(m => m.qty > 0 && m.qty <= m.reorderLevel);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">⚠️ Low Stock Alerts</h1>
                    <p className="page-subtitle">{lowItems.length} item{lowItems.length !== 1 ? 's' : ''} need restocking</p>
                </div>
            </div>

            {lowItems.length === 0 ? (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-icon">✅</div>
                            <strong>All stock levels are healthy!</strong>
                            <p>No medicines are below their reorder levels.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {critical.length > 0 && (
                        <div className="alert-section">
                            <div className="alert-section-header critical">
                                🚫 Out of Stock ({critical.length})
                            </div>
                            <div className="card">
                                <div className="table-wrapper" style={{ border: 'none' }}>
                                    <StockTable items={critical} getExpiryStatus={getExpiryStatus} />
                                </div>
                            </div>
                        </div>
                    )}

                    {warning.length > 0 && (
                        <div className="alert-section">
                            <div className="alert-section-header warning">
                                ⚠️ Low Stock ({warning.length})
                            </div>
                            <div className="card">
                                <div className="table-wrapper" style={{ border: 'none' }}>
                                    <StockTable items={warning} getExpiryStatus={getExpiryStatus} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function StockTable({ items, getExpiryStatus }) {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Current Qty</th>
                    <th>Reorder Level</th>
                    <th>Deficit</th>
                    <th>Supplier</th>
                    <th>Expiry</th>
                </tr>
            </thead>
            <tbody>
                {items.map(m => {
                    const deficit = m.reorderLevel - m.qty;
                    const expStatus = getExpiryStatus(m.expiryDate);
                    return (
                        <tr key={m.id}>
                            <td>
                                <div className="med-name">{m.name}</div>
                                <div className="med-meta">{m.unit} · Batch: {m.batchNo}</div>
                            </td>
                            <td><span className="badge badge-secondary">{m.category}</span></td>
                            <td>
                                <span className={`stock-qty ${m.qty === 0 ? 'stock-zero' : 'stock-low'}`}>
                                    {m.qty}
                                </span>
                            </td>
                            <td>{m.reorderLevel}</td>
                            <td><span className="deficit-badge">−{deficit}</span></td>
                            <td><span className="supplier-name">{m.supplier || '—'}</span></td>
                            <td>
                                <span className={`expiry-cell expiry-${expStatus}`}>{m.expiryDate}</span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
