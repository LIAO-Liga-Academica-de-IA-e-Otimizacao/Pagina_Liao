import React, { useMemo } from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    const cardWidth = 190; // Width of the card in px
    const partnerCount = partners.length;

    // Dynamic radius calculation to ensure cards don't overlap too much
    // Circumference ~ partnerCount * cardWidth implies Radius ~ (partnerCount * cardWidth) / 2Pi
    // We add some gap factor
    const radius = useMemo(() => {
        if (partnerCount === 0) return 0;
        // Example: 8 items -> ~300px radius
        // Base radius for small counts needed
        const baseRadius = Math.round((cardWidth + 20) / (2 * Math.tan(Math.PI / partnerCount)));
        return Math.max(baseRadius, 300); // Ensure a minimum radius for look
    }, [partnerCount]);

    return (
        <div className="carousel-container">
            <div className="carousel-3d">
                {partners.map((partner, index) => {
                    const angle = (360 / partnerCount) * index;
                    return (
                        <div
                            key={partner.id}
                            className="carousel-card-container"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                            }}
                        >
                            <div className="carousel-card">
                                {partner.websiteUrl ? (
                                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="contents">
                                        <img src={partner.imageUrl} alt={partner.name} />
                                        <h3>{partner.name}</h3>
                                    </a>
                                ) : (
                                    <>
                                        <img src={partner.imageUrl} alt={partner.name} />
                                        <h3>{partner.name}</h3>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ThreeDCarousel;
