export interface Member {
    id: number;
    name: string;
    email: string;
    role: 'director' | 'founder' | 'member';
    photo?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    course?: string;
    isActive?: boolean;
    year?: number;
    isFounder?: boolean;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
}
