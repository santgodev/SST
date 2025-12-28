import { Section } from './types';

export const CHECKLIST_SECTIONS: Section[] = [
    {
        id: 'documentacion',
        title: 'Documentación Básica del SG-SST',
        description: 'Gestión documental y directrices estratégicas.',
        questions: [
            {
                id: 'doc_1',
                text: '¿Se tiene actualizada y firmada la política de SST?',
                category: 'Documentación',
                citation: 'Dec. 1072/2015 Art. 2.2.4.6.5',
            },
            {
                id: 'doc_2',
                text: '¿Existe matriz de peligros y riesgos actualizada?',
                category: 'Documentación',
                citation: 'Dec. 1072/2015 Art. 2.2.4.6.15',
            },
            {
                id: 'doc_3',
                text: '¿Se registran y conservan los documentos requeridos por ley (Min. 20 años)?',
                category: 'Documentación',
                citation: 'Dec. 1072/2015 Art. 2.2.4.6.13',
            },
        ],
    },
    {
        id: 'locativa',
        title: 'Inspección Física y Locativa',
        description: 'Condiciones de infraestructura, orden y aseo.',
        questions: [
            {
                id: 'loc_1',
                text: '¿Pasillos y rutas de evacuación están libres de obstáculos?',
                category: 'Locativo',
                citation: 'Res. 2400/1979 Art. 17',
            },
            {
                id: 'loc_2',
                text: '¿La señalización de seguridad es visible y conforme a normativa?',
                category: 'Locativo',
                citation: 'Res. 2400/1979 Tit. V',
            },
            {
                id: 'loc_3',
                text: '¿Orden y limpieza según estándares (5S u otro)?',
                category: 'Locativo',
                citation: 'Res. 2400/1979 Art. 2',
            },
        ],
    },
    {
        id: 'riesgos',
        title: 'Evaluación de Riesgos',
        description: 'Identificación y gestión de peligros específicos.',
        questions: [
            {
                id: 'risk_1',
                text: '¿Se identificaron peligros físicos, químicos, biológicos y ergonómicos?',
                category: 'Riesgos',
                citation: 'GTC 45 / Dec. 1072',
            },
            {
                id: 'risk_2',
                text: '¿Se han evaluado y categorizado los riesgos por criticidad?',
                category: 'Riesgos',
                citation: 'Dec. 1072/2015',
            },
        ],
    },
    {
        id: 'epp',
        title: 'Equipos de Protección Personal (EPP)',
        description: 'Suministro y uso adecuado de elementos de protección.',
        questions: [
            {
                id: 'epp_1',
                text: '¿Se asignó EPP obligatorio a los trabajadores según matriz?',
                category: 'EPP',
                citation: 'Ley 9/1979 Art. 122',
            },
            {
                id: 'epp_2',
                text: '¿Existen registros firmados de entrega y capacitación de uso de EPP?',
                category: 'EPP',
                citation: 'Dec. 1072/2015',
            },
        ],
    },
    {
        id: 'emergencias',
        title: 'Emergencias y Primeros Auxilios',
        description: 'Preparación y respuesta ante emergencias.',
        questions: [
            {
                id: 'emg_1',
                text: '¿Existe y se ha divulgado el plan de emergencias?',
                category: 'Emergencias',
                citation: 'Dec. 1072/2015 Art. 2.2.4.6.25',
            },
            {
                id: 'emg_2',
                text: '¿Botiquines y extintores están disponibles, señalizados y vigentes?',
                category: 'Emergencias',
                citation: 'Res. 2400/1979',
            },
        ],
    },
    {
        id: 'capacitacion',
        title: 'Capacitaciones y Comunicaciones',
        description: 'Formación y toma de conciencia.',
        questions: [
            {
                id: 'cap_1',
                text: '¿Se realizaron las capacitaciones del cronograma (inducción, etc.)?',
                category: 'Capacitación',
                citation: 'Dec. 1072/2015 Art. 2.2.4.6.11',
            },
            {
                id: 'cap_2',
                text: '¿Los trabajadores conocen los procedimientos operativos seguros?',
                category: 'Capacitación',
            },
        ],
    },
    {
        id: 'investigacion',
        title: 'Investigación de Incidentes',
        description: 'Reporte y análisis de eventos.',
        questions: [
            {
                id: 'inv_1',
                text: '¿Se lleva registro estadístico de incidentes y accidentes?',
                category: 'Investigación',
                citation: 'Res. 1401/2007',
            },
            {
                id: 'inv_2',
                text: '¿Se analizan causas y se cierran acciones preventivas/correctivas?',
                category: 'Investigación',
                citation: 'Dec. 1072/2015 Art. 2.2.4.6.32',
            },
        ],
    },
];
