import { useMemo } from "react";
import { formatMoney } from "../lib/format";

const locale = "en-IE";

/** Money with a quieter decimal part. Always formatted through Intl; never string-concatenated. */
export function Amount(props: {
  minor: number;
  currency: string;
  signed?: boolean;
  size?: "hero" | "xl" | "lg" | "md" | "sm";
  className?: string;
  tone?: "positive" | "negative";
}) {
  const { minor, currency, signed, size = "md", tone } = props;
  const parts = useMemo(() => {
    const p = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      signDisplay: signed ? "exceptZero" : "auto",
    }).formatToParts(minor / 100);
    const i = p.findIndex((x) => x.type === "decimal");
    if (i < 0) return { int: p.map((x) => x.value).join(""), dec: "" };
    return {
      int: p
        .slice(0, i)
        .map((x) => x.value)
        .join(""),
      dec: p
        .slice(i)
        .map((x) => x.value)
        .join(""),
    };
  }, [minor, currency, signed]);
  return (
    <span
      className={`amt amt--${size} ${tone ? `amt--${tone}` : ""} ${props.className ?? ""}`}
      style={{ "--len": parts.int.length } as React.CSSProperties}
      aria-label={formatMoney(minor, currency, signed)}
    >
      <span className="amt__int" aria-hidden="true">
        {parts.int}
      </span>
      <span className="amt__dec" aria-hidden="true">
        {parts.dec}
      </span>
    </span>
  );
}
