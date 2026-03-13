import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import MedicineModal from '../components/MedicineModal';
import { CATEGORIES } from '../data/sampleData';
import './Inventory.css';

export default function Inventory() {
    const { state, dispatch, showToast, getExpiryStatus } = useInventory();
    const { medicines, suppliers } = state;

    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMed, setEditMed] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [dispenseTarget, setDispenseTarget] = useState(null);
    const [dispenseQty, setDispenseQty] = useState('');
    const [dispenseCustomer, setDispenseCustomer] = useState('');
    const PER_PAGE = 10;

    const filtered = useMemo(() => {
        return medicines.filter(m => {
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.category.toLowerCase().includes(search.toLowerCase()) ||
                m.batchNo.toLowerCase().includes(search.toLowerCase());
            const matchCat = !catFilter || m.category === catFilter;
            const matchStock = !stockFilter || (
                stockFilter === 'low' ? (m.qty <= m.reorderLevel && getExpiryStatus(m.expiryDate) === 'safe') :
                    stockFilter === 'expired' ? getExpiryStatus(m.expiryDate) === 'expired' :
                        stockFilter === 'soon' ? getExpiryStatus(m.expiryDate) === 'soon' : true
            );
            return matchSearch && matchCat && matchStock;
        });
    }, [medicines, search, catFilter, stockFilter, getExpiryStatus]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const openAdd = () => { setEditMed(null); setShowModal(true); };
    const openEdit = (m) => { setEditMed(m); setShowModal(true); };

    const handleSave = (med) => {
        if (editMed) {
            dispatch({ type: 'UPDATE_MEDICINE', medicine: med });
            showToast('Medicine updated successfully!');
        } else {
            dispatch({ type: 'ADD_MEDICINE', medicine: med });
            showToast('Medicine added successfully!');
        }
        setShowModal(false);
        setCurrentPage(1);
    };

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_MEDICINE', id });
        showToast('Medicine deleted.', 'danger');
        setDeleteConfirm(null);
    };

    const openDispense = (m) => {
        setDispenseTarget(m);
        setDispenseQty('');
        setDispenseCustomer('');
    };

    const handleDispense = () => {
        const qty = parseInt(dispenseQty, 10);
        if (!qty || qty <= 0) { showToast('Enter a valid quantity.', 'danger'); return; }
        if (qty > dispenseTarget.qty) { showToast('Not enough stock available!', 'danger'); return; }
        dispatch({ type: 'DISPENSE_MEDICINE', id: dispenseTarget.id, qty });
        showToast(`✅ Dispensed ${qty} ${dispenseTarget.unit} of ${dispenseTarget.name}${dispenseCustomer ? ` to ${dispenseCustomer}` : ''}`);
        setDispenseTarget(null);
    };

    const formatCurrency = (v) => '₹' + Number(v).toFixed(2);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Medicine Inventory</h1>
                    <p className="page-subtitle">{filtered.length} of {medicines.length} medicines shown</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>➕ Add Medicine</button>
            </div>

            <div className="toolbar">
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search by name, category or batch..."
                        value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
                </div>
                <select className="filter-select" value={catFilter}
                    onChange={e => { setCatFilter(e.target.value); setCurrentPage(1); }}>
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select className="filter-select" value={stockFilter}
                    onChange={e => { setStockFilter(e.target.value); setCurrentPage(1); }}>
                    <option value="">All Status</option>
                    <option value="low">Low Stock</option>
                    <option value="soon">Expiring Soon</option>
                    <option value="expired">Expired</option>
                </select>
            </div>

            <div className="card">
                <div className="table-wrapper" style={{ border: 'none' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Medicine</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Qty</th>
                                <th>50% Level</th>
                                <th>Price</th>
                                <th>Expiry</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={10}>
                                    <div className="empty-state">
                                        <div className="empty-icon">💊</div>
                                        <strong>No medicines found</strong>
                                        <p>Try adjusting your filters or add a new medicine.</p>
                                    </div>
                                </td></tr>
                            ) : paginated.map((m, i) => {
                                const expStatus = getExpiryStatus(m.expiryDate);
                                const isLow = m.qty <= m.reorderLevel;
                                const halfLevel = Math.ceil(m.reorderLevel * 0.5);
                                const isBelowHalf = m.qty <= halfLevel && m.qty > 0;
                                return (
                                    <tr key={m.id}>
                                        <td className="row-num">{(currentPage - 1) * PER_PAGE + i + 1}</td>
                                        <td>
                                            <div className="med-name">{m.name}</div>
                                            <div className="med-meta">Batch: {m.batchNo} · {m.unit}</div>
                                        </td>
                                        <td><span className="badge badge-secondary">{m.category}</span></td>
                                        <td>
                                            <span className="location-badge">📦 {m.location || '—'}</span>
                                        </td>
                                        <td>
                                            <span className={`qty-val ${isLow ? 'qty-low' : ''}`}>{m.qty}</span>
                                            <span className="qty-unit"> / {m.reorderLevel} min</span>
                                        </td>
                                        <td>
                                            <span className={`half-level-badge ${isBelowHalf ? 'half-level-warn' : 'half-level-ok'}`}>
                                                {halfLevel}
                                                {isBelowHalf && <span title="Stock below 50% level"> ⚠️</span>}
                                            </span>
                                        </td>
                                        <td>{formatCurrency(m.price)}</td>
                                        <td>
                                            <div className={`expiry-cell expiry-${expStatus}`}>{m.expiryDate}</div>
                                        </td>
                                        <td>
                                            {expStatus === 'expired'
                                                ? <span className="badge badge-danger clickable-badge" title="Filter: Expired" onClick={() => { setStockFilter('expired'); setCurrentPage(1); }}>Expired</span>
                                                : expStatus === 'soon'
                                                    ? <span className="badge badge-warning clickable-badge" title="Filter: Expiring Soon" onClick={() => { setStockFilter('soon'); setCurrentPage(1); }}>Expiring Soon</span>
                                                    : isLow
                                                        ? <span className="badge badge-danger clickable-badge" title="Show only Low Stock" onClick={() => { setStockFilter('low'); setCurrentPage(1); }}>Low Stock</span>
                                                        : <span className="badge badge-success">OK</span>}
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn btn-ghost btn-icon btn-sm" title="Dispense to Customer" onClick={() => openDispense(m)}>💊</button>
                                                <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => openEdit(m)}>✏️</button>
                                                <button className="btn btn-danger btn-icon btn-sm" title="Delete" onClick={() => setDeleteConfirm(m.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="btn btn-ghost btn-sm"
                            disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                        <span className="page-info">Page {currentPage} of {totalPages}</span>
                        <button className="btn btn-ghost btn-sm"
                            disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
                    </div>
                )}
            </div>

            {/* Dispense Modal */}
            {dispenseTarget && (
                <div className="modal-overlay" onClick={() => setDispenseTarget(null)}>
                    <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">💊 Dispense Medicine</h2>
                            <button className="modal-close" onClick={() => setDispenseTarget(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <strong>{dispenseTarget.name}</strong>
                                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                    Available: <strong style={{ color: dispenseTarget.qty <= dispenseTarget.reorderLevel ? 'var(--danger)' : 'var(--success)' }}>{dispenseTarget.qty} {dispenseTarget.unit}</strong>
                                    &nbsp;· Location: {dispenseTarget.location || '—'}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Customer Name (optional)</label>
                                <input className="form-control" placeholder="e.g. Ramesh Kumar"
                                    value={dispenseCustomer} onChange={e => setDispenseCustomer(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Quantity to Dispense *</label>
                                <input className="form-control" type="number" min="1" max={dispenseTarget.qty}
                                    placeholder={`Max: ${dispenseTarget.qty}`}
                                    value={dispenseQty} onChange={e => setDispenseQty(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setDispenseTarget(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleDispense}>✅ Confirm Dispense</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">🗑️ Confirm Delete</h2>
                            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this medicine? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <MedicineModal
                    medicine={editMed}
                    suppliers={suppliers}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
