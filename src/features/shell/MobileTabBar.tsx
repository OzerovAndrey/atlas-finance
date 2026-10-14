import { useEffect, useRef } from "react";
import { DemoControls } from "../../components/DemoControls";
import { Icon, type IconName } from "../../components/Icon";
import { PersonAvatar } from "../../components/PersonAvatar";
import { DEMO_USER } from "../../data/avatars";
import type { RoutePath } from "../../lib/router";

const TABS: { path: RoutePath; label: string; icon: IconName }[] = [
  { path: "/overview", label: "Home", icon: "grid" },
  { path: "/accounts", label: "Accounts", icon: "wallet" },
  { path: "/transactions", label: "Activity", icon: "list" },
];
const MORE: { path: RoutePath; label: string; icon: IconName; hint: string }[] = [
  { path: "/cards", label: "Cards", icon: "card", hint: "Freeze, limits, card details" },
  { path: "/analytics", label: "Analytics", icon: "chart", hint: "Money flow and categories" },
  { path: "/settings", label: "Settings", icon: "settings", hint: "Brand, theme, demo data" },
];

/**
 * Mobile navigation (≤ 720 px): a bottom tab bar that never scrolls away, with a raised
 * Transfer action in the middle and a "More" sheet for the less frequent sections.
 */
export function MobileTabBar({
  route,
  open,
  setOpen,
}: {
  route: RoutePath;
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}) {
  const moreRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inMore = MORE.some((m) => m.path === route);

  // close on navigation (hash change) and on Escape; return focus to "More"
  useEffect(() => {
    if (!open) return;
    const onHash = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        moreRef.current?.focus();
      }
    };
    addEventListener("hashchange", onHash);
    addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      removeEventListener("hashchange", onHash);
      removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const tab = (t: (typeof TABS)[number]) => (
    <li key={t.path}>
      <a
        className="tabbar__item"
        href={`#${t.path}`}
        aria-current={t.path === route ? "page" : undefined}
      >
        <Icon name={t.icon} size="var(--icon-size-md)" />
        <span>{t.label}</span>
      </a>
    </li>
  );

  return (
    <>
      {open && (
        <button
          type="button"
          className="sheet-scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <div
          ref={sheetRef}
          id="more-sheet"
          className="sheet"
          role="dialog"
          aria-modal="true"
          aria-label="More"
        >
          <span className="sheet__grip" aria-hidden="true" />
          <ul className="sheet__list">
            {MORE.map((m) => (
              <li key={m.path}>
                <a
                  className="sheet__item"
                  href={`#${m.path}`}
                  aria-current={m.path === route ? "page" : undefined}
                >
                  <span className="tile__icon" aria-hidden="true">
                    <Icon name={m.icon} size="var(--icon-size-md)" />
                  </span>
                  <span className="sheet__text">
                    <span className="ts-body-md-strong">{m.label}</span>
                    <span className="ts-caption-regular muted">{m.hint}</span>
                  </span>
                  <Icon name="chevronDown" size="var(--icon-size-sm)" />
                </a>
              </li>
            ))}
          </ul>
          <DemoControls />
          <div className="sheet__profile">
            <PersonAvatar name={DEMO_USER.name} src={DEMO_USER.avatar} size="md" />
            <span className="sheet__text">
              <span className="ts-body-sm-strong">{DEMO_USER.name}</span>
              <span className="ts-caption-regular muted">
                ATLAS Finance demo · all data is fictional
              </span>
            </span>
          </div>
        </div>
      )}
      <nav className="tabbar" aria-label="Main">
        <ul className="tabbar__list">
          {TABS.slice(0, 2).map(tab)}
          <li>
            <a
              className="tabbar__fab"
              href="#/transfers"
              aria-label="New transfer"
              aria-current={route === "/transfers" ? "page" : undefined}
            >
              <Icon name="send" size="var(--icon-size-lg)" />
            </a>
          </li>
          {TABS.slice(2).map(tab)}
          <li>
            <button
              ref={moreRef}
              type="button"
              className="tabbar__item"
              aria-expanded={open}
              aria-controls="more-sheet"
              aria-current={inMore ? "page" : undefined}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name="dots" size="var(--icon-size-md)" />
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
