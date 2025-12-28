import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
