import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-100 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 border-t border-neutral-200 dark:border-neutral-900 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">LIAO UFBA</h3>
                        <p className="text-neutral-400 text-sm mb-3">
                            Liga Acadêmica de Inteligência Artificial e Otimização da <a href="https://www.ufba.br/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">UFBA</a> - Desenvolvendo soluções inovadoras e capacitando estudantes.
                        </p>
                        <p className="text-neutral-500 text-xs">
                            Filiada ao <a href="https://computacao.ufba.br/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instituto de Computação da UFBA</a>.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/members" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    Membros
                                </Link>
                            </li>
                            <li>
                                <Link to="/members?tab=tutors" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    Tutores
                                </Link>
                            </li>
                            <li>
                                <Link to="/prosel" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    Processo Seletivo
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    Newsletter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Contato</h3>
                        <ul className="space-y-4 text-neutral-650 dark:text-neutral-400">
                            <li>
                                <a href="mailto:liaoufba@gmail.com" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    <FaEnvelope className="text-xl" />
                                    <span>liaoufba@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/liaoufba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    <FaInstagram className="text-xl" />
                                    <span>@liaoufba</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/liao-ufba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    <FaLinkedin className="text-xl" />
                                    <span>LIAO - UFBA</span>
                                </a>
                            </li>
                            <li>
                                <Link to="/login" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-800 dark:hover:text-white transition-colors">
                                    <span className="text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold">Admin</span>
                                    <span className="text-sm">Área Administrativa</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-8 text-center text-neutral-500 dark:text-neutral-400">
                    <p>&copy; {currentYear} LIAO. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
