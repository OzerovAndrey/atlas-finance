import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
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
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  // the frame is fixed and only the content area scrolls, so a new page starts at the top
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [route]);
  // "/" focuses search (skipped while typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement ||
        el?.isContentEditable;
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
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
        <nav aria-label="Main" className="sidebar__nav">
          <p className="sidebar__section" aria-hidden="true">
            Menu
          </p>
          <ul className="sidebar__list">
            {ROUTES.filter((r) => r.path !== "/settings").map((r) => (
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
          <p className="sidebar__section" aria-hidden="true">
            System
          </p>
          <ul className="sidebar__list">
            {ROUTES.filter((r) => r.path === "/settings").map((r) => (
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
        <div className="profile">
          <span className="profile__avatar" aria-hidden="true">
            AM
          </span>
          <span className="profile__text">
            <span className="ts-body-sm-strong">Alex Morgan</span>
            <span className="ts-caption-regular muted">Personal · demo</span>
          </span>
        </div>
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
                ref={searchRef}
                type="search"
                placeholder="Search transactions"
                aria-label="Search transactions"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <kbd className="search__kbd" title="Press / to search">
                /
              </kbd>
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
        <main className="content" id="content" ref={contentRef}>
          {children}
        </main>
      </div>
      <DemoPanel />
    </div>
  );
}
