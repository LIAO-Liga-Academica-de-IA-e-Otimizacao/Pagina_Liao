import React from 'react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Sobre Nós</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Conheça a Liga Acadêmica de Inteligência Artificial e Otimização
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nossa Missão</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            A LIAO tem como missão promover o conhecimento em inteligência artificial e otimização,
                            conectando teoria e prática através de projetos, workshops e eventos.
                            Buscamos desenvolver as habilidades técnicas e interpessoais de nossos membros,
                            preparando-os para os desafios do mercado de tecnologia.
                        </p>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            Acreditamos no poder da colaboração e do aprendizado contínuo para inovar
                            e resolver problemas complexos da sociedade.
                        </p>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Equipe trabalhando"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Values Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Nossos Valores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Excelência', icon: '🚀', desc: 'Buscamos a qualidade e a melhoria contínua em tudo que fazemos.' },
                            { title: 'Colaboração', icon: '🤝', desc: 'Trabalhamos juntos, compartilhando conhecimento e experiências.' },
                            { title: 'Inovação', icon: '💡', desc: 'Exploramos novas ideias e tecnologias para criar soluções impactantes.' }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
