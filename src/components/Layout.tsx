import type { Child, FC } from 'hono/jsx';

import { Icon, type IconName } from './Icon';

type ActivePage = 'contracts' | 'overview';

type LayoutProps = {
  activePage: ActivePage;
  children: Child;
};

type NavItemProps = {
  active?: boolean;
  href?: string;
  icon: IconName;
  label: string;
  upcoming?: boolean;
};

const NavItem: FC<NavItemProps> = ({ active = false, href, icon, label, upcoming = false }) => {
  const content = (
    <>
      <Icon name={icon} size={19} />
      <span>{label}</span>
      {upcoming ? <span class="nav-item__soon">Em breve</span> : null}
    </>
  );

  if (!href) {
    return <span class="nav-item nav-item--disabled">{content}</span>;
  }

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
          <small>Gestão inteligente</small>
        </span>
      </a>

      <nav class="primary-nav" aria-label="Navegação principal">
        <p class="nav-label">Workspace</p>
        <NavItem active={activePage === 'overview'} href="/" icon="grid" label="Visão geral" />
        <NavItem
          active={activePage === 'contracts'}
          href="/contratos/023-2026"
          icon="document"
          label="Contratos"
        />
        <NavItem icon="clipboard" label="Ocorrências" upcoming />
        <NavItem icon="pending" label="Pendências" upcoming />
      </nav>

      <div class="sidebar__footer">
        <span class="sidebar__status-dot" />
        <span>
          <strong>Ambiente de demonstração</strong>
          <small>Dados fictícios</small>
        </span>
      </div>
    </aside>

    <main class="main-content" id="conteudo-principal">
      {children}
    </main>
  </div>
);
