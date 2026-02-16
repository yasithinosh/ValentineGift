import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '../data/templates';
import './WishCard.css';

// Sparkle particles that appear when card flips
const SPARKLE_EMOJIS = ['✨', '💖', '💕', '⭐', '🌟', '✨', '💗', '✨'];

function Sparkles({ count = 16 }) {
    const sparkles = Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: SPARKLE_EMOJIS[i % SPARKLE_EMOJIS.length],
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 500,
        scale: 0.8 + Math.random() * 1.2,
        duration: 1 + Math.random() * 0.8,
        delay: Math.random() * 0.4,
    }));

    return (
        <div className="sparkles-container">
            {sparkles.map(s => (
                <motion.span
                    key={s.id}
                    className="sparkle"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0, s.scale, s.scale * 0.8, 0],
                        x: s.x,
                        y: s.y,
                    }}
                    transition={{ duration: s.duration, delay: s.delay, ease: 'easeOut' }}
                >
                    {s.emoji}
                </motion.span>
            ))}
        </div>
    );
}

export default function WishCard({ wish, autoOpen = false }) {
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [showSparkles, setShowSparkles] = useState(false);
    const [sparkleKey, setSparkleKey] = useState(0);
    const template = templates.find(t => t.id === wish.template_id) || templates[0];

    const hasImage = wish.image_url && wish.image_url.length > 0;

    const handleFlip = () => {
        setIsOpen(!isOpen);
        // Burst sparkles on every tap
        setSparkleKey(k => k + 1);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1200);
    };

    return (
        <motion.div
            className="wish-card-scene"
            onClick={handleFlip}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Sparkle burst on flip */}
            <AnimatePresence>
                {showSparkles && <Sparkles key={sparkleKey} />}
            </AnimatePresence>

            {/* Glow ring behind the card */}
            <motion.div
                className="card-glow-ring"
                animate={{
                    boxShadow: isOpen
                        ? '0 0 80px 20px rgba(255, 107, 129, 0.3), 0 0 120px 40px rgba(230, 57, 70, 0.15)'
                        : '0 0 40px 10px rgba(255, 107, 129, 0.15), 0 0 80px 20px rgba(230, 57, 70, 0.08)',
                }}
                transition={{ duration: 1 }}
            />

            <motion.div
                className="wish-card-wrapper"
                initial={false}
                animate={{ rotateY: isOpen ? 180 : 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 60, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT */}
                <div className="wish-card-face wish-card-front" style={template.frontStyle}>
                    <div className={`card-pattern card-pattern--${template.pattern}`}></div>
                    <div className="card-front-content">
                        <motion.div
                            className="card-heart-icon"
                            animate={{
                                scale: [1, 1.25, 1],
                                rotate: [0, -5, 5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            {template.emoji}
                        </motion.div>
                        <motion.h2
                            className="card-front-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Happy Valentine's Day
                        </motion.h2>
                        <motion.p
                            className="card-front-to"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            To: {wish.to_name}
                        </motion.p>
                        <motion.p
                            className="card-tap-hint"
                            animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            💌 Tap to Open
                        </motion.p>
                    </div>
                </div>

                {/* BACK */}
                <div className="wish-card-face wish-card-back" style={template.backStyle}>
                    <div className="card-back-content">
                        {hasImage && (
                            <motion.div
                                className="card-image-wrapper"
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                            >
                                <img
                                    src={wish.image_url}
                                    alt="Wish"
                                    className="card-image"
                                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                />
                            </motion.div>
                        )}
                        <motion.div
                            className="card-message-area"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <p className="card-message">{wish.message}</p>
                            <div className="card-names">
                                <motion.p
                                    className="card-to"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7, duration: 0.4 }}
                                >
                                    To: <span>{wish.to_name}</span>
                                </motion.p>
                                <motion.p
                                    className="card-from"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    With Love, <span>{wish.from_name}</span>
                                </motion.p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="card-love-decoration"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            {'💕'.repeat(5)}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
