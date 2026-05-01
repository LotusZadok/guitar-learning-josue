import type { ReactNode } from 'react';
import styles from './RuleNote.module.css';

interface RuleNoteProps {
  children: ReactNode;
}

export default function RuleNote({ children }: RuleNoteProps) {
  return <div className={styles.note}>{children}</div>;
}
