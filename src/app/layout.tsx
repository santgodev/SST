import type { Metadata } from 'next';
import './globals.css';
import { ChecklistProvider } from '@/lib/checklist-context';

export const metadata: Metadata = {
  title: 'SST Colombia Checklist 2025',
  description: 'Sistema de Gestión de Seguridad y Salud en el Trabajo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ChecklistProvider>{children}</ChecklistProvider>
      </body>
    </html>
  );
}
