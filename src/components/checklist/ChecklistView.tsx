'use client';

import { useState } from 'react';
import { CHECKLIST_SECTIONS } from '@/lib/data';
import { useChecklist } from '@/lib/checklist-context';
import { SectionView } from './SectionView';
import { Button } from '../shared/Button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import styles from './ChecklistView.module.css';

interface ChecklistViewProps {
    onFinish: () => void;
}

export function ChecklistView({ onFinish }: ChecklistViewProps) {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const { data, calculateScore } = useChecklist();

    // Progress Calculation
    const totalQuestions = CHECKLIST_SECTIONS.reduce((acc, sec) => acc + sec.questions.length, 0);
    const answeredCount = Object.keys(data.answers).length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    const currentSection = CHECKLIST_SECTIONS[currentSectionIndex];
    const isFirst = currentSectionIndex === 0;
    const isLast = currentSectionIndex === CHECKLIST_SECTIONS.length - 1;

    const handleNext = () => {
        if (isLast) {
            onFinish();
        } else {
            setCurrentSectionIndex((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (!isFirst) {
            setCurrentSectionIndex((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className={styles.layout}>
            <header className={styles.topBar}>
                <div className={styles.progressInfo}>
                    <span className={styles.progressLabel}>Progreso de Inspección</span>
                    <div className={styles.progressBarBg}>
                        <div
                            className={styles.progressBarFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={styles.progressPercent}>{progress}%</span>
                </div>
                <div className={styles.inspectorInfo}>
                    <strong>{data.inspector}</strong> - {data.location}
                </div>
            </header>

            <main className={styles.mainContent}>
                <SectionView section={currentSection} />
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <Button
                        variant="secondary"
                        onClick={handlePrev}
                        disabled={isFirst}
                    >
                        <ArrowLeft size={18} /> Anterior
                    </Button>

                    <div className={styles.indicator}>
                        Sección {currentSectionIndex + 1} de {CHECKLIST_SECTIONS.length}
                    </div>

                    <Button
                        variant={isLast ? 'success' : 'primary'}
                        onClick={handleNext}
                    >
                        {isLast ? (
                            <>Finalizar Inspección <CheckCircle size={18} /></>
                        ) : (
                            <>Siguiente <ArrowRight size={18} /></>
                        )}
                    </Button>
                </div>
            </footer>
        </div>
    );
}
