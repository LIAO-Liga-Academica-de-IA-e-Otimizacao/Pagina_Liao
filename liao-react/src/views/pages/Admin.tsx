import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import MemberForm from '../../components/forms/MemberForm';
import TutorForm from '../../components/forms/TutorForm';
import ProjectForm from '../../components/forms/ProjectForm';
import ArticleForm from '../../components/forms/ArticleForm';
import PartnerForm from '../../components/forms/PartnerForm';
import EventForm from '../../components/forms/EventForm';
import type { EventApi } from '../../models/Event';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [activeSection, setActiveSection] = useState<string>('');

    // Members State
    const [members, setMembers] = useState<any[]>([]);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [selectedMemberYear, setSelectedMemberYear] = useState<number | 'all'>('all');

    // Tutors State
    const [tutors, setTutors] = useState<any[]>([]);
    const [editingTutor, setEditingTutor] = useState<any>(null);
    const [showTutorForm, setShowTutorForm] = useState(false);

    // Projects State
    const [projects, setProjects] = useState<any[]>([]);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [showProjectForm, setShowProjectForm] = useState(false);

    // Articles State
    const [articles, setArticles] = useState<any[]>([]);
    const [editingArticle, setEditingArticle] = useState<any>(null);
    const [showArticleForm, setShowArticleForm] = useState(false);

    // Partners State
    const [partners, setPartners] = useState<any[]>([]);
    const [editingPartner, setEditingPartner] = useState<any>(null);
    const [showPartnerForm, setShowPartnerForm] = useState(false);

    // Events State
    const [events, setEvents] = useState<EventApi[]>([]);
    const [editingEvent, setEditingEvent] = useState<EventApi | null>(null);
    const [showEventForm, setShowEventForm] = useState(false);

    const [config, setConfig] = useState({ proselOpen: false });

    // Admins State (New)
    const [admins, setAdmins] = useState<any[]>([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchMembers = async () => {
        try {
            const response = await apiService.getMembers();
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchTutors = async () => {
        try {
            const response = await apiService.getTutors();
            setTutors(response.data.tutors || []); // Ensure array
        } catch (error) {
            console.error('Error fetching tutors:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await apiService.getProjects();
            setProjects(response.data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchArticles = async () => {
        try {
            const response = await apiService.getArticles();
            setArticles(response.data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const fetchPartners = async () => {
        try {
            const response = await apiService.getPartners();
            setPartners(response.data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };

    const fetchConfig = async () => {
        try {
            const response = await apiService.getConfig('prosel_open');
            setConfig({ proselOpen: response.data === 'true' });
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await apiService.getAdmins();
            setAdmins(response.data || []);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await apiService.getEvents() as any;
            setEvents(response.data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        if (activeSection === 'members') fetchMembers();
        if (activeSection === 'tutors') fetchTutors();
        if (activeSection === 'projects') fetchProjects();
        if (activeSection === 'articles') fetchArticles();
        if (activeSection === 'partners') fetchPartners();
        if (activeSection === 'events') fetchEvents();
        if (activeSection === 'config') {
            fetchConfig();
            fetchAdmins();
        }
    }, [activeSection]);

    // --- Config ---
    const handleToggleProSel = async () => {
        try {
            const newValue = (!config.proselOpen).toString();
            await apiService.updateConfig('prosel_open', newValue);
            setConfig({ proselOpen: !config.proselOpen });
        } catch (error) {
            alert('Erro ao atualizar configuração');
        }
    }

    // --- Admin Management Logic ---
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiService.register(newAdmin.email, newAdmin.password, newAdmin.name);
            alert('Administrador criado com sucesso!');
            setShowAdminForm(false);
            setNewAdmin({ name: '', email: '', password: '' });
            fetchAdmins();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Erro ao criar administrador');
        }
    };

    const handleDeleteAdmin = async (id: number) => {
        if (window.confirm('ATENÇÃO: Tem certeza que deseja excluir esta conta de administrador? Esta ação é irreversível.')) {
            try {
                await apiService.deleteAdmin(id);
                alert('Administrador excluído com sucesso.');
                fetchAdmins();
            } catch (error: any) {
                console.error(error);
                alert(error.response?.data?.error || 'Erro ao excluir administrador');
            }
        }
    };

    // --- Members Logic ---
    const handleDeleteMember = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este membro?')) {
            await apiService.deleteMember(id);
            fetchMembers();
        }
    };
    const handleMemberSuccess = () => { setShowMemberForm(false); setEditingMember(null); fetchMembers(); };

    // --- Tutors Logic ---
    const handleDeleteTutor = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este tutor?')) {
            await apiService.deleteTutor(id);
            fetchTutors();
        }
    };
    const handleTutorSuccess = () => { setShowTutorForm(false); setEditingTutor(null); fetchTutors(); };

    // --- Projects Logic ---
    const handleDeleteProject = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            await apiService.deleteProject(id);
            fetchProjects();
        }
    };
    const handleProjectSuccess = () => { setShowProjectForm(false); setEditingProject(null); fetchProjects(); };

    // --- Articles Logic ---
    const handleDeleteArticle = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
            await apiService.deleteArticle(id);
            fetchArticles();
        }
    };
    const handleArticleSuccess = () => { setShowArticleForm(false); setEditingArticle(null); fetchArticles(); };

    // --- Partners Logic ---
    const handleDeletePartner = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta parceria?')) {
            await apiService.deletePartner(id);
            fetchPartners();
        }
    };
    const handlePartnerSuccess = () => { setShowPartnerForm(false); setEditingPartner(null); fetchPartners(); };

    // --- Events Logic ---
    const handleDeleteEvent = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este evento?')) {
            await apiService.deleteEvent(id);
            fetchEvents();
        }
    };
    const handleEventSuccess = () => { setShowEventForm(false); setEditingEvent(null); fetchEvents(); };


    // --- Renders ---

    const renderEventsSection = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Eventos</h2>
                <button
                    onClick={() => { setEditingEvent(null); setShowEventForm(true); }}
                    className="btn-primary"
                >
                    Novo Evento
                </button>
            </div>
            {showEventForm ? (
                <EventForm
                    event={editingEvent}
                    onSuccess={handleEventSuccess}
                    onCancel={() => { setShowEventForm(false); setEditingEvent(null); }}
                />
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento / Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-16 object-cover mr-3 rounded" src={event.coverImage} alt="" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                <div className="text-xs text-gray-500">{new Date(event.date as string).toLocaleDateString('pt-BR')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setEditingEvent(event); setShowEventForm(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                        <button onClick={() => handleDeleteEvent(event.id as number)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderConfigSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Processo Seletivo</h3>
                        <p className="text-gray-500">
                            {config.proselOpen
                                ? 'O formulário de inscrição está ABERTO para todos.'
                                : 'O formulário está FECHADO. Visitantes verão uma mensagem de aguardo.'}
                        </p>
                    </div>
                    <button
                        onClick={handleToggleProSel}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${config.proselOpen ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                        <span className="sr-only">Toggle ProSel</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${config.proselOpen ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                </div>
            </div>

            {/* Admin Management Section */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Administradores Permitidos</h3>
                    {['liaoufba@gmail.com', 'bispodeivisnan@gmail.com'].includes(user.email) && (
                        <button
                            onClick={() => setShowAdminForm(!showAdminForm)}
                            className="text-sm bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                        >
                            {showAdminForm ? 'Cancelar' : 'Adicionar Admin'}
                        </button>
                    )}
                </div>

                {showAdminForm && (
                    <form onSubmit={handleCreateAdmin} className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h4 className="text-sm font-bold mb-3">Novo Administrador</h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={newAdmin.name}
                                    autoComplete="off"
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newAdmin.email}
                                    autoComplete="off"
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Senha</label>
                                <input
                                    type="password"
                                    required
                                    value={newAdmin.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                Salvar
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {admins.map((admin) => {
                                const isSelf = admin.email === user.email;
                                const isActingMaster = ['liaoufba@gmail.com', 'bispodeivisnan@gmail.com'].includes(user.email);
                                const isTargetMaster = ['liaoufba@gmail.com', 'bispodeivisnan@gmail.com'].includes(admin.email);

                                const canDelete = isSelf || (isActingMaster && !isTargetMaster);

                                return (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Excluir
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderMembersSection = () => {
        // Year Filter Logic
        const years = Array.from(new Set(members.map(m => m.year || 2025))).sort((a, b) => b - a);
        const filteredMembers = selectedMemberYear === 'all'
            ? members
            : members.filter(m => (m.year || 2025) === selectedMemberYear);

        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Gerenciar Membros</h2>

                    <div className="flex items-center gap-4">
                        {/* Year Filter Dropdown */}
                        <select
                            value={selectedMemberYear}
                            onChange={(e) => setSelectedMemberYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="all">Todos os Anos</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => { setEditingMember(null); setShowMemberForm(true); }}
                            className="btn-primary"
                        >
                            Novo Membro
                        </button>
                    </div>
                </div>

                {showMemberForm ? (
                    <MemberForm
                        member={editingMember}
                        onSuccess={handleMemberSuccess}
                        onCancel={() => { setShowMemberForm(false); setEditingMember(null); }}
                    />
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {member.photo && <img className="h-8 w-8 rounded-full mr-3" src={member.photo} alt="" />}
                                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{member.year || 2025}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.isFounder ? 'Fundador' : member.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => { setEditingMember(member); setShowMemberForm(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                            <button onClick={() => handleDeleteMember(member.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredMembers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Nenhum membro encontrado para este filtro.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderTutorsSection = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Tutores</h2>
                <button
                    onClick={() => { setEditingTutor(null); setShowTutorForm(true); }}
                    className="btn-primary"
                >
                    Novo Tutor
                </button>
            </div>
            {showTutorForm ? (
                <TutorForm
                    tutor={editingTutor}
                    onSuccess={handleTutorSuccess}
                    onCancel={() => { setShowTutorForm(false); setEditingTutor(null); }}
                />
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Áreas de Atuação</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tutors.map((tutor) => (
                                <tr key={tutor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {tutor.photo && <img className="h-8 w-8 rounded-full mr-3" src={tutor.photo} alt="" />}
                                            <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tutor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tutor.subjects?.join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setEditingTutor(tutor); setShowTutorForm(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                        <button onClick={() => handleDeleteTutor(tutor.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderProjectsSection = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Projetos</h2>
                <button
                    onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
                    className="btn-primary"
                >
                    Novo Projeto
                </button>
            </div>
            {showProjectForm ? (
                <ProjectForm
                    project={editingProject}
                    onSuccess={handleProjectSuccess}
                    onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
                />
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagens</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(project.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {project.images?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setEditingProject(project); setShowProjectForm(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                        <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderArticlesSection = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Newsletter & Artigos</h2>
                <button
                    onClick={() => { setEditingArticle(null); setShowArticleForm(true); }}
                    className="btn-primary"
                >
                    Nova Publicação
                </button>
            </div>
            {showArticleForm ? (
                <ArticleForm
                    article={editingArticle}
                    onSuccess={handleArticleSuccess}
                    onCancel={() => { setShowArticleForm(false); setEditingArticle(null); }}
                />
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {article.tags?.map((tag: string) => (
                                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
                                                {tag}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {article.isPublished ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setEditingArticle(article); setShowArticleForm(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                        <button onClick={() => handleDeleteArticle(article.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderPartnersSection = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Parcerias</h2>
                <button
                    onClick={() => { setEditingPartner(null); setShowPartnerForm(true); }}
                    className="btn-primary"
                >
                    Nova Parceria
                </button>
            </div>
            {showPartnerForm ? (
                <PartnerForm
                    partner={editingPartner}
                    onSuccess={handlePartnerSuccess}
                    onCancel={() => { setShowPartnerForm(false); setEditingPartner(null); }}
                />
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo / Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {partners.map((partner) => (
                                <tr key={partner.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 object-contain mr-3 border rounded p-1" src={partner.imageUrl} alt="" />
                                            <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {partner.websiteUrl ? (
                                            <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                Link
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setEditingPartner(partner); setShowPartnerForm(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                        <button onClick={() => handleDeletePartner(partner.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="section-title">Painel Administrativo</h1>
                        <p className="text-gray-600">Bem-vindo, {user.name}!</p>
                    </div>
                    <div className="flex space-x-2 md:space-x-4">
                        {activeSection && (
                            <button onClick={() => setActiveSection('')} className="btn-secondary flex items-center justify-center" title="Voltar ao Menu">
                                <span className="hidden md:inline">Voltar ao Menu</span>
                                <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        )}
                        <button onClick={handleLogout} className="btn-secondary flex items-center justify-center" title="Sair">
                            <span className="hidden md:inline">Sair</span>
                            <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>

                {activeSection === 'members' && renderMembersSection()}
                {activeSection === 'tutors' && renderTutorsSection()}
                {activeSection === 'projects' && renderProjectsSection()}
                {activeSection === 'articles' && renderArticlesSection()}
                {activeSection === 'partners' && renderPartnersSection()}
                {activeSection === 'events' && renderEventsSection()}
                {activeSection === 'config' && renderConfigSection()}

                {!activeSection && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('members')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Membros</h3>
                                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Gerenciar diretoria e membros.</p>
                            <button className="btn-primary w-full">Gerenciar</button>
                        </div>

                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('tutors')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Tutores</h3>
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Gerenciar professores e tutores.</p>
                            <button className="btn-primary w-full">Gerenciar</button>
                        </div>

                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('projects')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Projetos</h3>
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Galeria de projetos realizados.</p>
                            <button className="btn-primary w-full">Gerenciar</button>
                        </div>

                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('articles')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Newsletter</h3>
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Notícias, artigos e novidades.</p>
                            <button className="btn-primary w-full">Gerenciar</button>
                        </div>

                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('partners')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Parcerias</h3>
                                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Gerenciar empresas e instituições parceiras.</p>
                            <button className="btn-primary w-full">Gerenciar</button>
                        </div>

                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('config')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Configurações</h3>
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Processo Seletivo e sistema.</p>
                            <button className="btn-primary w-full">Configurar</button>
                        </div>

                        <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveSection('events')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Eventos</h3>
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="text-gray-600 mb-4">Gerenciar eventos e palestras.</p>
                            <button className="btn-primary w-full">Gerenciar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
