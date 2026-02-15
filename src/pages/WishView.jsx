import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWishByName } from '../utils/wishService';
import WishCard from '../components/WishCard';
import FloatingHearts from '../components/FloatingHearts';
import './WishView.css';

export default function WishView() {
    const { wishName } = useParams();
    const [wish, setWish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchWish() {
            try {
                const data = await getWishByName(decodeURIComponent(wishName));
                setWish(data);
            } catch (err) {
                setError('Wish not found. Please check the name and try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchWish();
    }, [wishName]);

    if (loading) {
        return (
            <div className="wish-view-page">
                <FloatingHearts count={20} />
                <div className="wish-view-loading">
                    <div className="loading-heart animate-pulse">💝</div>
                    <p>Loading your Valentine wish...</p>
                </div>
            </div>
        );
    }

    if (error || !wish) {
        return (
            <div className="wish-view-page">
                <FloatingHearts count={15} />
                <div className="wish-view-error animate-fadeInUp">
                    <span className="error-emoji">💔</span>
                    <h2>Oops!</h2>
                    <p>{error || 'Wish not found'}</p>
                    <Link to="/" className="btn btn-primary">← Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wish-view-page">
            <FloatingHearts count={30} />
            <div className="wish-view-content animate-fadeInUp">
                <div className="wish-view-header">
                    <h1 className="wish-view-title">You have a Valentine! 💝</h1>
                    <p className="wish-view-hint">Tap the card to reveal your wish</p>
                </div>
                <WishCard wish={wish} />
                <div className="wish-view-footer">
                    <Link to="/" className="btn btn-secondary btn-sm">← Go Home</Link>
                </div>
            </div>
            <footer className="footer">Made with ❤️ by <span>InoVoid</span></footer>
        </div>
    );
}
