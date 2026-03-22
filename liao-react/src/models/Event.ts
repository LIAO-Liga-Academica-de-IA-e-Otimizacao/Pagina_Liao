import type { components } from '@liao/api-types';

export type AgendaItem = components["schemas"]["AgendaItem"];
export type EventSpeaker = components["schemas"]["EventSpeaker"];
export type Member = components["schemas"]["Member"];

export type EventApi = components["schemas"]["Event"] & {
    agenda: AgendaItem[];
    speakers: (EventSpeaker & { member?: Member | null })[];
};
