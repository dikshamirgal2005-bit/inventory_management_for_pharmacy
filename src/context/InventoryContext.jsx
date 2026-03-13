import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleMedicines, sampleSuppliers, sampleOrders } from '../data/sampleData';

const InventoryContext = createContext();

const initialState = {
    medicines: [],
    suppliers: [],
    orders: [],
    toast: null,
};

const ORDER_FLOW = ['Ordered', 'Dispatched', 'In Transit', 'Delivered'];

function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return {
                ...state,
                medicines: action.medicines,
                suppliers: action.suppliers,
                orders: action.orders,
            };

        case 'ADD_MEDICINE':
            return { ...state, medicines: [action.medicine, ...state.medicines] };

        case 'UPDATE_MEDICINE':
            return {
                ...state,
                medicines: state.medicines.map(m => m.id === action.medicine.id ? action.medicine : m),
            };

        case 'DELETE_MEDICINE':
            return { ...state, medicines: state.medicines.filter(m => m.id !== action.id) };

        case 'DISPENSE_MEDICINE':
            return {
                ...state,
                medicines: state.medicines.map(m =>
                    m.id === action.id
                        ? { ...m, qty: Math.max(0, m.qty - action.qty) }
                        : m
                ),
            };

        case 'ADD_SUPPLIER':
            return { ...state, suppliers: [action.supplier, ...state.suppliers] };

        case 'UPDATE_SUPPLIER':
            return {
                ...state,
                suppliers: state.suppliers.map(s => s.id === action.supplier.id ? action.supplier : s),
            };

        case 'DELETE_SUPPLIER':
            return { ...state, suppliers: state.suppliers.filter(s => s.id !== action.id) };

        case 'ADD_ORDER':
            return { ...state, orders: [action.order, ...state.orders] };

        case 'UPDATE_ORDER_STATUS': {
            const targetOrder = state.orders.find(o => o.id === action.id);
            if (!targetOrder) return state;
            const nextIdx = ORDER_FLOW.indexOf(targetOrder.status) + 1;
            if (nextIdx >= ORDER_FLOW.length) return state;
            const nextStatus = ORDER_FLOW[nextIdx];
            const updatedOrders = state.orders.map(o =>
                o.id === action.id ? { ...o, status: nextStatus } : o
            );
            // Auto-restock medicine when Delivered
            let updatedMedicines = state.medicines;
            if (nextStatus === 'Delivered' && targetOrder.medicineId) {
                updatedMedicines = state.medicines.map(m =>
                    m.id === targetOrder.medicineId
                        ? { ...m, qty: m.qty + targetOrder.qty }
                        : m
                );
            }
            return { ...state, orders: updatedOrders, medicines: updatedMedicines };
        }

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
        const storedOrders = localStorage.getItem('pharma_orders');
        dispatch({
            type: 'INIT',
            medicines: storedMeds ? JSON.parse(storedMeds) : sampleMedicines,
            suppliers: storedSups ? JSON.parse(storedSups) : sampleSuppliers,
            orders: storedOrders ? JSON.parse(storedOrders) : sampleOrders,
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

    useEffect(() => {
        if (state.orders.length > 0)
            localStorage.setItem('pharma_orders', JSON.stringify(state.orders));
    }, [state.orders]);

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
