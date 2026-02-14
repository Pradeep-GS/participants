import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchased, setPurchased] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchCart();
        }
    }, [navigate]);

    const fetchCart = async () => {
        // TODO: Fetch cart items from API
    };

    const handleRemove = async (productId) => {
        try {
            const response = await api.post('/cart/remove', { productId });
            setCartItems(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Remove Error:', err);
            alert('Failed to delete item from reserves.');
        }
    };

    const handlePurchase = () => {
        setPurchased(true);
        alert('Logical transaction successful! Items are being dispatched to your sector.');
    };

    if (purchased) return (
        <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '4px' }}>LOGIC <span style={{ color: 'var(--primary)' }}>SECURED</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>Your system upgrades are now in transit.</p>
            <Link to="/" className="btn btn-primary">Return to Catalog</Link>
        </div>
    );

    const total = cartItems.reduce((acc, item) => {
        const price = item.productId ? item.productId.price : 0;
        return acc + (price * item.quantity);
    }, 0);

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <h1 style={{ marginBottom: '4rem', fontSize: '3.5rem', fontWeight: '900', textTransform: 'uppercase' }}>Reserve <span style={{ color: 'var(--primary)' }}>Allocation</span></h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '2px' }}>DECRYPTING RESERVES...</div>
            ) : cartItems.length === 0 ? (
                <div className="glass-effect" style={{ padding: '6rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '2rem', opacity: 0.3 }}>∅</div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>NULL RESERVES</h2>
                    <p style={{ margin: '0 0 3rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>No logical components have been allocated for your sector.</p>
                    <Link to="/" className="btn btn-primary" style={{ padding: '1.2rem 3rem' }}>CONTINUE SHOPPING</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem' }}>
                    <div className="cart-list">
                        {cartItems.map(item => (
                            item.productId && (
                                <div key={item.productId._id} className="cart-item glass-effect">
                                    <img
                                        src={item.productId.image}
                                        alt={item.productId.name}
                                        style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{item.productId.name}</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>QTY: <span style={{ color: '#fff' }}>{item.quantity}</span></span>
                                            <span style={{ color: 'var(--text-muted)' }}>UNIT: <span style={{ color: '#fff' }}>₹{item.productId.price.toLocaleString('en-IN')}</span></span>
                                        </div>
                                        <p style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.3rem', marginTop: '0.5rem' }}>TOTAL: ₹{(item.productId.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.productId._id)}
                                        className="btn btn-outline"
                                        style={{ color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.2)', padding: '0.6rem 1.2rem', minWidth: 'auto' }}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="glass-effect" style={{ padding: '2.5rem', height: 'fit-content', position: 'sticky', top: '120px' }}>
                        <h2 style={{ marginBottom: '2.5rem', fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase' }}>Log Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Sub-allocation</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Transfer Protocol</span>
                            <span style={{ color: '#4ade80' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '2px solid var(--glass-border)', fontSize: '2rem', fontWeight: '900' }}>
                            <span>TOTAL</span>
                            <span style={{ color: 'var(--primary)' }}>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                            onClick={handlePurchase}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '3rem', padding: '1.3rem', fontSize: '1.1rem' }}
                        >
                            EXECUTE TRANSFER
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
