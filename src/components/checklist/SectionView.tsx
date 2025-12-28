'use client';

import { Section } from '@/lib/types';
import { Card } from '../shared/Card';
import { QuestionItem } from './QuestionItem';
import styles from './SectionView.module.css';

interface SectionViewProps {
    section: Section;
}

export function SectionView({ section }: SectionViewProps) {
    return (
        <div className={styles.container}>
            <Card className={styles.headerCard}>
                <h2 className={styles.title}>{section.title}</h2>
                <p className={styles.description}>{section.description}</p>
            </Card>

            <Card className={styles.questionsCard} padding="none">
                {section.questions.map((q) => (
                    <QuestionItem key={q.id} question={q} />
                ))}
            </Card>
        </div>
    );
}
