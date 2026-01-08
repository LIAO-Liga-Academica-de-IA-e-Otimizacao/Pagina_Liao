
import React, { useState, useEffect, useRef } from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-rotation
    useEffect(() => {
        if (partners.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % partners.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [partners.length]);

    const getCardStyle = (index: number) => {
        const total = partners.length;
        // Calculate distance from active index, handling wrap-around
        let dist = (index - activeIndex) % total;
        if (dist > total / 2) dist -= total;
        if (dist < -total / 2) dist += total;

        const isActive = dist === 0;
        const absDist = Math.abs(dist);

        // Visual Parameters
        const SPACING = 220; // Base spacing (card width + gap) ~ 190 + 30
        const GAP = 55; // Requested fixed spacing (effective visual gap) -> tuned via translation

        // We generally want visible cards to be: 
        // 0 (Center), +/- 1 (Left/Right), +/- 2 (Far Left/Right)

        let translateX = dist * (190 + GAP); // Simple linear spacing
        let scale = isActive ? 1.15 : 0.9; // Center highlighted (larger)
        let rotateY = 0;
        let zIndex = 100 - absDist;
        let opacity = 1;

        if (dist !== 0) {
            // Side cards: Smaller, rotated Y
            scale = 0.85;
            rotateY = dist > 0 ? -15 : 15; // Point inward
            // Reduce opacity for distant cards
            opacity = Math.max(0, 1 - absDist * 0.3);
        }

        // Limit visibility to avoid clutter
        if (absDist > 2) opacity = 0;

        return {
            transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
            zIndex: zIndex,
            opacity: opacity,
        };
    };

    if (!partners.length) return null;

    return (
        <div className="carousel-container" ref={containerRef}>
            <div className="carousel-track">
                {partners.map((partner, index) => {
                    const style = getCardStyle(index);
                    // Hide completely if opacity is 0 to remove interactions
                    if (style.opacity === 0) return null;

                    return (
                        <div
                            key={partner.id}
                            className={`carousel-card-wrapper ${index === activeIndex ? 'active' : ''}`}
                            style={style}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="carousel-card">
                                {/* Watermark */}
                                <div className="card-watermark">
                                    <img src="/logo.png" alt="LIAO Watermark" />
                                </div>

                                {/* Content */}
                                <div className="card-content">
                                    <div className="logo-container">
                                        <img
                                            src={partner.imageUrl}
                                            alt={partner.name}
                                            className="partner-logo"
                                        />
                                    </div>
                                    <h3 className="partner-name">{partner.name}</h3>
                                    <p className="partner-subtext">Parceiro LIAO</p>

                                    {partner.websiteUrl && (
                                        <a
                                            href={partner.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="card-link-overlay"
                                            aria-label={`Visitar ${partner.name}`}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Indicators */}
            <div className="carousel-indicators">
                {partners.map((_, idx) => (
                    <button
                        key={idx}
                        className={`indicator-dot ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThreeDCarousel;
