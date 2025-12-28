export type ChecklistStatus = 'cumple' | 'parcial' | 'no_cumple' | null;

export interface Question {
    id: string;
    text: string;
    category: string;
    citation?: string; // e.g., "Decreto 1072 Art. ..."
}

export interface Section {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
}

export interface Answer {
    questionId: string;
    status: ChecklistStatus;
    observation: string;
    hasEvidence: boolean; // Mock for image upload
}

export interface InspectionData {
    location: string;
    inspector: string;
    date: string;
    type: string;
    answers: Record<string, Answer>; // Map questionId -> Answer
    completed: boolean;
}
