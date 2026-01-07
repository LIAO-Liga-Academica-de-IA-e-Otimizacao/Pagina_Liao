import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hover = true
}) => {
    return (
        <div
            className={`card ${hover ? 'hover:scale-105 cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
