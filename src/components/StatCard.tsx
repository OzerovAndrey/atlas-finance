import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type Tone = "primary" | "inverse" | "soft1" | "soft2" | "soft3" | "neutral";

export function StatCard(props: {
  tone: Tone;
  icon: IconName;
  label: string;
  value: string;
  footer: ReactNode;
}) {
  return (
    <article className={`stat-card stat-card--${props.tone}`}>
      <header className="stat-card__head">
        <span className="stat-card__chip">
          <Icon name={props.icon} size="var(--stat-card-icon-size)" />
        </span>
        <span className="stat-card__label">{props.label}</span>
      </header>
      <p className="stat-card__value ts-numeric-balance">{props.value}</p>
      <footer className="stat-card__foot">{props.footer}</footer>
    </article>
  );
}
