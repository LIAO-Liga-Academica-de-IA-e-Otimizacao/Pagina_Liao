
import React, { useMemo } from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    // Determine the number of cards
    const count = partners.length;

    // Radius calculation
    // We want a closed ring. 
    // Card Width = 160px (from CSS)
    // Gap = 20px (Tighter, as requested)
    // Formula: r = (w + gap) / (2 * tan(PI / N))

    // Safety check for low count to prevent huge radius or overlap
    const radius = useMemo(() => {
        if (count === 0) return 0;
        if (count < 3) return 200; // Minimum visual radius for 1-2 items
        const width = 160;
        const gap = 20;
        return Math.round((width + gap) / (2 * Math.tan(Math.PI / count)));
    }, [count]);

    if (!count) return null;

    return (
        <div className="carousel-view">
            <div className="carousel-container">
                {/* The Ring rotates, carrying all cards with it */}
                <div className="carousel-ring">
                    {partners.map((partner, index) => {
                        // Distribute cards equally in 360 degrees
                        const angle = (360 / count) * index;

                        return (
                            <div
                                key={partner.id}
                                className="carousel-card-wrapper"
                                style={{
                                    // PRECISE POSITIONING:
                                    // Rotate to angle, then push out by radius.
                                    // This locks the card to its slot in the "Ring".
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                                }}
                            >
                                <div className="carousel-card">
                                    {/* Card Content (Foreground) */}
                                    <div className="card-content">
                                        <div className="logo-box">
                                            <img
                                                src={partner.imageUrl}
                                                alt={partner.name}
                                                className="partner-logo"
                                            />
                                        </div>
                                        <h3 className="partner-name">{partner.name}</h3>
                                        <div className="separator"></div>
                                        <p className="partner-type">Parceiro LIAO</p>
                                    </div>

                                    {/* Link Overlay */}
                                    {partner.websiteUrl && (
                                        <a
                                            href={partner.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="card-link"
                                            title={`Visitar ${partner.name}`}
                                        />
                                    )}

                                    {/* Back Face (LIAO Logo) */}
                                    <div className="carousel-card-back">
                                        <img src="/logo.png" alt="LIAO" className="back-logo" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ThreeDCarousel;
