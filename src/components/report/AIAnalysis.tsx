'use client';

import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Bot, Lightbulb, AlertTriangle } from 'lucide-react';
import styles from './AIAnalysis.module.css';

interface AIAnalysisProps {
    score: number;
}

export function AIAnalysis({ score }: AIAnalysisProps) {
    const getAnalysis = (score: number) => {
        if (score >= 86) {
            return {
                summary: "El sistema de gestión presenta un nivel alto de conformidad con la normatividad vigente. Se evidencia compromiso con los estándares del Decreto 1072 de 2015.",
                recommendations: [
                    "Mantener el cronograma de capacitaciones actualizado.",
                    "Realizar simulacros de emergencia periódicos para validar tiempos de respuesta.",
                    "Documentar las lecciones aprendidas de los incidentes menores."
                ],
                status: "OPTIMO"
            };
        } else if (score >= 61) {
            return {
                summary: "Se observan brechas parciales en el cumplimiento. Aunque existen elementos estructurales, falta consistencia en la ejecución diaria y registros.",
                recommendations: [
                    "Actualizar la matriz de peligros con participación de los trabajadores.",
                    "Reforzar la señalización en áreas de almacenamiento.",
                    "Verificar la entrega y uso efectivo de EPP en planta."
                ],
                status: "MEJORABLE"
            };
        } else {
            return {
                summary: "ALERTA CRÍTICA: El sistema presenta desviaciones significativas que podrían generar sanciones legales y riesgos inminentes para la seguridad.",
                recommendations: [
                    "DETENER actividades de alto riesgo hasta implementar controles.",
                    "Constituir inmediatamente el plan de acción correctiva.",
                    "Revisar política y objetivos de SST con la alta dirección."
                ],
                status: "CRITICO"
            };
        }
    };

    const analysis = getAnalysis(score);

    return (
        <Card className={styles.container}>
            <div className={styles.header}>
                <div className={styles.aiTitle}>
                    <Bot className={styles.icon} size={24} />
                    <h3>Análisis Inteligente SST</h3>
                </div>
                <Badge variant={score >= 86 ? 'success' : score >= 61 ? 'warning' : 'danger'}>
                    NIVEL {analysis.status}
                </Badge>
            </div>

            <div className={styles.content}>
                <p className={styles.summary}>{analysis.summary}</p>

                <div className={styles.recommendations}>
                    <h4>
                        <Lightbulb size={18} className={styles.recIcon} />
                        Recomendaciones Prioritarias
                    </h4>
                    <ul>
                        {analysis.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.legalNote}>
                    <AlertTriangle size={14} />
                    <span>Este análisis es una simulación basada en las respuestas ingresadas y no reemplaza el criterio de un profesional con licencia SST.</span>
                </div>
            </div>
        </Card>
    );
}
