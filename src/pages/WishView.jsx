import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getWishByName } from '../utils/wishService';
import WishCard from '../components/WishCard';
import FloatingHearts from '../components/FloatingHearts';
import './WishView.css';

export default function WishView() {
    const { wishName } = useParams();
    const [wish, setWish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEnvelope, setShowEnvelope] = useState(true);

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

    // Dramatic envelope opening before showing the card
    const handleOpenEnvelope = () => {
        setShowEnvelope(false);
    };

    if (loading) {
        return (
            <div className="wish-view-page">
                <FloatingHearts count={25} />
                <motion.div
                    className="wish-view-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="loading-heart"
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -10, 10, 0],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        💝
                    </motion.div>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading your Valentine wish...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error || !wish) {
        return (
            <div className="wish-view-page">
                <FloatingHearts count={15} />
                <motion.div
                    className="wish-view-error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                    <motion.span
                        className="error-emoji"
                        animate={{ rotate: [0, -15, 15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        💔
                    </motion.span>
                    <h2>Oops!</h2>
                    <p>{error || 'Wish not found'}</p>
                    <Link to="/" className="btn btn-primary">← Go Home</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="wish-view-page">
            <FloatingHearts count={35} />

            <AnimatePresence mode="wait">
                {showEnvelope ? (
                    /* ===== ENVELOPE INTRO ===== */
                    <motion.div
                        key="envelope"
                        className="envelope-intro"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 1.5,
                            y: -100,
                            transition: { duration: 0.6, ease: 'easeIn' }
                        }}
                        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                        onClick={handleOpenEnvelope}
                    >
                        <motion.div
                            className="envelope-icon"
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, -3, 3, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            💌
                        </motion.div>
                        <motion.h2
                            className="envelope-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            You've received a Valentine!
                        </motion.h2>
                        <motion.p
                            className="envelope-from"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            From someone special 💕
                        </motion.p>
                        <motion.button
                            className="btn btn-gold envelope-btn"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            💝 Open Your Valentine
                        </motion.button>
                        <motion.p
                            className="envelope-sparkle-hint"
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✨ Tap to reveal ✨
                        </motion.p>
                    </motion.div>
                ) : (
                    /* ===== WISH CARD ===== */
                    <motion.div
                        key="card"
                        className="wish-view-content"
                        initial={{ opacity: 0, y: 60, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <div className="wish-view-header">
                            <motion.h1
                                className="wish-view-title"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Your Valentine Awaits! 💝
                            </motion.h1>
                            <motion.p
                                className="wish-view-hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Tap the card to reveal your wish
                            </motion.p>
                        </div>
                        <WishCard wish={wish} />
                        <motion.div
                            className="wish-view-footer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <Link to="/" className="btn btn-secondary btn-sm">← Go Home</Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="footer">Made with ❤️ by <span>InoVoid</span></footer>
        </div>
    );
}
