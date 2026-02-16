import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '../data/templates';
import './WishCard.css';

export default function WishCard({ wish, autoOpen = false }) {
    const [isOpen, setIsOpen] = useState(autoOpen);
    const template = templates.find(t => t.id === wish.template_id) || templates[0];

    return (
        <div className="wish-card-scene" onClick={() => setIsOpen(!isOpen)}>
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
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {template.emoji}
                        </motion.div>
                        <h2 className="card-front-title">Happy Valentine's Day</h2>
                        <p className="card-front-to">To: {wish.to_name}</p>
                        <motion.p
                            className="card-tap-hint"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            💌 Tap to Open
                        </motion.p>
                    </div>
                </div>

                {/* BACK */}
                <div className="wish-card-face wish-card-back" style={template.backStyle}>
                    <div className="card-back-content">
                        {wish.image_url && wish.image_url.length > 0 && (
                            <div className="card-image-wrapper">
                                <img
                                    src={wish.image_url}
                                    alt="Wish"
                                    className="card-image"
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                        <div className="card-message-area">
                            <p className="card-message">{wish.message}</p>
                            <div className="card-names">
                                <p className="card-to">To: <span>{wish.to_name}</span></p>
                                <p className="card-from">With Love, <span>{wish.from_name}</span></p>
                            </div>
                        </div>
                        <div className="card-love-decoration">
                            {'💕'.repeat(5)}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
