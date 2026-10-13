import type { ReactNode } from "react";
import { Icon } from "../../components/Icon";
import { Logo } from "../../components/Logo";
import { ROUTES, type RoutePath } from "../../lib/router";
import { BRANDS, useTheme, type Brand, type Mode } from "../../lib/theme";

const MODES: Mode[] = ["light", "dark"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AppShell({
  route,
  title,
  children,
}: {
  route: RoutePath;
  title: string;
  children: ReactNode;
}) {
  const { brand, mode, setBrand, setMode } = useTheme();
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
            <div className="segmented" role="group" aria-label="Brand">
              {BRANDS.map((b: Brand) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={b === brand}
                  onClick={() => setBrand(b)}
                  data-event={`brand_${b}`}
                >
                  {b.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="segmented" role="group" aria-label="Theme">
              {MODES.map((m) => (
                <button key={m} type="button" aria-pressed={m === mode} onClick={() => setMode(m)}>
                  {cap(m)}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main className="content" id="content">
          {children}
        </main>
      </div>
    </div>
  );
}
