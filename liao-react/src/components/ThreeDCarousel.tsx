
import React, { useMemo } from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    // Duplicate partners if few to ensure a full ring look
    const displayPartners = useMemo(() => {
        if (partners.length === 0) return [];
        if (partners.length < 6) return [...partners, ...partners, ...partners]; // Triple to fill ring
        return partners;
    }, [partners]);

    const count = displayPartners.length;
    const cardWidth = 200; // fixed card width
    const radius = Math.round((cardWidth + 20) / (2 * Math.tan(Math.PI / count)));

    return (
        <div className="carousel-container">
            <div className="carousel-ring">
                {displayPartners.map((partner, index) => {
                    const angle = (360 / count) * index;
                    return (
                        <div
                            key={`${partner.id}-${index}`}
                            className="carousel-card-container"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                            }}
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
                                    <div className="partner-line"></div>
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
        </div>
    );
};

export default ThreeDCarousel;
