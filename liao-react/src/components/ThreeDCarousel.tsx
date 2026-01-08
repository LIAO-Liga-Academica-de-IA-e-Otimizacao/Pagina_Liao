
import React, { useState, useEffect, useMemo } from 'react';
import './ThreeDCarousel.css';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    const [currAngle, setCurrAngle] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const partnerCount = partners.length;
    const theta = 360 / partnerCount;

    const radius = useMemo(() => {
        // Calculate radius to fit width ~190-250px cards
        // r = w / (2 * tan(PI/n))
        // Using a fixed width base of 250px for calculation + spacing
        if (partnerCount < 3) return 300; // Min radius
        return Math.round((280) / (2 * Math.tan(Math.PI / partnerCount))) + 50;
    }, [partnerCount]);

    // Auto-rotation
    useEffect(() => {
        if (partnerCount <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % partnerCount);
        }, 3000);
        return () => clearInterval(interval);
    }, [partnerCount]);

    // Sync angle with active index
    useEffect(() => {
        setCurrAngle(activeIndex * -theta);
    }, [activeIndex, theta]);

    return (
        <div className="carousel-container">
            <div
                className="carousel-track"
                style={{
                    transform: `translateZ(${-radius}px) rotateY(${currAngle}deg)`
                }}
            >
                {partners.map((partner, index) => {
                    const angle = theta * index;
                    return (
                        <div
                            key={partner.id}
                            className={`carousel-card-container ${index === activeIndex ? 'active' : ''}`}
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                            }}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="carousel-card">
                                {/* Watermark - Centered Background */}
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
