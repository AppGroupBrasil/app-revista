'use client';

import { useEffect, useState } from 'react';
import InstallPrompt from './InstallPrompt';

const STORAGE_KEY = 'apprevista:install-dismissed';
const REMINDER_DAYS = 7;

interface Props {
  context?: 'chamado' | 'tarefa' | 'geral';
  delay?: number;
}

export default function AutoInstallPrompt({ context = 'geral', delay = 6000 }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS
      window.navigator.standalone === true;
    if (standalone) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const days = (Date.now() - Number(dismissed)) / 86_400_000;
      if (days < REMINDER_DAYS) return;
    }

    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  function dismiss() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
    setShow(false);
  }

  return <InstallPrompt show={show} onDismiss={dismiss} context={context} />;
}
