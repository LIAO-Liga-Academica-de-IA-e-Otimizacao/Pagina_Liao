import React from 'react';
import { Link } from 'react-router-dom';

import type { Tutor } from '../models/Tutor';

interface TutorCardProps {
    tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
    return (
        <Link
            to={`/tutors/${tutor.id}`}
            className="block h-full group"
        >
            <div className="group relative w-full h-full min-h-[320px] rounded-2xl p-[2px] bg-gradient-to-br from-red-500 via-yellow-400 to-green-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* White Content Container */}
                <div className="bg-white rounded-2xl p-4 h-full flex flex-col items-center text-center relative z-10 gap-2">

                    {/* Avatar with Gradient Ring */}
                    <div className="relative mb-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-green-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-24 h-24 p-1 bg-gradient-to-br from-red-500 via-yellow-400 to-green-500 rounded-full">
                            <img
                                src={
                                    tutor.photo
                                        ? (tutor.photo.startsWith('http') ? tutor.photo : `/Liao_membros/${tutor.photo}`)
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random`
                                }
                                alt={tutor.name}
                                className="w-full h-full object-cover rounded-full border-2 border-white"
                            />
                        </div>
                    </div>

                    {/* Typography */}
                    <h3 className="text-lg font-bold text-gray-900 font-sans leading-tight">{tutor.name}</h3>

                    {/* Subjects */}
                    <div className="flex flex-wrap justify-center gap-1 mb-1">
                        {tutor.subjects?.slice(0, 3).map((subject, index) => (
                            <span key={index} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                {subject}
                            </span>
                        ))}
                    </div>

                    <p className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 uppercase tracking-wide">
                        Tutor
                    </p>

                    {/* Availability Text */}
                    {tutor.availability && (
                        <p className="text-[10px] font-semibold text-green-600">
                            {tutor.availability}
                        </p>
                    )}

                    <div className="flex-grow"></div>

                    {/* Pill Button - Black to Dark Green Gradient */}
                    <div
                        className="w-3/5 py-1.5 px-4 rounded-full text-white font-semibold text-xs shadow-md transform transition-transform group-hover:scale-105 active:scale-95 bg-gradient-to-r from-black to-green-900"
                    >
                        Sobre
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TutorCard;
