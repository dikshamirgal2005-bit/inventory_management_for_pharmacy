import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Auth.css';

export default function Login({ onNavigate, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                default:
                    // Only show detailed error in development, or a generic one otherwise
                    setError('Failed to log in. Please check your credentials and try again.');
                    console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">💉</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to PharmaCare Inventory</p>
                </div>

                {error && <div className="auth-error">⚠️ {error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="store@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <button className="auth-link" onClick={() => onNavigate('register')}>
                        Register your store
                    </button>
                </div>
            </div>
        </div>
    );
}
