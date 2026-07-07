import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spin the Wheel — Aaj Kya Banau?',
  description: 'Can\'t decide what to cook? Spin the wheel and let fate decide! Filter by cuisine, add custom dishes, and let\'s go.',
};

export default function SpinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
