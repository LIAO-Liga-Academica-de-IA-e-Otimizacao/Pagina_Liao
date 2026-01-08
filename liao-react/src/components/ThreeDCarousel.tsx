
import React, { useMemo } from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    // Ensure we have enough items to form a nice circle. 
    // Minimum 8 items feels good for a "Ring".
    const displayPartners = useMemo(() => {
        if (!partners.length) return [];
        let items = [...partners];
        while (items.length < 8) {
            items = [...items, ...partners];
        }
        return items;
    }, [partners]);

    const count = displayPartners.length;
    const cardWidth = 200; // Match CSS
    const spacing = 40; // Spacing between cards

    // Exact radius formula for a regular polygon
    const radius = Math.round((cardWidth + spacing) / (2 * Math.tan(Math.PI / count)));

    return (
        <div className="carousel-view">
            <div className="carousel-container">
                <div className="carousel-ring">
                    {displayPartners.map((partner, index) => {
                        // Distribute cards evenly around the Y axis
                        const angle = (360 / count) * index;

                        // Use a unique key that handles duplication
                        const uniqueKey = `partner-${partner.id}-${index}`;

                        return (
                            <div
                                key={uniqueKey}
                                className="carousel-card-wrapper"
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                                }}
                            >
                                <div className="carousel-card">
                                    {/* LIAO Logo Watermark (Background) */}
                                    <div className="card-watermark">
                                        <img src="/logo.png" alt="LIAO" />
                                    </div>

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

                                    {/* Full Card Link overlay */}
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
