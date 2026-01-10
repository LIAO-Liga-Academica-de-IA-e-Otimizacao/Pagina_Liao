import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import MemberCard from '../../components/MemberCard';
import MemberModal from '../../components/MemberModal';

interface Member {
    id: number;
    name: string;
    role: string;
    email: string;
    photo?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    isFounder?: boolean;
    isActive?: boolean;
    year?: number;
    course?: string;
}

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    // const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);

    // Navigation State
    const [activeTab, setActiveTab] = useState<'directors' | 'members' | 'founders'>('directors');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [roleFilter, setRoleFilter] = useState<'all' | 'directors'>('all'); // New Sub-filter

    // Derived Data
    const availableYears = Array.from(new Set(members.map(m => m.year || 2025))).sort((a, b) => b - a);
    // Ensure 2026 is always available if specific requirement
    if (!availableYears.includes(2026)) availableYears.unshift(2026);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await apiService.getMembers();
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setMembers(data);
            } catch (err) {
                console.error(err);
            } finally {
                // setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const handleCardClick = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    // Filter Logic
    const filteredMembers = members.filter(member => {
        if (activeTab === 'directors') {
            // Directors are active members who are not just 'member' and not primarily 'founder' (unless they hold a role)
            // Simpler check: explicit list or everything that isn't 'member'
            return member.role !== 'member' && member.isActive !== false;
        }
        if (activeTab === 'founders') {
            return member.isFounder === true;
        }
        if (activeTab === 'members') {
            const matchesYear = (member.year === selectedYear || (!member.year && selectedYear === 2025));
            if (!matchesYear) return false;

            if (roleFilter === 'directors') {
                return member.role !== 'member';
            }
            return true; // 'all' includes everyone in that year
        }
        return false;
    });

    // Responsive Carousel Logic
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerView(window.innerWidth < 768 ? 1 : 3);
        };
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset index when tab or filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeTab, selectedYear, roleFilter]);

    // Auto-advance
    useEffect(() => {
        if (filteredMembers.length <= itemsPerView) return;

        const maxIndex = Math.max(0, filteredMembers.length - itemsPerView);
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [filteredMembers.length, itemsPerView]);

    const nextSlide = () => {
        const maxIndex = Math.max(0, filteredMembers.length - itemsPerView);
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        const maxIndex = Math.max(0, filteredMembers.length - itemsPerView);
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    // Touch/Swipe Logic (Simple Implementation)
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header and Tabs (Unchanged code omitted for brevity matching existing context) */}
                <div className="text-center mb-12">
                    <h1 className="section-title">Nossos Membros</h1>
                    <p className="text-xl text-gray-600">Conheça as pessoas que fazem a LIAO acontecer</p>
                </div>

                <div className="flex justify-center mb-8 space-x-4">
                    {['directors', 'members', 'founders'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab
                                ? 'bg-gradient-to-r from-black to-green-900 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab === 'directors' ? 'Diretoria Atual' : tab === 'members' ? 'Membros' : 'Fundadores'}
                        </button>
                    ))}
                </div>

                {/* Sub-filters (Year/Role) re-inserted if matching previous code flow or simplified */}
                {activeTab === 'members' && (
                    <div className="flex flex-col items-center mb-8">
                        <div className="overflow-x-auto pb-4 w-full">
                            <div className="flex justify-center space-x-4 min-w-max px-4">
                                {availableYears.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 transition-all ${selectedYear === year
                                            ? 'border-green-600 bg-green-50 text-green-700 shadow-md scale-110'
                                            : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-xs font-semibold uppercase">Ano</span>
                                        <span className="text-lg font-bold">{year}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                            <button onClick={() => setRoleFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${roleFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>Todos</button>
                            <button onClick={() => setRoleFilter('directors')} className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${roleFilter === 'directors' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>Apenas Diretores</button>
                        </div>
                    </div>
                )}


                {/* Content Display: Grid (Desktop) vs Carousel (Mobile) */}
                {itemsPerView === 1 ? (
                    /* Mobile Carousel View */
                    <>
                        <div
                            className="relative group overflow-hidden"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {filteredMembers.length > 0 ? (
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {filteredMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            style={{ width: '100%' }}
                                            className="shrink-0 px-2 sm:px-4"
                                        >
                                            <div className="h-full flex justify-center">
                                                <MemberCard
                                                    member={member}
                                                    onSelect={handleCardClick}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <p className="text-gray-500 text-lg">
                                        Nenhum membro encontrado nesta categoria.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Mobile Indicators */}
                        {filteredMembers.length > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {filteredMembers.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-green-600' : 'bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    /* Desktop Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div key={member.id} className="flex justify-center w-full">
                                    <MemberCard
                                        member={member}
                                        onSelect={handleCardClick}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                                <p className="text-gray-500 text-lg">
                                    Nenhum membro encontrado nesta categoria.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <MemberModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Members;

