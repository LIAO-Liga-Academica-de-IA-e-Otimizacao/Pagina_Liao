import axios, { type AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API methods
export const apiService = {
    // Auth
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),

    getCurrentUser: () => api.get('/auth/me'),
    getAdmins: () => api.get('/auth/admins'),
    deleteAdmin: (id: number) => api.delete(`/auth/users/${id}`),

    // Members
    getMembers: () => api.get('/members'),
    getMemberById: (id: number) => api.get(`/members/${id}`),
    createMember: (data: any) => api.post('/members', data),
    updateMember: (id: number, data: any) => api.put(`/members/${id}`, data),
    deleteMember: (id: number) => api.delete(`/members/${id}`),

    // Tutors
    getTutors: () => api.get('/tutors'),
    getTutorById: (id: number) => api.get(`/tutors/${id}`),
    createTutor: (data: any) => api.post('/tutors', data),
    updateTutor: (id: number, data: any) => api.put(`/tutors/${id}`, data),
    deleteTutor: (id: number) => api.delete(`/tutors/${id}`),

    // Content
    getContentByType: (type: 'notice' | 'faq' | 'video') =>
        api.get(`/content/${type}`),
    getContentById: (id: number) => api.get(`/content/item/${id}`),
    createContent: (data: any) => api.post('/content', data),
    updateContent: (id: number, data: any) => api.put(`/content/${id}`, data),
    deleteContent: (id: number) => api.delete(`/content/${id}`),

    // ProSel
    getProSelInfo: () => api.get('/prosel'),
    submitApplication: (data: any) => api.post('/prosel/apply', data),
    getApplications: () => api.get('/prosel/applications'),
    updateApplicationStatus: (id: number, status: string) =>
        api.put(`/prosel/applications/${id}`, { status }),

    // System Config
    getConfig: (key: string) => api.get(`/config/${key}`),
    updateConfig: (key: string, value: string) =>
        api.put(`/config/${key}`, { value }),

    // Projects
    getProjects: (params?: any) => api.get('/projects', { params }),
    createProject: (data: any) => api.post('/projects', data),
    updateProject: (id: number, data: any) => api.put(`/projects/${id}`, data),
    deleteProject: (id: number) => api.delete(`/projects/${id}`),

    // Articles (Newsletter)
    getArticles: () => api.get('/articles'),
    createArticle: (data: any) => api.post('/articles', data),
    updateArticle: (id: number, data: any) => api.put(`/articles/${id}`, data),
    deleteArticle: (id: number) => api.delete(`/articles/${id}`),

    // Partners
    getPartners: () => api.get('/partners'),
    createPartner: (data: any) => api.post('/partners', data),
    updatePartner: (id: number, data: any) => api.put(`/partners/${id}`, data),
    deletePartner: (id: number) => api.delete(`/partners/${id}`),
};

export default api;
