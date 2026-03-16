import React from 'react';
import Card from './Card';
import type { Member } from '../../models/Member';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

interface MemberCardProps {
    member: Member;
    onSelect?: (member: Member) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onSelect }) => {
    return (
        <Card premium={true} className="group flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
            <div className="relative overflow-hidden">
                {/* Photo */}
                <div className="aspect-square overflow-hidden bg-gray-200 relative">
                    {member.photo ? (
                        <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-white text-5xl font-bold">
                            {member.name.charAt(0)}
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        {member.isActive ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg backdrop-blur-md">
                                Vigente
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500 text-white shadow-lg backdrop-blur-md">
                                Ex-Membro
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col flex-grow text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>

                {member.course && (
                    <p className="text-sm text-green-700 font-medium mb-4">{member.course}</p>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-6">
                    {member.linkedin ? (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                        >
                            <FaLinkedin size={24} />
                        </a>
                    ) : (
                        <span className="text-gray-200"><FaLinkedin size={24} /></span>
                    )}

                    {member.github ? (
                        <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-900 transition-colors transform hover:scale-110"
                        >
                            <FaGithub size={24} />
                        </a>
                    ) : (
                        <span className="text-gray-200"><FaGithub size={24} /></span>
                    )}
                </div>

                {/* Spacer to push button down */}
                <div className="flex-grow"></div>

                {/* About Button */}
                <button
                    onClick={() => onSelect && onSelect(member)}
                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg active:transform active:scale-95"
                >
                    Sobre
                </button>
            </div>
        </Card>
    );
};

export default MemberCard;

