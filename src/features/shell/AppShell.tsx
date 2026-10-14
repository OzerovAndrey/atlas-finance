import { useState, type FormEvent, type ReactNode } from "react";
import { DemoPanel } from "../../components/DemoPanel";
import { Icon } from "../../components/Icon";
import { Logo } from "../../components/Logo";
import { seed } from "../../data/demo";
import { ROUTES, type RoutePath } from "../../lib/router";
import { useTheme } from "../../lib/theme";

const demoDate = new Intl.DateTimeFormat(seed.meta.locale, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(`${seed.meta.today}T12:00:00`));

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
  const [q, setQ] = useState("");
  const search = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    location.hash = v ? `#/transactions?q=${encodeURIComponent(v)}` : "#/transactions";
    setQ("");
  };
  return (
    <div className="shell">
      <aside className="sidebar">
        <a href="#/overview" className="sidebar__logo" aria-label="Overview">
          <Logo brand={brand} />
        </a>
        <nav aria-label="Main">
          <ul className="sidebar__list">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <a
                  className="nav-item"
                  href={`#${r.path}`}
                  aria-current={r.path === route ? "page" : undefined}
                  title={r.label}
                >
                  <Icon name={r.icon} size="var(--nav-item-icon-size)" />
                  <span className="nav-item__label">{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="sidebar__note ts-caption-regular">
          <strong>ATLAS Finance</strong> · one product, four brands. Demo only, all data is
          fictional.
        </p>
      </aside>
      <div className="main">
        <header className="toolbar">
          <div className="toolbar__title">
            <h1 className="ts-title-t1">{title}</h1>
            <p className="muted ts-body-sm-regular">{demoDate}</p>
          </div>
          {route !== "/transactions" && (
            <form className="search" role="search" onSubmit={search}>
              <Icon name="search" size="var(--icon-size-md)" />
              <input
                type="search"
                placeholder="Search transactions"
                aria-label="Search transactions"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </form>
          )}
          {route !== "/transfers" && route !== "/overview" && (
            <a
              className="btn btn--primary toolbar__cta"
              href="#/transfers"
              data-event="cta_transfer_toolbar"
            >
              <Icon name="plus" size="var(--icon-size-sm)" /> <span>New transfer</span>
            </a>
          )}
        </header>
        <main className="content" id="content">
          {children}
        </main>
      </div>
      <DemoPanel />
    </div>
  );
}
