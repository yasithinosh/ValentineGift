import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImage, createWish } from '../utils/wishService';
import { templates } from '../data/templates';
import WishCard from '../components/WishCard';
import ShareModal from '../components/ShareModal';
import FloatingHearts from '../components/FloatingHearts';
import './Dashboard.css';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(1);
    const [toName, setToName] = useState('');
    const [fromName, setFromName] = useState('');
    const [message, setMessage] = useState('');
    const [wishName, setWishName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showShare, setShowShare] = useState(false);
    const [savedWishName, setSavedWishName] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image must be under 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!toName.trim() || !fromName.trim() || !message.trim() || !wishName.trim()) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setLoading(true);
        try {
            let imageUrl = '';
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (imgErr) {
                    imageUrl = '';
                }
            }

            await createWish({
                wishName: wishName.trim(),
                toName: toName.trim(),
                fromName: fromName.trim(),
                message: message.trim(),
                templateId: selectedTemplate,
                imageUrl,
            });
            setSavedWishName(wishName.trim().toLowerCase());
            setShowShare(true);
        } catch (err) {
            if (err.message?.includes('duplicate') || err.code === '23505') {
                setError('This wish name is already taken. Please choose a different name.');
            } else {
                setError(err.message || 'Failed to save wish. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const wishPreviewData = {
        template_id: selectedTemplate,
        to_name: toName || 'Your Love',
        from_name: fromName || 'You',
        message: message || 'Your beautiful message...',
        image_url: imagePreview,
    };

    return (
        <div className="dashboard-page">
            <FloatingHearts count={12} />

            <nav className="dash-nav">
                <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className="nav-heart">💘</span>
                    <span className="nav-logo">ValentineWish</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </nav>

            <main className="dash-main">
                <div className="dash-header animate-fadeInUp">
                    <h1 className="dash-title">Create Your Wish</h1>
                    <p className="dash-subtitle">Design a beautiful Valentine card in 4 simple steps</p>
                </div>

                {/* STEP INDICATOR */}
                <div className="steps-indicator">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
                            <span className="step-num">{s}</span>
                            <span className="step-label">
                                {s === 1 ? 'Template' : s === 2 ? 'Message' : s === 3 ? 'Photo' : 'Preview'}
                            </span>
                        </div>
                    ))}
                    <div className="steps-line">
                        <div className="steps-progress" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    </div>
                </div>

                {error && <div className="error-msg" style={{ maxWidth: 600, margin: '0 auto 20px' }}>{error}</div>}

                {/* STEP 1: TEMPLATE SELECTION */}
                {step === 1 && (
                    <div className="step-content animate-fadeInUp">
                        <h2 className="step-title">Choose a Template</h2>
                        <div className="template-grid">
                            {templates.map(t => (
                                <div
                                    key={t.id}
                                    className={`template-card ${selectedTemplate === t.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedTemplate(t.id)}
                                >
                                    <div className="template-preview" style={t.frontStyle}>
                                        <div className={`card-pattern card-pattern--${t.pattern}`}></div>
                                        <span className="template-emoji">{t.emoji}</span>
                                    </div>
                                    <div className="template-info">
                                        <h3>{t.name}</h3>
                                        <p>{t.description}</p>
                                    </div>
                                    {selectedTemplate === t.id && <div className="template-check">✓</div>}
                                </div>
                            ))}
                        </div>
                        <div className="step-actions">
                            <button className="btn btn-primary" onClick={() => setStep(2)}>
                                Next: Write Message →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: WRITE MESSAGE */}
                {step === 2 && (
                    <div className="step-content animate-fadeInUp">
                        <h2 className="step-title">Write Your Wish</h2>
                        <div className="message-form glass-card">
                            <div className="form-group">
                                <label>Wish Name (for sharing)</label>
                                <input
                                    type="text"
                                    value={wishName}
                                    onChange={e => setWishName(e.target.value)}
                                    placeholder="e.g., my-valentine-2026"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>To</label>
                                    <input
                                        type="text"
                                        value={toName}
                                        onChange={e => setToName(e.target.value)}
                                        placeholder="Her name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>From</label>
                                    <input
                                        type="text"
                                        value={fromName}
                                        onChange={e => setFromName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Your Message</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Write your heartfelt Valentine's message here..."
                                    rows={5}
                                />
                            </div>
                        </div>
                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setStep(3)}
                                disabled={!toName.trim() || !fromName.trim() || !message.trim() || !wishName.trim()}
                            >
                                Next: Add Photo →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: ADD PHOTO */}
                {step === 3 && (
                    <div className="step-content animate-fadeInUp">
                        <h2 className="step-title">Add a Photo</h2>
                        <div className="photo-upload glass-card">
                            {imagePreview ? (
                                <div className="photo-preview-area">
                                    <img src={imagePreview} alt="Preview" className="photo-preview-img" />
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                                        Remove Photo
                                    </button>
                                </div>
                            ) : (
                                <div className="photo-dropzone" onClick={() => fileInputRef.current?.click()}>
                                    <span className="dropzone-icon">📷</span>
                                    <p className="dropzone-text">Click to upload a photo</p>
                                    <p className="dropzone-hint">Max 5MB • JPG, PNG, GIF</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                            <button className="btn btn-primary" onClick={() => setStep(4)}>
                                Next: Preview →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: PREVIEW & SAVE */}
                {step === 4 && (
                    <div className="step-content animate-fadeInUp">
                        <h2 className="step-title">Preview Your Wish Card</h2>
                        <p className="step-hint">Click the card to see the flip animation!</p>
                        <div className="preview-area">
                            <WishCard wish={wishPreviewData} />
                        </div>
                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
                            <button className="btn btn-gold" onClick={handleSave} disabled={loading}>
                                {loading ? '⏳ Saving...' : '💝 Save & Share'}
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {showShare && (
                <ShareModal wishName={savedWishName} onClose={() => { setShowShare(false); navigate('/'); }} />
            )}

            <footer className="footer">Made with ❤️ by <span>InoVoid</span></footer>
        </div>
    );
}
