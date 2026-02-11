import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogoutAction = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">VSBECART</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/cart">Cart</Link>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                ID: {user.username}
                            </span>
                            <button
                                onClick={handleLogoutAction}
                                className="btn btn-outline"
                                style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem', borderRadius: '8px' }}
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <Link to="/login" style={{ fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                                Join KANAL
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
