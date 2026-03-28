import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import MemberCard from '../../components/domain/MemberCard';
import MemberModal from '../../components/ui/MemberModal';
import PageLayout from '../layouts/PageLayout';

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
    const [mobileViewMode, setMobileViewMode] = useState<'carousel' | 'grid'>('carousel'); // Mobile View Toggle
    const [isPaused, setIsPaused] = useState(false); // Mobile Carousel Pause Toggle

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
    // Filter Logic
    let filteredMembers = members.filter(member => {
        if (activeTab === 'directors') {
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
            return true;
        }
        return false;
    });

    // Fallback: If filtering by "Apenas Diretores" inside "Membros" tab yields no results for the selected year,
    // show currently active directors instead.
    if (activeTab === 'members' && roleFilter === 'directors' && filteredMembers.length === 0) {
        filteredMembers = members.filter(member =>
            member.role !== 'member' && member.isActive !== false
        );
    }

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
        if (filteredMembers.length <= itemsPerView || isPaused) return;

        const maxIndex = Math.max(0, filteredMembers.length - itemsPerView);
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [filteredMembers.length, itemsPerView, isPaused]);

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
        <PageLayout 
            title="Nossos Membros" 
            subtitle="Conheça as pessoas que fazem a LIAO acontecer"
        >
            {/* Header and Tabs (Unchanged code omitted for brevity matching existing context) */}
            <div className="flex justify-center mb-8 space-x-4">
                {['directors', 'members', 'founders'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab
                            ? 'bg-gradient-to-r from-black to-success-900 text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
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
                                        ? 'border-success-600 bg-success-50 text-success-700 shadow-md scale-110'
                                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-400 hover:border-neutral-300'
                                        }`}
                                >
                                    <span className="text-xs font-semibold uppercase">Ano</span>
                                    <span className="text-lg font-bold">{year}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                        <button onClick={() => setRoleFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-semibold border dark:border-neutral-600 ${roleFilter === 'all' ? 'bg-neutral-800 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}>Todos</button>
                        <button onClick={() => setRoleFilter('directors')} className={`px-4 py-1.5 rounded-full text-sm font-semibold border dark:border-neutral-600 ${roleFilter === 'directors' ? 'bg-neutral-800 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}>Apenas Diretores</button>
                    </div>
                </div>
            )}


            {/* Content Display: Grid (Desktop) vs Mobile (Carousel/Grid) */}
            {itemsPerView === 1 ? (
                /* Mobile View Container */
                <div className="space-y-4">
                    {/* Mobile View Toggle */}
                    {filteredMembers.length > 0 && (
                        <div className="flex justify-end px-4 mb-2">
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-1 shadow-sm border border-neutral-100 dark:border-neutral-700 flex gap-1">
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className={`p-2 rounded-md transition-all ${isPaused ? 'bg-danger-50 text-danger-600' : 'text-neutral-400 hover:text-success-600'}`}
                                    title={isPaused ? "Retomar" : "Pausar"}
                                >
                                    {isPaused ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                </button>
                                <div className="w-px bg-neutral-200 mx-1 my-1"></div>
                                <button
                                    onClick={() => setMobileViewMode('carousel')}
                                    className={`p-2 rounded-md transition-all ${mobileViewMode === 'carousel' ? 'bg-primary-100 text-primary-700' : 'text-neutral-400 hover:text-neutral-600'}`}
                                    title="Visualização Carrossel"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                                <button
                                    onClick={() => setMobileViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${mobileViewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-neutral-400 hover:text-neutral-600'}`}
                                    title="Visualização em Grade"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {mobileViewMode === 'carousel' ? (
                        /* Mobile Carousel Logic */
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
                                    <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                                        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
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
                                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-success-600' : 'bg-neutral-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        /* Mobile Grid View (New) */
                        <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 px-2">
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleCardClick(member)}
                                        className="flex flex-col items-center bg-white dark:bg-neutral-800 p-2 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-all active:scale-95"
                                    >
                                        <div className="w-full aspect-square mb-2 relative overflow-hidden rounded-lg">
                                            <img
                                                src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {/* Role Badge (Tiny) */}
                                            {member.role !== 'member' && (
                                                <div className="absolute top-1 right-1 w-2 h-2 bg-warning-400 rounded-full shadow-sm"></div>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-neutral-800 dark:text-white text-center line-clamp-2 leading-tight w-full">
                                            {member.name}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 truncate w-full text-center">
                                            {member.role === 'member' ? 'Membro' : member.role}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-neutral-500 text-sm">Nenhum membro encontrado.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
                        <div className="col-span-full text-center py-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                                Nenhum membro encontrado nesta categoria.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <MemberModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </PageLayout>
    );
};

export default Members;


