import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // TODO: Fetch products from API
    };

    const handleCardClick = (id) => {
        navigate(`/product/${id}`);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-page">
            <header className="hero container">
                <span className="subtitle">KANAL 2k26</span>
                <h1>Rythm of <span style={{ color: 'var(--primary)' }}>Logic</span></h1>

                <div className="search-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                    <input
                        type="text"
                        placeholder="Scan for logical gear (e.g. processor, synth)..."
                        className="search-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Inventory Feed</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{filteredProducts.length} SYSTEM RECORDS</span>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '2px' }}>
                        SYNCING DATABASE...
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="card" onClick={() => handleCardClick(product._id)} style={{ cursor: 'pointer' }}>
                                <div style={{ overflow: 'hidden', height: '260px' }}>
                                    <img src={product.image} alt={product.name} className="card-img" />
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">{product.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', height: '2.7rem', overflow: 'hidden', lineHeight: '1.4' }}>
                                        {product.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
                                        <span className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}>
                                            View Product
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;
