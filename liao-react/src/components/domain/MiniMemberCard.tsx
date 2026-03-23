import React from 'react';

interface MiniMemberCardProps {
    member: any;
    onSelect: (member: any) => void;
}

const MiniMemberCard: React.FC<MiniMemberCardProps> = ({ member, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(member)}
            className="group flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-100"
        >
            <div className="flex-shrink-0 relative">
                {member.photo ? (
                    <img
                        className="h-12 w-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all"
                        src={member.photo}
                        alt={member.name}
                    />
                ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-transparent group-hover:border-indigo-500 transition-all">
                        {member.name?.charAt(0) || '?'}
                    </div>
                )}
                {member.isFounder && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-sm" title="Membro Fundador">
                        <svg className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="ml-4 truncate">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {member.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                    {member.course || 'Membro LIAO'}
                </p>
                {/* Mobile only role indicator */}
                <p className="text-xs text-indigo-500 font-medium md:hidden">
                    Clique para ver mais
                </p>
            </div>
        </div>
    );
};

export default MiniMemberCard;
