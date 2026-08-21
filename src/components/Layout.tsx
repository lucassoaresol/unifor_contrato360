import type { Child, FC } from 'hono/jsx';

import { Icon, type IconName } from './Icon';

type ActivePage = 'contracts' | 'overview';

type LayoutProps = {
  activePage: ActivePage;
  children: Child;
};

type NavItemProps = {
  active?: boolean;
  href: string;
  icon: IconName;
  label: string;
};

const NavItem: FC<NavItemProps> = ({ active = false, href, icon, label }) => {
  const content = (
    <>
      <Icon name={icon} size={19} />
      <span>{label}</span>
    </>
  );

  return (
    <a
      class={`nav-item${active ? ' nav-item--active' : ''}`}
      href={href}
      aria-current={active ? 'page' : undefined}
    >
      {content}
    </a>
  );
};

export const Layout: FC<LayoutProps> = ({ activePage, children }) => (
  <div class="app-shell">
    <a class="skip-link" href="#conteudo-principal">
      Ir para o conteúdo
    </a>
    <aside class="sidebar">
      <a class="brand" href="/" aria-label="Contrato360 — Visão geral">
        <span class="brand__mark">
          <Icon name="document" size={21} />
        </span>
        <span class="brand__copy">
          <strong>Contrato360</strong>
          <small>Gestão inteligente de contratos</small>
        </span>
      </a>

      <nav class="primary-nav" aria-label="Navegação principal">
        <p class="nav-label">Navegação</p>
        <NavItem active={activePage === 'overview'} href="/" icon="grid" label="Visão geral" />
        <NavItem
          active={activePage === 'contracts'}
          href="/contratos/023-2026"
          icon="document"
          label="Contratos"
        />
      </nav>

      <div class="sidebar__footer">
        <p>
          Protótipo desenvolvido por
          <strong>Lucas Soares</strong>
        </p>
        <div class="sidebar__links">
          <a
            href="https://github.com/lucassoaresol/unifor_contrato360"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" size={16} />
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/lucassoaresolv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="linkedin" size={16} />
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </aside>

    <main class="main-content" id="conteudo-principal">
      {children}
    </main>
  </div>
);
