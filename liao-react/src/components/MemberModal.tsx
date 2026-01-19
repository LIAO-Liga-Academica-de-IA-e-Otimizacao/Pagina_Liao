import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import TechBackground from './TechBackground';

// Interface defining the Member object structure
interface Member {
    id: number;
    name: string;
    email: string;
    role: string;
    isFounder?: boolean;
    photo?: string;
    course?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    isActive?: boolean;
}

// Props interface for the Modal component
interface MemberModalProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * MemberModal Component
 * Implements a high-end Tech/AI aesthetic modal with particle background.
 */
const MemberModal: React.FC<MemberModalProps> = ({ member, isOpen, onClose }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Handle Animation Lifecycle
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Slight delay to allow DOM to mount with initial state before animating
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 300); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!shouldRender || !member) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center`}
            role="dialog"
            aria-modal="true"
        >
            {/* Tech Background Container - Fixed & Full Screen */}
            <div className={`fixed inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Dark Overlay for contrast */}
                <div className="absolute inset-0 bg-[#0b132b] bg-opacity-90" onClick={onClose}></div>
                {/* Animated Particles */}
                <TechBackground />
            </div>

            {/* Modal Card */}
            <div
                className={`
                    relative z-10 w-full max-w-[420px] mx-4
                    bg-white dark:bg-gray-900/90 backdrop-blur-sm
                    rounded-2xl shadow-[0_0_40px_rgba(76,201,240,0.3)]
                    p-8 flex flex-col items-center
                    transform transition-all duration-300 ease-out
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Avatar with Glow */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-30 animate-pulse"></div>
                    <img
                        src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                        alt={member.name}
                        className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm filter drop-shadow-md"
                    />
                </div>

                {/* Header Info */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">{member.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                    <p className="text-sm font-medium text-cyan-600 uppercase tracking-wider">
                        {member.role === 'member' ? 'Membro' : member.role}
                    </p>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                </div>

                {/* Bio / Status */}
                <div className="w-full text-center space-y-4 mb-8">
                    {member.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed px-2">
                            {member.bio}
                        </p>
                    )}

                    {member.isActive !== undefined && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                            <span className={`w-2 h-2 rounded-full mr-2 ${member.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-xs font-medium text-gray-500">
                                {member.isActive ? 'Ativo' : 'Ex-membro'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Contact & Socials */}
                <div className="w-full space-y-3">
                    {member.email && (
                        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                            <FaEnvelope size={14} />
                            <a href={`mailto:${member.email}`} className="text-sm font-medium">{member.email}</a>
                        </div>
                    )}

                    <div className="flex justify-center gap-6 mt-4 pt-6 border-t border-gray-100 dark:border-gray-700 w-full">
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-transform hover:scale-110">
                                <FaLinkedin size={24} />
                            </a>
                        )}
                        {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-transform hover:scale-110">
                                <FaGithub size={24} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberModal;
