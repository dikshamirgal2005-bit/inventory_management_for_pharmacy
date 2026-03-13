import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import './OrderTracking.css';

const STATUS_FLOW = ['Ordered', 'Dispatched', 'In Transit', 'Delivered'];

const STATUS_ICONS = {
    'Ordered': '📋',
    'Dispatched': '📦',
    'In Transit': '🚚',
    'Delivered': '✅',
};

const STATUS_COLORS = {
    'Ordered': 'badge-secondary',
    'Dispatched': 'badge-warning',
    'In Transit': 'badge-info',
    'Delivered': 'badge-success',
};

export default function OrderTracking() {
    const { state, dispatch, showToast } = useInventory();
    const { orders } = state;
    const [filterStatus, setFilterStatus] = useState('');

    const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;

    const handleAdvance = (orderId, currentStatus) => {
        if (currentStatus === 'Delivered') {
            showToast('Order already delivered ✅', 'info');
            return;
        }
        dispatch({ type: 'UPDATE_ORDER_STATUS', id: orderId });
        const nextIdx = STATUS_FLOW.indexOf(currentStatus) + 1;
        showToast(`📦 Status updated to "${STATUS_FLOW[nextIdx]}"!`);
    };

    const counts = STATUS_FLOW.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">🚚 Order Tracking</h1>
                    <p className="page-subtitle">{orders.length} total orders · {counts['Delivered']} delivered</p>
                </div>
            </div>

            {/* Status summary chips */}
            <div className="order-status-chips">
                <button className={`status-chip ${filterStatus === '' ? 'chip-active' : ''}`}
                    onClick={() => setFilterStatus('')}>
                    All ({orders.length})
                </button>
                {STATUS_FLOW.map(s => (
                    <button key={s}
                        className={`status-chip ${filterStatus === s ? 'chip-active' : ''}`}
                        onClick={() => setFilterStatus(s)}>
                        {STATUS_ICONS[s]} {s} ({counts[s]})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-icon">🚚</div>
                            <strong>No orders found</strong>
                            <p>Orders placed from the Low Stock page will appear here.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="orders-list">
                    {filtered.map(order => {
                        const stepIdx = STATUS_FLOW.indexOf(order.status);
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-card-top">
                                    <div className="order-medicine">
                                        <div className="order-med-name">{order.medicineName}</div>
                                        <div className="order-meta">
                                            🏭 {order.supplier} · 📦 Qty: {order.qty} · 📅 Ordered: {order.orderedDate}
                                        </div>
                                        {order.notes && (
                                            <div className="order-notes">📝 {order.notes}</div>
                                        )}
                                    </div>
                                    <div className="order-actions">
                                        <span className={`badge ${STATUS_COLORS[order.status]}`}>
                                            {STATUS_ICONS[order.status]} {order.status}
                                        </span>
                                        {order.status !== 'Delivered' && (
                                            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}
                                                onClick={() => handleAdvance(order.id, order.status)}>
                                                ▶ Advance Status
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="order-progress">
                                    {STATUS_FLOW.map((s, idx) => (
                                        <div key={s} className={`progress-step ${idx <= stepIdx ? 'step-done' : 'step-pending'}`}>
                                            <div className="progress-dot">{idx <= stepIdx ? '●' : '○'}</div>
                                            <div className="progress-label">{s}</div>
                                            {idx < STATUS_FLOW.length - 1 && (
                                                <div className={`progress-line ${idx < stepIdx ? 'line-done' : 'line-pending'}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="order-expected">
                                    Expected Delivery: <strong>{order.expectedDate}</strong>
                                    {order.status === 'Delivered' && <span className="delivered-tag"> · ✅ Delivered</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
