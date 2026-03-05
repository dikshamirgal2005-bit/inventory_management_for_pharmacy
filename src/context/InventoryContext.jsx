import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleMedicines, sampleSuppliers } from '../data/sampleData';

const InventoryContext = createContext();

const initialState = {
    medicines: [],
    suppliers: [],
    toast: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return { ...state, medicines: action.medicines, suppliers: action.suppliers };

        case 'ADD_MEDICINE':
            return { ...state, medicines: [action.medicine, ...state.medicines] };

        case 'UPDATE_MEDICINE':
            return {
                ...state,
                medicines: state.medicines.map(m => m.id === action.medicine.id ? action.medicine : m),
            };

        case 'DELETE_MEDICINE':
            return { ...state, medicines: state.medicines.filter(m => m.id !== action.id) };

        case 'ADD_SUPPLIER':
            return { ...state, suppliers: [action.supplier, ...state.suppliers] };

        case 'UPDATE_SUPPLIER':
            return {
                ...state,
                suppliers: state.suppliers.map(s => s.id === action.supplier.id ? action.supplier : s),
            };

        case 'DELETE_SUPPLIER':
            return { ...state, suppliers: state.suppliers.filter(s => s.id !== action.id) };

        case 'SHOW_TOAST':
            return { ...state, toast: action.toast };

        case 'HIDE_TOAST':
            return { ...state, toast: null };

        default:
            return state;
    }
}

export function InventoryProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load from localStorage OR seed sample data
    useEffect(() => {
        const storedMeds = localStorage.getItem('pharma_medicines');
        const storedSups = localStorage.getItem('pharma_suppliers');
        dispatch({
            type: 'INIT',
            medicines: storedMeds ? JSON.parse(storedMeds) : sampleMedicines,
            suppliers: storedSups ? JSON.parse(storedSups) : sampleSuppliers,
        });
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (state.medicines.length > 0)
            localStorage.setItem('pharma_medicines', JSON.stringify(state.medicines));
    }, [state.medicines]);

    useEffect(() => {
        if (state.suppliers.length > 0)
            localStorage.setItem('pharma_suppliers', JSON.stringify(state.suppliers));
    }, [state.suppliers]);

    // Toast auto-dismiss
    useEffect(() => {
        if (state.toast) {
            const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
            return () => clearTimeout(t);
        }
    }, [state.toast]);

    const showToast = (message, type = 'success') =>
        dispatch({ type: 'SHOW_TOAST', toast: { message, type } });

    // Helpers
    const getExpiryStatus = (expiryDate) => {
        const today = new Date();
        const exp = new Date(expiryDate);
        const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'expired';
        if (diffDays <= 30) return 'soon';
        return 'safe';
    };

    const stats = {
        totalMedicines: state.medicines.length,
        lowStock: state.medicines.filter(m => m.qty <= m.reorderLevel).length,
        expiringSoon: state.medicines.filter(m => getExpiryStatus(m.expiryDate) === 'soon').length,
        expired: state.medicines.filter(m => getExpiryStatus(m.expiryDate) === 'expired').length,
        totalValue: state.medicines.reduce((sum, m) => sum + m.qty * m.price, 0),
    };

    return (
        <InventoryContext.Provider value={{ state, dispatch, stats, showToast, getExpiryStatus }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    return useContext(InventoryContext);
}
