'use client';

import { useState } from 'react';
import { useChecklist } from '@/lib/checklist-context';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Card } from '../shared/Card';
import styles from './StartScreen.module.css';

interface StartScreenProps {
    onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
    const { data, setInspectorInfo } = useChecklist();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!data.location.trim()) newErrors.location = 'El lugar/área es obligatorio';
        if (!data.inspector.trim()) newErrors.inspector = 'El nombre del inspector es obligatorio';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStart = () => {
        if (validate()) {
            onStart();
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card} padding="large">
                <div className={styles.header}>
                    <h1 className={styles.title}>Nuevo Checklist SST</h1>
                    <p className={styles.subtitle}>
                        Sistema de Gestión de Seguridad y Salud en el Trabajo
                    </p>
                </div>

                <div className={styles.form}>
                    <Input
                        label="Lugar o Área de Inspección"
                        placeholder="Ej. Planta de Producción, Oficinas..."
                        value={data.location}
                        onChange={(e) => setInspectorInfo({ location: e.target.value })}
                        error={errors.location}
                    />

                    <Input
                        label="Inspector (Nombre y Cargo)"
                        placeholder="Ej. Juan Pérez - Coord. SST"
                        value={data.inspector}
                        onChange={(e) => setInspectorInfo({ inspector: e.target.value })}
                        error={errors.inspector}
                    />

                    <div className={styles.row}>
                        <Input
                            label="Fecha de Inspección"
                            type="date"
                            value={data.date}
                            onChange={(e) => setInspectorInfo({ date: e.target.value })}
                        />

                        <div className={styles.selectGroup}>
                            <label className={styles.label}>Tipo de Inspección</label>
                            <select
                                className={styles.select}
                                value={data.type}
                                onChange={(e) => setInspectorInfo({ type: e.target.value })}
                            >
                                <option value="Rutinaria">Rutinaria</option>
                                <option value="No Rutinaria">No Rutinaria</option>
                                <option value="Seguimiento">Seguimiento</option>
                                <option value="Especial">Especial</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button onClick={handleStart} fullWidth size="lg">
                            Iniciar Checklist Normativo
                        </Button>
                        <p className={styles.disclaimer}>
                            *Este checklist sigue los lineamientos del Decreto 1072 de 2015 y
                            Resolución 0312 de 2019.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
