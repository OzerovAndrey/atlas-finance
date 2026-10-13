import type { ReactNode } from "react";
import { Icon } from "../../components/Icon";
import { DemoBar } from "../../components/DemoBar";
import { Logo } from "../../components/Logo";
import { ROUTES, type RoutePath } from "../../lib/router";
import { useTheme } from "../../lib/theme";

export function AppShell({
  route,
  title,
  children,
}: {
  route: RoutePath;
  title: string;
  children: ReactNode;
}) {
  const { brand } = useTheme();
  return (
    <div className="shell">
      <aside className="sidebar">
        <Logo brand={brand} />
        <nav aria-label="Main">
          <p className="sidebar__section">MENU</p>
          <ul className="sidebar__list">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <a
                  className="nav-item"
                  href={`#${r.path}`}
                  aria-current={r.path === route ? "page" : undefined}
                >
                  <Icon name={r.icon} size="var(--nav-item-icon-size)" />
                  <span>{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="sidebar__note ts-caption-regular">Demo only. All data is fictional.</p>
      </aside>
      <div className="main">
        <header className="topbar">
          <h1 className="topbar__title ts-title-t1">{title}</h1>
          <div className="topbar__tools">
            <label className="search-bar">
              <Icon name="search" size="var(--search-bar-icon-size, var(--icon-size-md))" />
              <input type="search" placeholder="Search…" aria-label="Search" />
            </label>
          </div>
        </header>
        <main className="content" id="content">
          {children}
        </main>
      </div>
      <DemoBar />
    </div>
  );
}
