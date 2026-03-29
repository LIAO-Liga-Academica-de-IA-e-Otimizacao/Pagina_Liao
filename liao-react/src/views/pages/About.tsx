import React from 'react';
import PageLayout from '../layouts/PageLayout';

const About: React.FC = () => {
    return (
        <PageLayout
            title="Sobre Nós"
            subtitle="Conheça a Liga Acadêmica de Inteligência Artificial e Otimização"
        >
            {/* Content Section */}
            <div className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Nossa Missão</h2>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                            A LIAO tem como missão promover o conhecimento em inteligência artificial e otimização,
                            conectando teoria e prática através de projetos, workshops e eventos.
                            Buscamos desenvolver as habilidades técnicas e interpessoais de nossos membros,
                            preparando-os para os desafios do mercado de tecnologia.
                        </p>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
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
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Nossos Valores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Excelência', icon: '🚀', desc: 'Buscamos a qualidade e a melhoria contínua em tudo que fazemos.' },
                            { title: 'Colaboração', icon: '🤝', desc: 'Trabalhamos juntos, compartilhando conhecimento e experiências.' },
                            { title: 'Inovação', icon: '💡', desc: 'Exploramos novas ideias e tecnologias para criar soluções impactantes.' }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{value.title}</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default About;
