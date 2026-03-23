import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">LIAO</h3>
                        <p className="text-gray-400">
                            Liga Acadêmica de Inteligência Artificial e Otimização - Desenvolvendo soluções
                            inovadoras e capacitando estudantes.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/members" className="text-gray-400 hover:text-white transition-colors">
                                    Membros
                                </Link>
                            </li>
                            <li>
                                <Link to="/tutors" className="text-gray-400 hover:text-white transition-colors">
                                    Tutores
                                </Link>
                            </li>
                            <li>
                                <Link to="/prosel" className="text-gray-400 hover:text-white transition-colors">
                                    Processo Seletivo
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                                    Newsletter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contato</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li>
                                <a href="mailto:liaoufba@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <FaEnvelope className="text-xl" />
                                    <span>liaoufba@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/liaoufba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <FaInstagram className="text-xl" />
                                    <span>@liaoufba</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/liao-ufba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <FaLinkedin className="text-xl" />
                                    <span>LIAO - UFBA</span>
                                </a>
                            </li>
                            <li>
                                <Link to="/login" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <span className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700">Admin</span>
                                    <span className="text-sm">Área Administrativa</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {currentYear} LIAO. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
