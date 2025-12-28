'use client';

import clsx from 'clsx';
import { Question } from '@/lib/types';
import { useChecklist } from '@/lib/checklist-context';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { MessageSquare, Camera } from 'lucide-react';
import styles from './QuestionItem.module.css';
import { useState } from 'react';

interface QuestionItemProps {
    question: Question;
}

export function QuestionItem({ question }: QuestionItemProps) {
    const { data, updateAnswer, toggleEvidence } = useChecklist();
    const answer = data.answers[question.id] || { status: null, observation: '', hasEvidence: false };
    const [showObs, setShowObs] = useState(false);

    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <div className={styles.questionText}>
                    <p className={styles.text}>{question.text}</p>
                    {question.citation && (
                        <span className={styles.citation}>{question.citation}</span>
                    )}
                </div>
                <div className={styles.actions}>
                    <div className={styles.toggles}>
                        <button
                            className={clsx(styles.toggleBtn, answer.status === 'cumple' && styles.cumple)}
                            onClick={() => updateAnswer(question.id, 'cumple')}
                            title="Cumple"
                        >
                            C
                        </button>
                        <button
                            className={clsx(styles.toggleBtn, answer.status === 'parcial' && styles.parcial)}
                            onClick={() => updateAnswer(question.id, 'parcial')}
                            title="Cumple Parcialmente"
                        >
                            CP
                        </button>
                        <button
                            className={clsx(styles.toggleBtn, answer.status === 'no_cumple' && styles.noCumple)}
                            onClick={() => updateAnswer(question.id, 'no_cumple')}
                            title="No Cumple"
                        >
                            NC
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.extras}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowObs(!showObs)}
                    className={clsx(answer.observation && styles.activeIcon)}
                >
                    <MessageSquare size={16} />
                    {answer.observation ? 'Editar Obs.' : 'Observación'}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEvidence(question.id)}
                    className={clsx(answer.hasEvidence && styles.activeIcon)}
                >
                    <Camera size={16} />
                    {answer.hasEvidence ? '1 Foto adjunta' : 'Foto'}
                </Button>
            </div>

            {showObs && (
                <div className={styles.obsContainer}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Escriba sus observaciones aquí..."
                        value={answer.observation}
                        onChange={(e) => updateAnswer(question.id, answer.status, e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}
