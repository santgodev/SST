'use client';

import { useState } from 'react';
import { StartScreen } from './StartScreen';
import { ChecklistView } from './ChecklistView';
import { ReportView } from '../report/ReportView';

export function ChecklistManager() {
    const [step, setStep] = useState<'start' | 'checklist' | 'report'>('start');

    const goToChecklist = () => setStep('checklist');
    const goToReport = () => setStep('report');

    return (
        <div className="checklist-manager">
            {step === 'start' && <StartScreen onStart={goToChecklist} />}

            {step === 'checklist' && <ChecklistView onFinish={goToReport} />}

            {step === 'report' && <ReportView onRestart={() => setStep('start')} />}
        </div>
    );
}
