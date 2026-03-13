import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import './LowStock.css';

const NEARBY_STORES = [
    { id: 1, name: 'Apollo Pharmacy', distance: '0.4 km', phone: '9812001234', address: 'Main Bazaar Road' },
    { id: 2, name: 'MedPlus Store', distance: '0.8 km', phone: '9823002345', address: 'Gandhi Nagar' },
    { id: 3, name: 'Sun Pharma Outlet', distance: '1.1 km', phone: '9834003456', address: 'Shivaji Chowk' },
    { id: 4, name: 'Jan Aushadhi Kendra', distance: '1.6 km', phone: '9845004567', address: 'Civil Lines' },
    { id: 5, name: 'City Medical Hall', distance: '2.0 km', phone: '9856005678', address: 'Station Road' },
];

export default function LowStock() {
    const { state, getExpiryStatus, dispatch, showToast } = useInventory();
    const { medicines, suppliers } = state;
    const lowItems = medicines.filter(m => m.qty <= m.reorderLevel);

    const [showEmergency, setShowEmergency] = useState(false);
    const [contactTarget, setContactTarget] = useState(null); // medicine for supplier contact
    const [orderQty, setOrderQty] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [requestedStore, setRequestedStore] = useState(null); // Which store we are currently filling the form for
    const [requestedItems, setRequestedItems] = useState([{ name: '', qty: '' }]);
    const [isRequestSent, setIsRequestSent] = useState(false); // If the form has been submitted

    const openContact = (medicine) => {
        setContactTarget(medicine);
        setOrderQty(String(Math.max(1, medicine.reorderLevel - medicine.qty)));
        setOrderNote('');
    };

    const critical = lowItems.filter(m => m.qty === 0);
    const warning = lowItems.filter(m => m.qty > 0 && m.qty <= m.reorderLevel);

    const getSupplierInfo = (supplierName) =>
        suppliers.find(s => s.name === supplierName);

    const handlePlaceOrder = () => {
        if (!contactTarget) return;
        const parsedQty = parseInt(orderQty, 10);
        if (!parsedQty || parsedQty <= 0) { showToast('Enter a valid quantity.', 'danger'); return; }
        const order = {
            id: `o${Date.now()}`,
            medicineName: contactTarget.name,
            medicineId: contactTarget.id,
            supplier: contactTarget.supplier || 'Unknown Supplier',
            qty: parsedQty,
            orderedDate: new Date().toISOString().split('T')[0],
            status: 'Ordered',
            expectedDate: (() => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                return d.toISOString().split('T')[0];
            })(),
            notes: orderNote || 'Restock order from Low Stock alert',
        };
        dispatch({ type: 'ADD_ORDER', order });
        showToast(`📦 Order placed for ${parsedQty} units of ${contactTarget.name}! Track in Order Tracking.`);
        setContactTarget(null);
        setOrderNote('');
        setOrderQty('');
    };

    const handleRequestSubmit = (storeName) => {
        // Validate all items
        const hasInvalidItem = requestedItems.some(item => !item.name.trim() || !parseInt(item.qty, 10) || parseInt(item.qty, 10) <= 0);

        if (hasInvalidItem) {
            showToast('Please enter valid medicine names and quantities for all items.', 'danger');
            return;
        }

        const totalItems = requestedItems.length;
        const firstItem = requestedItems[0];

        // Simulating sending the request
        setIsRequestSent(true);
        const msg = totalItems === 1
            ? `📞 Request for ${firstItem.qty}x ${firstItem.name} sent to ${storeName}!`
            : `📞 Request for ${totalItems} medicines sent to ${storeName}!`;

        showToast(msg);

        // Reset form after a delay to allow the user to see the success state
        setTimeout(() => {
            setRequestedStore(null);
            setRequestedItems([{ name: '', qty: '' }]);
            setIsRequestSent(false);
        }, 2500);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...requestedItems];
        newItems[index][field] = value;
        setRequestedItems(newItems);
    };

    const addItemRow = () => {
        setRequestedItems([...requestedItems, { name: '', qty: '' }]);
    };

    const removeItemRow = (index) => {
        if (requestedItems.length > 1) {
            const newItems = requestedItems.filter((_, i) => i !== index);
            setRequestedItems(newItems);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">⚠️ Low Stock Alerts</h1>
                    <p className="page-subtitle">{lowItems.length} item{lowItems.length !== 1 ? 's' : ''} need restocking</p>
                </div>
                <button className="btn btn-emergency" onClick={() => setShowEmergency(true)}>
                    🚨 Emergency – Find Nearby Store
                </button>
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
                <div className="low-stock-container">
                    {critical.length > 0 && (
                        <div className="alert-section">
                            <div className="alert-section-header critical">
                                🚫 Out of Stock ({critical.length})
                            </div>
                            <div className="card">
                                <div className="table-wrapper" style={{ border: 'none' }}>
                                    <StockTable items={critical} getExpiryStatus={getExpiryStatus} onContact={openContact} />
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
                                    <StockTable items={warning} getExpiryStatus={getExpiryStatus} onContact={openContact} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Emergency Modal */}
            {showEmergency && (
                <div className="modal-overlay" onClick={() => { setShowEmergency(false); setRequestedStore(null); setIsRequestSent(false); }}>
                    <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">🚨 Nearby Medical Stores</h2>
                            <button className="modal-close" onClick={() => { setShowEmergency(false); setRequestedStore(null); }}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                📍 Showing stores near your pharmacy. Contact them to arrange an emergency supply.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {NEARBY_STORES.map(store => {
                                    const isSelected = requestedStore === store.id;
                                    return (
                                        <div key={store.id} className="nearby-store-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <div className="nearby-store-info">
                                                    <div className="nearby-store-name">🏥 {store.name}</div>
                                                    <div className="nearby-store-meta">📍 {store.address} · 📏 {store.distance}</div>
                                                    <div className="nearby-store-meta">📞 {store.phone}</div>
                                                </div>
                                                <div>
                                                    {isSelected && isRequestSent ? (
                                                        <span className="badge badge-success">✅ Requested</span>
                                                    ) : !isSelected ? (
                                                        <button className="btn btn-primary btn-sm"
                                                            onClick={() => {
                                                                setRequestedStore(store.id);
                                                                setRequestedItems([{ name: '', qty: '' }]);
                                                                setIsRequestSent(false);
                                                            }}>
                                                            Request Medicine
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => setRequestedStore(null)}>
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {isSelected && !isRequestSent && (
                                                <div className="request-form-expanded" style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                                                    {requestedItems.map((item, index) => (
                                                        <div className="form-row" key={index} style={{ marginBottom: '8px', alignItems: 'flex-end' }}>
                                                            <div className="form-group" style={{ marginBottom: '0', flex: 2 }}>
                                                                {index === 0 && <label style={{ fontSize: '0.8rem' }}>Medicine Name *</label>}
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    value={item.name}
                                                                    onChange={e => handleItemChange(index, 'name', e.target.value)}
                                                                    placeholder="e.g. Paracetamol 500mg"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="form-group" style={{ marginBottom: '0', flex: 1 }}>
                                                                {index === 0 && <label style={{ fontSize: '0.8rem' }}>Qty *</label>}
                                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="form-control form-control-sm"
                                                                        value={item.qty}
                                                                        onChange={e => handleItemChange(index, 'qty', e.target.value)}
                                                                        placeholder="10"
                                                                        required
                                                                    />
                                                                    {requestedItems.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-ghost btn-sm"
                                                                            style={{ padding: '0 8px', color: 'var(--danger)' }}
                                                                            onClick={() => removeItemRow(index)}
                                                                            title="Remove Item"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '12px' }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={addItemRow}
                                                        >
                                                            + Add Item
                                                        </button>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            style={{ flex: 1 }}
                                                            onClick={() => handleRequestSubmit(store.name)}
                                                        >
                                                            Send Request to {store.name}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowEmergency(false); setRequestedStore(null); }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Supplier Modal */}
            {contactTarget && (() => {
                const sup = getSupplierInfo(contactTarget.supplier);
                const deficit = contactTarget.reorderLevel - contactTarget.qty;
                return (
                    <div className="modal-overlay" onClick={() => setContactTarget(null)}>
                        <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">📞 Contact Supplier</h2>
                                <button className="modal-close" onClick={() => setContactTarget(null)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="supplier-contact-card">
                                    <div className="supplier-contact-name">🏭 {contactTarget.supplier || 'No supplier linked'}</div>
                                    {sup ? (
                                        <>
                                            <div className="supplier-contact-row">👤 {sup.contact}</div>
                                            <div className="supplier-contact-row">📞 <strong>{sup.phone}</strong></div>
                                            <div className="supplier-contact-row">📧 {sup.email}</div>
                                            <div className="supplier-contact-row">📍 {sup.address}</div>
                                        </>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No contact details found. Add supplier in the Suppliers page.</p>
                                    )}
                                </div>

                                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                                    <strong>📋 Restock Summary</strong>
                                    <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>
                                        Medicine: <strong>{contactTarget.name}</strong><br />
                                        Current Stock: <strong style={{ color: 'var(--danger)' }}>{contactTarget.qty}</strong> / Reorder Level: {contactTarget.reorderLevel}
                                    </div>
                                </div>

                                <div className="form-row" style={{ marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Quantity to Order *</label>
                                        <input className="form-control" type="number" min="1"
                                            placeholder="Enter quantity"
                                            value={orderQty}
                                            onChange={e => setOrderQty(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Order Notes (optional)</label>
                                        <input className="form-control"
                                            placeholder="e.g. Urgent delivery needed"
                                            value={orderNote}
                                            onChange={e => setOrderNote(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-ghost" onClick={() => setContactTarget(null)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handlePlaceOrder}>📦 Place Order</button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

function StockTable({ items, getExpiryStatus, onContact }) {
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
                    <th>Action</th>
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
                            <td>
                                <button className="btn btn-ghost btn-sm" onClick={() => onContact(m)}>
                                    📞 Contact
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
