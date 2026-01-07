import React from 'react';
import { Link } from 'react-router-dom';

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
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: liaoufba@gmail.com</li>
                            <li>Instagram: <a href="https://www.instagram.com/liaoufba" target="_blank" rel="noopener noreferrer" className="hover:text-white">@liaoufba</a></li>
                            <li>LinkedIn: LIAO</li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    Área Administrativa
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
