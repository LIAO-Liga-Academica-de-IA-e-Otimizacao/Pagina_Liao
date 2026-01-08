import React from 'react';
import Card from './Card';
import { Link } from 'react-router-dom';
import type { Tutor } from '../../models/Tutor';

interface TutorCardProps {
    tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
    return (
        <Card>
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                        {tutor.photo ? (
                            <img
                                src={`/Liao_membros/${tutor.photo}`}
                                alt={tutor.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-100">
                                {tutor.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tutor.name}</h3>

                        {/* Subjects */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tutor.subjects.map((subject, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>

                        {/* Bio */}
                        {tutor.bio && (
                            <p className="text-sm text-gray-600 mb-2">{tutor.bio}</p>
                        )}

                        {/* Availability */}
                        {tutor.availability && (
                            <p className="text-sm text-gray-500 mb-4">
                                <span className="font-semibold">Disponibilidade:</span> {tutor.availability}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <Link
                                to={`/tutors/${tutor.id}`}
                                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Sobre
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TutorCard;
