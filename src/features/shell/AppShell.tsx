import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { DemoPanel } from "../../components/DemoPanel";
import { Icon } from "../../components/Icon";
import { Logo, LogoMark } from "../../components/Logo";
import { MobileTabBar } from "./MobileTabBar";
import { PersonAvatar } from "../../components/PersonAvatar";
import { DEMO_USER } from "../../data/avatars";
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
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { mode } = useTheme();
  // the frame is fixed and only the content area scrolls, so a new page starts at the top
  useEffect(() => {
    // scrolling back fires onScroll, which also clears the toolbar shadow
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
          <PersonAvatar name={DEMO_USER.name} src={DEMO_USER.avatar} size="md" />
          <span className="profile__text">
            <span className="ts-body-sm-strong">{DEMO_USER.name}</span>
            <span className="ts-caption-regular muted">Personal · demo</span>
          </span>
        </div>
        <p className="sidebar__note ts-caption-regular">
          <strong>ATLAS Finance</strong> · one product, four brands. Demo only, all data is
          fictional.
          <br />
          Designed by{" "}
          <a
            className="author-credit"
            href="https://ozerovandrey.github.io/portfolio/en/cases/atlas-finance/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Andriy Ozerov
          </a>
        </p>
      </aside>
      <div className={`main${scrolled ? " is-scrolled" : ""}`}>
        <header className="toolbar">
          <a href="#/overview" className="toolbar__mark" aria-label="Overview">
            <LogoMark brand={brand} size={28} />
          </a>
          <div className="toolbar__title">
            <h1 className="ts-title-t1">{title}</h1>
            <p className="muted ts-body-sm-regular">{demoDate}</p>
          </div>
          {/* mobile-only quick actions; on desktop the search field and sidebar profile cover these */}
          <div className="toolbar__mobile">
            <button
              type="button"
              className="icon-btn icon-btn--outline"
              onClick={() => setMoreOpen(true)}
              aria-label="Switch brand or theme"
              data-event="demo_open_mobile"
            >
              <i className="dot-brand" data-brand={brand} data-theme={mode} aria-hidden="true" />
            </button>
            {route !== "/transactions" && (
              <a
                className="icon-btn icon-btn--outline"
                href="#/transactions"
                aria-label="Search transactions"
              >
                <Icon name="search" size="var(--icon-size-md)" />
              </a>
            )}
            <a
              className="toolbar__avatar"
              href="#/settings"
              aria-label={`${DEMO_USER.name}, settings`}
            >
              <PersonAvatar name={DEMO_USER.name} src={DEMO_USER.avatar} size="sm" />
            </a>
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
        <main
          className="content"
          id="content"
          ref={contentRef}
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
        >
          {children}
        </main>
        <MobileTabBar route={route} open={moreOpen} setOpen={setMoreOpen} />
      </div>
      <DemoPanel />
    </div>
  );
}
