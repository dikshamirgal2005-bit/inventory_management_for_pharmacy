import React, { useState, useEffect } from 'react';
import { CATEGORIES, UNITS } from '../data/sampleData';
import './MedicineModal.css';

const empty = {
    name: '', category: CATEGORIES[0], qty: '', unit: UNITS[0],
    price: '', reorderLevel: '', expiryDate: '', supplier: '', batchNo: '',
};

export default function MedicineModal({ medicine, suppliers, onSave, onClose }) {
    const [form, setForm] = useState(medicine ? { ...medicine } : { ...empty });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Medicine name is required';
        if (!form.qty || isNaN(form.qty) || Number(form.qty) < 0) e.qty = 'Valid quantity required';
        if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
        if (!form.reorderLevel || isNaN(form.reorderLevel)) e.reorderLevel = 'Reorder level required';
        if (!form.expiryDate) e.expiryDate = 'Expiry date required';
        if (!form.batchNo.trim()) e.batchNo = 'Batch number required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({
            ...form,
            id: medicine ? medicine.id : `m${Date.now()}`,
            qty: Number(form.qty),
            price: Number(form.price),
            reorderLevel: Number(form.reorderLevel),
        });
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">{medicine ? '✏️ Edit Medicine' : '➕ Add Medicine'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Medicine Name *</label>
                            <input className={`form-control ${errors.name ? 'error' : ''}`}
                                name="name" value={form.name} onChange={handleChange}
                                placeholder="e.g. Paracetamol 500mg" />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select className="form-control" name="unit" value={form.unit} onChange={handleChange}>
                                    {UNITS.map(u => <option key={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Quantity *</label>
                                <input className={`form-control ${errors.qty ? 'error' : ''}`}
                                    name="qty" type="number" min="0" value={form.qty} onChange={handleChange}
                                    placeholder="0" />
                                {errors.qty && <span className="field-error">{errors.qty}</span>}
                            </div>
                            <div className="form-group">
                                <label>Price per unit (₹) *</label>
                                <input className={`form-control ${errors.price ? 'error' : ''}`}
                                    name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
                                    placeholder="0.00" />
                                {errors.price && <span className="field-error">{errors.price}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Reorder Level *</label>
                                <input className={`form-control ${errors.reorderLevel ? 'error' : ''}`}
                                    name="reorderLevel" type="number" min="0" value={form.reorderLevel} onChange={handleChange}
                                    placeholder="50" />
                                {errors.reorderLevel && <span className="field-error">{errors.reorderLevel}</span>}
                            </div>
                            <div className="form-group">
                                <label>Expiry Date *</label>
                                <input className={`form-control ${errors.expiryDate ? 'error' : ''}`}
                                    name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
                                {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Supplier</label>
                                <select className="form-control" name="supplier" value={form.supplier} onChange={handleChange}>
                                    <option value="">— Select Supplier —</option>
                                    {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Batch No. *</label>
                                <input className={`form-control ${errors.batchNo ? 'error' : ''}`}
                                    name="batchNo" value={form.batchNo} onChange={handleChange}
                                    placeholder="e.g. BT2024001" />
                                {errors.batchNo && <span className="field-error">{errors.batchNo}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {medicine ? '💾 Save Changes' : '➕ Add Medicine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
