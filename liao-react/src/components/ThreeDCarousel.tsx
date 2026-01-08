
import React, { useState, useEffect } from 'react';
import type { Partner } from '../models/Partner';

interface ThreeDCarouselProps {
    partners: Partner[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ partners }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % partners.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [partners.length]);

    const getStyles = (index: number) => {
        const total = partners.length;
        const diff = (index - activeIndex + total) % total;

        // Determine position relative to active index
        // We want a dense coverflow.
        // Active is 0. 
        // 1 is right, -1 is left (or total-1)

        // let position = 0; // 0 = active, 1 = right, -1 = left, 2 = hidden/far right, etc.

        // if (diff === 0) position = 0;
        // else if (diff === 1 || diff === - total + 1) position = 1;
        // else if (diff === total - 1 || diff === -1) position = -1;
        // else if (diff === 2) position = 2;
        // else if (diff === total - 2) position = -2;
        // else position = 3; // Others

        // Simple limit for visual clarity if many items
        if (partners.length > 5) {
            // Logic to show only 5 items effectively ? 
            // Keep it simple: Calculate visual index relative to center
            // 0 -> center
            // 1 -> right
            // length-1 -> left
        }

        // Calculate visual offset
        // Using a simpler approach: 
        // Iterate and calculate shortest distance
        let distance = index - activeIndex;
        if (distance > total / 2) distance -= total;
        if (distance < -total / 2) distance += total;

        const absDesc = Math.abs(distance);
        const isActive = distance === 0;

        // Visual styles
        const translateX = distance * 60; // 60% shift per item
        const scale = isActive ? 1.0 : Math.max(0.5, 1 - absDesc * 0.2);
        const opacity = isActive ? 1 : Math.max(0.2, 1 - absDesc * 0.3);
        const zIndex = 100 - absDesc;
        const rotateY = distance * -25; // Rotate items to face inward

        return {
            transform: `translateX(${translateX}%) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
            zIndex: zIndex,
            opacity: Math.abs(distance) > 2 ? 0 : opacity, // Hide distant items
            transition: 'all 0.5s ease-out',
            position: 'absolute' as 'absolute',
            left: '0',
            right: '0',
            margin: '0 auto',
            width: '300px', // Fixed card width
        };
    };

    if (!partners.length) return null;

    return (
        <div className="relative h-96 flex items-center justify-center overflow-hidden perspective-container">
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {partners.map((partner, index) => {
                    const style = getStyles(index);

                    // Only render visible items to prevent DOM clutter if list is huge (though style handles opacity)
                    // Using the style object directly on the wrapper

                    return (
                        <div
                            key={partner.id}
                            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center bg-white rounded-xl shadow-2xl p-6 cursor-pointer"
                            style={style}
                            onClick={() => setActiveIndex(index)}
                        >
                            {/* Card Content */}
                            <div className="w-full h-40 flex items-center justify-center mb-4">
                                <img
                                    src={partner.imageUrl}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 text-center">{partner.name}</h3>
                            {partner.websiteUrl && (
                                <a
                                    href={partner.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                >
                                    Visitar Site
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 flex space-x-2">
                {partners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${idx === activeIndex ? 'bg-indigo-600 scale-125' : 'bg-indigo-200 hover:bg-indigo-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThreeDCarousel;
