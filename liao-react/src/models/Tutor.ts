export interface Tutor {
    id: number;
    name: string;
    email: string;
    photo?: string;
    subjects: string[];
    bio?: string;
    availability?: string;
    createdAt: string;
    updatedAt: string;
}
