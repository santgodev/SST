import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
    return (
        <span className={clsx(styles.badge, styles[variant])}>
            {children}
        </span>
    );
}
