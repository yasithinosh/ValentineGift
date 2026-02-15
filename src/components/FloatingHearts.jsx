import { useMemo } from 'react';
import './FloatingHearts.css';

const HEARTS = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '🌹', '🥀'];

export default function FloatingHearts({ count = 20 }) {
    const hearts = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            emoji: HEARTS[Math.floor(Math.random() * HEARTS.length)],
            left: Math.random() * 100,
            delay: Math.random() * 8,
            duration: 6 + Math.random() * 10,
            size: 14 + Math.random() * 24,
            opacity: 0.15 + Math.random() * 0.35,
        })), [count]);

    return (
        <div className="floating-hearts-container">
            {hearts.map((h) => (
                <span
                    key={h.id}
                    className="floating-heart"
                    style={{
                        left: `${h.left}%`,
                        animationDelay: `${h.delay}s`,
                        animationDuration: `${h.duration}s`,
                        fontSize: `${h.size}px`,
                        opacity: h.opacity,
                    }}
                >
                    {h.emoji}
                </span>
            ))}
        </div>
    );
}
