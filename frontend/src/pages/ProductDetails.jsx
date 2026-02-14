import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            // TODO: Fetch product details from API
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await api.post('/cart/add', {
                productId: product._id,
                quantity: quantity
            });
            alert('Added to cart!');
            navigate('/cart');
        } catch (err) {
            if (err.response?.status === 401) {
                alert('Authentication required for reservation.');
                navigate('/login');
            } else {
                alert('System error on reservation.');
                console.error(err);
            }
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '10rem', textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '4px' }}>
            DECRYPTING COMPONENT SECRETS...
        </div>
    );

    if (!product) return (
        <div className="container" style={{ padding: '10rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem' }}>404: LOGIC NOT FOUND</h1>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>Back to Catalog</button>
        </div>
    );

    return (
        <div className="container" style={{ padding: '6rem 2rem' }}>
            <div className="glass-effect" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: '4rem', padding: '3rem', alignItems: 'start' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-15px',
                        width: '80px',
                        height: '80px',
                        borderTop: '2px solid var(--primary)',
                        borderLeft: '2px solid var(--primary)',
                        opacity: 0.5
                    }}></div>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '12px', height: '450px', objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <span style={{ color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.8rem', display: 'block', fontSize: '0.9rem' }}>
                            {product.category} MODULE
                        </span>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.1', fontWeight: '900', textTransform: 'uppercase' }}>{product.name}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '600px' }}>{product.description}</p>
                    </div>

                    <div style={{ margin: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                            <span style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>SYSTEM READY</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Includes KANAL 2k26 rhythm synthesis license</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Allocation Units:</label>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                                <button className="btn" style={{ padding: '0.6rem 1.2rem', minWidth: 'auto' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span style={{ padding: '0 1rem', fontSize: '1.2rem', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                                <button className="btn" style={{ padding: '0.6rem 1.2rem', minWidth: 'auto' }} onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}>+</button>
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.countInStock} UNITS IN STOCK</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }}
                            disabled={product.countInStock === 0}
                        >
                            {product.countInStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '0.9rem' }}
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
