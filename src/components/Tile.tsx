import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Tile(props: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  action?: { href: string; label: string };
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`tile ${props.className ?? ""}`}>
      <header className="tile__head">
        {props.icon && (
          <span className="tile__icon" aria-hidden="true">
            <Icon name={props.icon} size="var(--icon-size-md)" />
          </span>
        )}
        <div className="tile__heading">
          <h2 className="tile__title">{props.title}</h2>
          {props.subtitle && <p className="tile__subtitle">{props.subtitle}</p>}
        </div>
        {props.extra}
        {props.action && (
          <a
            className="icon-btn icon-btn--outline"
            href={props.action.href}
            aria-label={props.action.label}
          >
            <Icon name="arrowUpRight" size="var(--icon-size-md)" />
          </a>
        )}
      </header>
      {props.children}
    </section>
  );
}
