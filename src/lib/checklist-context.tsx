'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InspectionData, Answer, ChecklistStatus } from './types';

interface ChecklistContextType {
    data: InspectionData;
    setInspectorInfo: (info: Partial<InspectionData>) => void;
    updateAnswer: (questionId: string, status: ChecklistStatus, observation?: string) => void;
    toggleEvidence: (questionId: string) => void;
    calculateScore: () => number;
    resetForm: () => void;
}

const INITIAL_STATE: InspectionData = {
    location: '',
    inspector: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Rutinaria',
    answers: {},
    completed: false,
};

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export function ChecklistProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<InspectionData>(INITIAL_STATE);

    const setInspectorInfo = (info: Partial<InspectionData>) => {
        setData((prev) => ({ ...prev, ...info }));
    };

    const updateAnswer = (questionId: string, status: ChecklistStatus, observation: string = '') => {
        setData((prev) => {
            const existing = prev.answers[questionId] || { hasEvidence: false };
            return {
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionId]: {
                        questionId,
                        status,
                        observation,
                        hasEvidence: existing.hasEvidence,
                    },
                },
            };
        });
    };

    const toggleEvidence = (questionId: string) => {
        setData((prev) => {
            const currentAnswer = prev.answers[questionId];
            if (!currentAnswer) return prev; // Can't add evidence to unanswered item? Let's allow it actually, but logically needs an entry.

            // If no answer exists yet, initialize it
            const base = currentAnswer || { questionId, status: null, observation: '' };

            return {
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionId]: {
                        ...base,
                        hasEvidence: !base.hasEvidence,
                    },
                },
            };
        });
    };

    const calculateScore = () => {
        const answers = Object.values(data.answers);
        if (answers.length === 0) return 0;

        let totalPoints = 0;
        let maxPoints = 0;

        answers.forEach((ans) => {
            if (ans.status === 'cumple') {
                totalPoints += 10;
                maxPoints += 10;
            } else if (ans.status === 'parcial') {
                totalPoints += 5;
                maxPoints += 10;
            } else if (ans.status === 'no_cumple') {
                maxPoints += 10;
            }
            // If null, ignored from calculation or counted as 0? Let's assume answered items count.
            // But for a percentage, we usually base it on TOTAL items in the list.
            // For this simplified logic, we calculate based on ANSWERED items.
        });

        if (maxPoints === 0) return 0;
        return Math.round((totalPoints / maxPoints) * 100);
    };

    const resetForm = () => setData(INITIAL_STATE);

    return (
        <ChecklistContext.Provider
            value={{ data, setInspectorInfo, updateAnswer, toggleEvidence, calculateScore, resetForm }}
        >
            {children}
        </ChecklistContext.Provider>
    );
}

export function useChecklist() {
    const context = useContext(ChecklistContext);
    if (!context) {
        throw new Error('useChecklist must be used within a ChecklistProvider');
    }
    return context;
}
