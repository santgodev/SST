import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={clsx(styles.input, error && styles.hasError)}
                {...props}
            />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
