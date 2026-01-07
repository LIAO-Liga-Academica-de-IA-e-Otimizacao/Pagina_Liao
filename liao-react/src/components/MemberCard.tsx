import { FaLinkedin, FaGithub } from 'react-icons/fa';

interface MemberCardProps {
    member: {
        id: number;
        name: string;
        role: string;
        photo?: string;
        bio?: string;
        linkedin?: string;
        github?: string;
        isFounder?: boolean;
        isActive?: boolean;
        course?: string;
    };
    onSelect: (member: any) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(member)}
            className="group relative w-[230px] h-[329px] rounded-2xl p-[2px] bg-gradient-to-br from-red-500 via-yellow-400 to-green-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
        >
            {/* White Content Container */}
            <div className="bg-white rounded-2xl p-4 h-full flex flex-col items-center text-center relative z-10 gap-2">

                {/* Avatar with Gradient Ring */}
                <div className="relative mb-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-green-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-24 h-24 p-1 bg-gradient-to-br from-red-500 via-yellow-400 to-green-500 rounded-full">
                        <img
                            src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full border-2 border-white"
                        />
                    </div>
                </div>

                {/* Typography */}
                <h3 className="text-lg font-bold text-gray-900 font-sans leading-tight">{member.name}</h3>

                {member.course && (
                    <p className="text-sm font-medium text-gray-600 italic mb-1">
                        {member.course}
                    </p>
                )}

                <p className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 uppercase tracking-wide">
                    {member.role === 'director' ? 'Diretoria' : 'Membro'}
                </p>

                {/* Status Text (Vigente / Não Vigente) */}
                {member.isActive !== undefined && (
                    <p className={`text-[10px] font-semibold ${member.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {member.isActive ? 'Vigente 2026' : 'Ex-membro'}
                    </p>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-3 mb-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    {member.linkedin ? (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                        >
                            <FaLinkedin size={20} />
                        </a>
                    ) : (
                        <span className="text-gray-200"><FaLinkedin size={20} /></span>
                    )}

                    {member.github ? (
                        <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-900 transition-colors transform hover:scale-110"
                        >
                            <FaGithub size={20} />
                        </a>
                    ) : (
                        <span className="text-gray-200"><FaGithub size={20} /></span>
                    )}
                </div>

                <div className="flex-grow"></div>

                {/* Pill Button - Black to Dark Green Gradient */}
                <button
                    className="w-3/5 py-1.5 px-4 rounded-full text-white font-semibold text-xs shadow-md transform transition-transform group-hover:scale-105 active:scale-95 bg-gradient-to-r from-black to-green-900"
                >
                    Sobre
                </button>
            </div>
        </div>
    );
};

export default MemberCard;
