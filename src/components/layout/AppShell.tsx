import { Component, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';
import BackToTop from './BackToTop';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

// Un error de render en una primitiva no debe tumbar el sidebar: sin esto,
// React desmonta toda la app y queda la pantalla en blanco.
class RenderBoundary extends Component<{ message: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed
      ? <p className={styles.renderError} role="alert">{this.props.message}</p>
      : this.props.children;
  }
}

export default function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          {/* key: cambiar de módulo reintenta el render. */}
          <RenderBoundary key={pathname} message={t('common.render_error')}>
            {children}
          </RenderBoundary>
        </main>
      </div>
      <BackToTop />
    </div>
  );
}
