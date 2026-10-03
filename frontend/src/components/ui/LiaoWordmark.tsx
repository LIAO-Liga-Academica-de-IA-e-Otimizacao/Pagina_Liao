import React from 'react';

interface LiaoWordmarkProps {
    className?: string;
    title?: string;
}

/**
 * LIAO wordmark. Letter colors stay fixed so the mark reads on light and dark bars.
 */
const LiaoWordmark: React.FC<LiaoWordmarkProps> = ({ className = '', title = 'LIAO' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="5.4 27.1 70.7 26.2"
            role="img"
            aria-label={title}
            className={className}
        >
            <path d="m6.17 28.09h2.58v20.38c-0.55 0.19-0.92 0.68-0.92 1.29 0 0.82 0.63 1.47 1.39 1.47 0.68 0 1.24-0.44 1.38-1.05h12.98v2.07h-17.41v-24.16z" fill="#D42F2F" />
            <circle cx="9.205" cy="49.8" r=".6769" fill="#D42F2F" />
            <path d="m9.69 28.09h2.18v19.48h11.71v1.85h-13.04c-0.09-0.43-0.42-0.79-0.85-0.93v-20.4z" fill="#D42F2F" />
            <rect x="25.03" y="28.09" width="5.686" height="24.16" fill="#EDB325" />
            <path d="m40.36 28.09h1.78l1.23 3.82-1.35 5.25-4.81 15.09h-5.49l8.64-24.16z" fill="#1E6BA0" />
            <path d="m42.08 28.09h4.41l9.04 24.16h-5.44l-6.74-20.13-1.27-4.03z" fill="#0E3B53" />
            <path d="m64.32 52.47c6.37 0 10.95-4.6 10.95-12.3 0-8.14-5.02-12.23-10.95-12.23-6.15 0-11.02 4.43-11.02 12.23 0 7.96 4.81 12.3 11.02 12.3zm0.04-4.37c3.47 0 6.03-2.73 6.03-7.81 0-5.45-2.77-7.98-6.07-7.98-3.45 0-6.12 2.74-6.12 7.9 0 5.3 2.68 7.89 6.16 7.89z" clipRule="evenodd" fill="#598632" fillRule="evenodd" />
        </svg>
    );
};

export default LiaoWordmark;
