import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/** Compact KPI tile: tinted icon, label, value, optional delta chip and caption. Shared by Overview and Analytics. */
export function Kpi(props: {
  label: string;
  icon: IconName;
  tone: "soft1" | "soft2" | "soft3" | "neutral";
  children: ReactNode;
  delta?: { text: string; tone: "positive" | "negative" | "neutral" };
  caption: string;
}) {
  return (
    <article className={`kpi kpi--${props.tone}`}>
      <p className="kpi__head">
        <span className="kpi__icon" aria-hidden="true">
          <Icon name={props.icon} size="var(--icon-size-md)" />
        </span>
        <span className="kpi__label ts-label-md">{props.label}</span>
      </p>
      <div className="kpi__value">{props.children}</div>
      <p className="kpi__foot ts-caption-regular">
        {props.delta && (
          <span className={`chip chip--${props.delta.tone}`}>{props.delta.text}</span>
        )}
        <span className="muted">{props.caption}</span>
      </p>
    </article>
  );
}
