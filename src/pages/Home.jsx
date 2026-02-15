import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FloatingHearts from '../components/FloatingHearts';
import './Home.css';

export default function Home() {
    const [wishName, setWishName] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleViewWish = (e) => {
        e.preventDefault();
        if (wishName.trim()) {
            navigate(`/wish/${encodeURIComponent(wishName.trim().toLowerCase())}`);
        }
    };

    return (
        <div className="home-page">
            <FloatingHearts count={25} />

            <nav className="home-nav">
                <div className="nav-brand">
                    <span className="nav-heart">💘</span>
                    <span className="nav-logo">ValentineWish</span>
                </div>
                <div className="nav-links">
                    {user ? (
                        <Link to="/dashboard" className="btn btn-primary btn-sm">My Dashboard</Link>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                    )}
                </div>
            </nav>

            <main className="home-main">
                {/* HERO SECTION */}
                <section className="hero-section animate-fadeInUp">
                    <div className="hero-emoji">💝</div>
                    <h1 className="hero-title">Send Love, Share Joy</h1>
                    <p className="hero-subtitle">
                        Create beautiful Valentine wish cards with stunning animations and share them with your loved ones
                    </p>
                </section>

                {/* TWO ACTION CARDS */}
                <div className="home-actions">
                    {/* CREATE WISH */}
                    <div className="action-card glass-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <div className="action-icon">✨</div>
                        <h2 className="action-title">Create a Wish</h2>
                        <p className="action-desc">Design a beautiful Valentine card with templates, custom messages, and photos</p>
                        <Link
                            to={user ? '/dashboard' : '/login'}
                            className="btn btn-primary"
                        >
                            🌹 Create Now
                        </Link>
                    </div>

                    {/* VIEW WISH */}
                    <div className="action-card glass-card animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <div className="action-icon">💌</div>
                        <h2 className="action-title">View a Wish</h2>
                        <p className="action-desc">Someone sent you a Valentine? Enter the wish name to see your special card</p>
                        <form className="view-wish-form" onSubmit={handleViewWish}>
                            <input
                                type="text"
                                value={wishName}
                                onChange={e => setWishName(e.target.value)}
                                placeholder="Enter wish name..."
                                className="wish-name-input"
                            />
                            <button type="submit" className="btn btn-gold" disabled={!wishName.trim()}>
                                💖 Go
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="footer">
                Made with ❤️ by <span>InoVoid</span>
            </footer>
        </div>
    );
}
