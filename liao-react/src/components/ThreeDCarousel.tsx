
import React from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    const count = partners.length;

    // Check if we have enough partners to render something meaningful (at least 1)
    if (count === 0) return null;

    // Dimensions (20% smaller than previous 200px)
    const cardWidth = 160;
    const spacing = 60; // Increased spacing as requested

    // Radius formula: r = w / (2 * tan(PI / N))
    // Add safety for small counts
    let radius = 0;
    if (count > 1) {
        radius = Math.round((cardWidth + spacing) / (2 * Math.tan(Math.PI / count)));
    }
    // If count is 1 or 2, we might want a minimum radius or specific handling so they don't overlap too weirdly
    // For a ring of 1, radius essentially doesn't matter for distribution, but visualization needs distance.
    if (radius < 150) radius = 150;

    return (
        <div className="carousel-view">
            <div className="carousel-container">
                <div className="carousel-ring">
                    {partners.map((partner, index) => {
                        const angle = (360 / count) * index;
                        return (
                            <div
                                key={partner.id}
                                className="carousel-card-wrapper"
                                style={{
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
