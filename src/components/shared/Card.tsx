import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'normal' | 'none' | 'large';
}

export function Card({ children, className, padding = 'normal' }: CardProps) {
    return (
        <div className={clsx(styles.card, styles[padding], className)}>
            {children}
        </div>
    );
}
