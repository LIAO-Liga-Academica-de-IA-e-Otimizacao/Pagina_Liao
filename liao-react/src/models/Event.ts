export interface Event {
    id: number;
    slug: string;
    title: string;
    description: string;
    coverImage: string;
    date: string;
    location?: string;
    speakers: string[];
    gallery: string[];
    highlights: string[];
    createdAt: string;
    updatedAt: string;
}
