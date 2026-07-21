import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';



const Navbar: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;
    const isEventDetailsPage = location.pathname.startsWith('/events/') && location.pathname !== '/events';

    // Scroll state for Hero section adjacency (only on home route "/")
    const [isHeroAdjacent, setIsHeroAdjacent] = React.useState(location.pathname === '/');

    React.useEffect(() => {
        const handleScroll = () => {
            if (location.pathname === '/') {
                setIsHeroAdjacent(window.scrollY < 180);
            } else {
                setIsHeroAdjacent(false);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Membros', path: '/members' },
        { name: 'Eventos', path: '/events' },
        { name: 'Projetos', path: '/projects' },
        { name: 'Newsletter', path: '/newsletter' },
        { name: 'Parcerias', path: '/partnerships' },
        { name: 'Sobre nós', path: '/about' },
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${
            isHeroAdjacent 
                ? 'bg-[#141417] dark:bg-[#0a0a0c] shadow-none border-b border-white/5' 
                : 'bg-white dark:bg-neutral-900 shadow-md'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img src="/logo.png" alt="LIAO Logo" className="w-12 h-12 object-contain" />
                        <img src="/liao-text.png" alt="LIAO" className="h-8 object-contain" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex ml-auto space-x-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            const isDark = theme === 'dark' || isHeroAdjacent;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                        isDark
                                            ? active
                                                ? 'text-white font-semibold'
                                                : 'text-neutral-300 hover:text-white'
                                            : active
                                                ? 'text-primary-800 font-semibold'
                                                : 'text-neutral-600 hover:text-primary-800'
                                    }`}
                                >
                                    {link.name}
                                    <span
                                        className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ${
                                            active
                                                ? isDark 
                                                    ? 'bg-primary-400 opacity-100 scale-x-100 shadow-[0_0_8px_rgba(55,165,248,0.6)]' 
                                                    : 'bg-primary-600 opacity-100 scale-x-100'
                                                : 'bg-transparent opacity-0 scale-x-0'
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Partner Logos */}
                    <div className="hidden md:flex ml-auto items-center space-x-4">
                        <a href="https://computacao.ufba.br/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <img src="/ic-logo.png" alt="Instituto de Computação - UFBA" className="h-10 object-contain" />
                        </a>

                    </div>

                    {/* Theme Toggle (Desktop) */}
                    {!isEventDetailsPage && (
                        <button
                            onClick={toggleTheme}
                            className={`hidden md:flex p-2 rounded-full transition-all ml-2 ${
                                (theme === 'dark' || isHeroAdjacent)
                                    ? 'hover:bg-neutral-800/60 text-neutral-300 hover:text-white'
                                    : 'hover:bg-neutral-100 text-neutral-600'
                            }`}
                            aria-label="Alternar tema"
                        >
                            {theme === 'dark' ? <FaSun className="w-5 h-5 text-warning-400" /> : <FaMoon className="w-5 h-5" />}
                        </button>
                    )}

                    {/* Mobile section spacer - keeps mobile menu button to the right if logos are hidden */}
                    <div className="md:hidden ml-auto"></div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden ml-auto p-2 rounded-lg transition-colors ${
                            (theme === 'dark' || isHeroAdjacent)
                                ? 'hover:bg-neutral-800/60 text-white'
                                : 'hover:bg-neutral-100 text-neutral-600'
                        }`}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            const isDark = theme === 'dark' || isHeroAdjacent;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                                        isDark
                                            ? active
                                                ? 'text-white font-semibold bg-white/5 border-l-4 border-primary-400'
                                                : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white border-l-4 border-transparent'
                                            : active
                                                ? 'text-primary-800 font-semibold bg-primary-50/60 border-l-4 border-primary-600'
                                                : 'text-neutral-700 hover:bg-neutral-100 border-l-4 border-transparent'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {active && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-600'}`} />
                                    )}
                                </Link>
                            );
                        })}
                        {/* Theme Toggle (Mobile) */}
                        {!isEventDetailsPage && (
                            <div className={`px-4 py-2 border-t mt-2 ${
                                (theme === 'dark' || isHeroAdjacent) 
                                    ? 'border-white/10' 
                                    : 'border-neutral-100'
                            }`}>
                                <button
                                    onClick={toggleTheme}
                                    className={`flex items-center space-x-2 w-full transition-colors ${
                                        (theme === 'dark' || isHeroAdjacent)
                                            ? 'text-neutral-300 hover:text-white'
                                            : 'text-neutral-700'
                                    }`}
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <FaSun className="w-5 h-5 text-warning-400" />
                                            <span>Modo Claro</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaMoon className="w-5 h-5" />
                                            <span>Modo Escuro</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
