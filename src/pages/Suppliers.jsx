import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import './Suppliers.css';

const emptySupplier = { name: '', contact: '', phone: '', email: '', address: '' };

export default function Suppliers() {
    const { state, dispatch, showToast } = useInventory();
    const { suppliers } = state;
    const [showModal, setShowModal] = useState(false);
    const [editSup, setEditSup] = useState(null);
    const [form, setForm] = useState({ ...emptySupplier });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const openAdd = () => { setEditSup(null); setForm({ ...emptySupplier }); setShowModal(true); };
    const openEdit = (s) => { setEditSup(s); setForm({ ...s }); setShowModal(true); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        if (editSup) {
            dispatch({ type: 'UPDATE_SUPPLIER', supplier: { ...form, id: editSup.id } });
            showToast('Supplier updated!');
        } else {
            dispatch({ type: 'ADD_SUPPLIER', supplier: { ...form, id: `s${Date.now()}` } });
            showToast('Supplier added!');
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_SUPPLIER', id });
        showToast('Supplier removed.', 'danger');
        setDeleteConfirm(null);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">🏭 Suppliers</h1>
                    <p className="page-subtitle">{suppliers.length} registered suppliers</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>➕ Add Supplier</button>
            </div>

            <div className="suppliers-grid">
                {suppliers.length === 0 ? (
                    <div className="card">
                        <div className="card-body">
                            <div className="empty-state">
                                <div className="empty-icon">🏭</div>
                                <strong>No suppliers yet</strong>
                                <p>Add your first supplier to get started.</p>
                            </div>
                        </div>
                    </div>
                ) : suppliers.map(s => (
                    <div key={s.id} className="supplier-card">
                        <div className="supplier-avatar">{s.name.charAt(0).toUpperCase()}</div>
                        <div className="supplier-info">
                            <div className="supplier-name">{s.name}</div>
                            <div className="supplier-meta">👤 {s.contact}</div>
                            <div className="supplier-meta">📞 {s.phone}</div>
                            <div className="supplier-meta">📧 {s.email}</div>
                            <div className="supplier-meta">📍 {s.address}</div>
                        </div>
                        <div className="supplier-actions">
                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(s)}>✏️</button>
                            <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteConfirm(s.id)}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete confirm */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">🗑️ Remove Supplier</h2>
                            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
                        </div>
                        <div className="modal-body"><p>Remove this supplier? This won't affect existing medicine records.</p></div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editSup ? '✏️ Edit Supplier' : '➕ Add Supplier'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Company Name *</label>
                                    <input className="form-control" name="name" value={form.name} onChange={handleChange}
                                        placeholder="e.g. MedLine Distributors" required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Contact Person</label>
                                        <input className="form-control" name="contact" value={form.contact} onChange={handleChange}
                                            placeholder="Full name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input className="form-control" name="phone" value={form.phone} onChange={handleChange}
                                            placeholder="98XXXXXXXX" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input className="form-control" name="email" type="email" value={form.email}
                                        onChange={handleChange} placeholder="contact@company.com" />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input className="form-control" name="address" value={form.address} onChange={handleChange}
                                        placeholder="City, State" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editSup ? '💾 Save' : '➕ Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
