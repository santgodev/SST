export const COMPANY_ROLES = [
    { value: 'admin', label: 'Administrador', description: 'Control total de la empresa y usuarios' },
    { value: 'inspector', label: 'Inspector', description: 'Puede crear reportes e inspecciones' },
    { value: 'viewer', label: 'Observador', description: 'Solo lectura de reportes y tableros' },
] as const;

export type CompanyRole = typeof COMPANY_ROLES[number]['value'];
