import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';



const Navbar: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Membros', path: '/members' },
        { name: 'Tutores', path: '/tutors' },
        { name: 'Eventos', path: '/events' },
        { name: 'Projetos', path: '/projects' },
        { name: 'Newsletter', path: '/newsletter' },
        { name: 'Parcerias', path: '/partnerships' },
        { name: 'Sobre nós', path: '/about' },
    ];

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img src="/logo.png" alt="LIAO Logo" className="w-12 h-12 object-contain" />
                        <img src="/liao-text.png" alt="LIAO" className="h-8 object-contain" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex ml-auto space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                    ? 'bg-blue-800 text-white'
                                    : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Partner Logos */}
                    <div className="hidden md:flex ml-auto items-center space-x-4">
                        <a href="https://computacao.ufba.br/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <img src="/ic-logo.png" alt="Instituto de Computação - UFBA" className="h-10 object-contain" />
                        </a>

                    </div>

                    {/* Theme Toggle (Desktop) */}
                    <button
                        onClick={toggleTheme}
                        className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 ml-2"
                        aria-label="Alternar tema"
                    >
                        {theme === 'dark' ? <FaSun className="w-5 h-5 text-yellow-400" /> : <FaMoon className="w-5 h-5" />}
                    </button>

                    {/* Mobile section spacer - keeps mobile menu button to the right if logos are hidden */}
                    <div className="md:hidden ml-auto"></div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
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
                    <div className="md:hidden pb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 rounded-lg font-medium transition-all ${isActive(link.path)
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Theme Toggle (Mobile) */}
                        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 w-full"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <FaSun className="w-5 h-5 text-yellow-400" />
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
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
