'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useChecklist } from '@/lib/checklist-context';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { AIAnalysis } from './AIAnalysis';
import { CHECKLIST_SECTIONS } from '@/lib/data';
import { FileDown, RefreshCcw } from 'lucide-react';
import styles from './ReportView.module.css';

interface ReportViewProps {
    onRestart?: () => void;
}

export function ReportView({ onRestart }: ReportViewProps) {
    const { data, calculateScore, resetForm } = useChecklist();
    const reportRef = useRef<HTMLDivElement>(null);
    const score = calculateScore();

    const handleExportPDF = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            scale: 2, // Better resolution
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Informe_SST_${data.date}.pdf`);
    };

    const handleNewChecklist = () => {
        resetForm();
        onRestart?.();
        window.location.reload(); // Simple way to reset view state in Manager if needed, or just callback
    };

    const statusColor = score >= 86 ? 'var(--success)' : score >= 61 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <h1>Informe de Resultados</h1>
                <div className={styles.actions}>
                    <Button variant="secondary" onClick={handleNewChecklist}>
                        <RefreshCcw size={18} /> Nueva Inspección
                    </Button>
                    <Button onClick={handleExportPDF}>
                        <FileDown size={18} /> Exportar PDF
                    </Button>
                </div>
            </div>

            {/* Printable Area */}
            <div ref={reportRef} className={styles.reportSheet}>
                <header className={styles.reportHeader}>
                    <div className={styles.logoSlot}>LOGO EMPRESA</div>
                    <div className={styles.reportMeta}>
                        <h2>Reporte de Inspección SST</h2>
                        <p><strong>Fecha:</strong> {data.date}</p>
                        <p><strong>Lugar:</strong> {data.location}</p>
                        <p><strong>Inspector:</strong> {data.inspector}</p>
                    </div>
                </header>

                <section className={styles.scoreSection}>
                    <div className={styles.scoreCircle} style={{ borderColor: statusColor, color: statusColor }}>
                        <span className={styles.scoreValue}>{score}%</span>
                        <span className={styles.scoreLabel}>Cumplimiento</span>
                    </div>
                    <div className={styles.scoreContext}>
                        <h3>Estado General</h3>
                        <p style={{ color: statusColor, fontWeight: 'bold' }}>
                            {score >= 86 ? 'CONFORME' : score >= 61 ? 'ALERTA PREVENTIVA' : 'NO CONFORME'}
                        </p>
                        <p className={styles.complianceNote}>
                            Basado en requisitos del Dec. 1072/2015 y Res. 0312/2019
                        </p>
                    </div>
                </section>

                <section className={styles.aiSection}>
                    <AIAnalysis score={score} />
                </section>

                <section className={styles.detailsSection}>
                    <h3>Detalle de Hallazgos</h3>
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>Requisito / Pregunta</span>
                            <span>Estado</span>
                            <span>Observación</span>
                        </div>
                        {Object.values(data.answers).map((ans) => {
                            // Find original question text for display
                            // This is inefficient but fine for this scale. 
                            // Better optimize by mapping ID to text in a lookup or storing text in answer.
                            const questionText = CHECKLIST_SECTIONS
                                .flatMap(s => s.questions)
                                .find(q => q.id === ans.questionId)?.text;

                            if (!questionText) return null;

                            return (
                                <div key={ans.questionId} className={styles.tableRow}>
                                    <span className={styles.colQ}>{questionText}</span>
                                    <span
                                        className={styles.colStatus}
                                        style={{
                                            color: ans.status === 'cumple' ? 'var(--success)' :
                                                ans.status === 'parcial' ? 'var(--warning)' : 'var(--danger)'
                                        }}
                                    >
                                        {ans.status?.toUpperCase().replace('_', ' ')}
                                    </span>
                                    <span className={styles.colObs}>{ans.observation || '-'}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <footer className={styles.reportFooter}>
                    <p>Generado automáticamente por el Módulo SST Next.js</p>
                </footer>
            </div>
        </div>
    );
}
