export interface Content {
    id: number;
    type: 'notice' | 'faq' | 'video';
    title: string;
    description?: string;
    content: string;
    url?: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Application {
    id: number;
    name: string;
    email: string;
    phone?: string;
    course: string;
    semester: number;
    motivation: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}
