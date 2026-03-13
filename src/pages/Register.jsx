import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Auth.css';

export default function Register({ onNavigate, onRegisterSuccess, onRegisterStart, onRegisterEnd }) {
    const [formData, setFormData] = useState({
        medicalStoreName: '',
        personName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        if (onRegisterStart) onRegisterStart();
        try {
            // 1. Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Save the extra profile details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                medicalStoreName: formData.medicalStoreName,
                personName: formData.personName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                createdAt: new Date().toISOString()
            });

            // 3. Optional: redirect to login or dashboard
            // The user wanted to be redirected to login after register
            await signOut(auth);
            if (onRegisterEnd) onRegisterEnd();
            onRegisterSuccess();
        } catch (err) {
            if (onRegisterEnd) onRegisterEnd();
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Please log in.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                default:
                    setError('Failed to register account. Please try again.');
                    console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">🏥</div>
                    <h1 className="auth-title">Register Store</h1>
                    <p className="auth-subtitle">Create your pharmacy account</p>
                </div>

                {error && <div className="auth-error">⚠️ {error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Medical Store Name</label>
                            <input
                                name="medicalStoreName"
                                type="text"
                                className="form-control"
                                placeholder="Apollo Pharmacy"
                                value={formData.medicalStoreName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Person</label>
                            <input
                                name="personName"
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                                value={formData.personName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="store@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                className="form-control"
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Store Address</label>
                        <input
                            name="address"
                            className="form-control"
                            placeholder="123 Main Street, City"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register Store'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <button className="auth-link" onClick={() => onNavigate('login')}>
                        Sign in here
                    </button>
                </div>
            </div>
        </div>
    );
}
