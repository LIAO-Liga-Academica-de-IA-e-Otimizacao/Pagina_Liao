export interface Article {
    id: number;
    title: string;
    description?: string; // New field
    content: string;
    images: string[];
    tags: string[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}
