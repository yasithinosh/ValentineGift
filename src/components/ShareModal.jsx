import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import './ShareModal.css';

export default function ShareModal({ wishName, onClose }) {
    const [copied, setCopied] = useState(false);
    const wishUrl = `${window.location.origin}/wish/${encodeURIComponent(wishName)}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(wishUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = wishUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content glass-card"
                    initial={{ scale: 0.8, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={onClose}>✕</button>

                    <div className="modal-heart-icon">💝</div>
                    <h2 className="modal-title">Share Your Wish!</h2>
                    <p className="modal-subtitle">Your Valentine wish card is ready to share</p>

                    <div className="share-qr-section">
                        <div className="qr-wrapper">
                            <QRCodeSVG
                                value={wishUrl}
                                size={180}
                                bgColor="transparent"
                                fgColor="#e63946"
                                level="M"
                                includeMargin={false}
                            />
                        </div>
                        <p className="qr-label">Scan to view wish card</p>
                    </div>

                    <div className="share-link-section">
                        <div className="share-link-box">
                            <span className="share-link-text">{wishUrl}</span>
                            <button className="btn-copy" onClick={handleCopy}>
                                {copied ? '✓ Copied!' : '📋 Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="share-name-section">
                        <p className="share-name-hint">
                            Or tell them to visit the homepage and type <strong>"{wishName}"</strong> in the wish name box
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
