import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Tile(props: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`tile ${props.className ?? ""}`}>
      <header className="tile__head">
        <div>
          <h2 className="tile__title">{props.title}</h2>
          {props.subtitle && <p className="tile__subtitle">{props.subtitle}</p>}
        </div>
        {props.action && (
          <a className="icon-btn" href={props.action.href} aria-label={props.action.label}>
            <Icon name="arrowUpRight" size="var(--icon-size-md)" />
          </a>
        )}
      </header>
      {props.children}
    </section>
  );
}
