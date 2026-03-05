import React from 'react';
import './StatCard.css';

export default function StatCard({ icon, label, value, color, sub, trend }) {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-content">
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
                {sub && <div className="stat-card-sub">{sub}</div>}
            </div>
            {trend !== undefined && (
                <div className={`stat-card-trend ${trend >= 0 ? 'up' : 'down'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </div>
            )}
        </div>
    );
}
