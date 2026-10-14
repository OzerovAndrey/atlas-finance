import { useRef, type CSSProperties, type PointerEvent } from "react";
import type { Card } from "../data/types";
import { DEMO_USER } from "../data/avatars";
import { useTheme } from "../lib/theme";
import { Icon } from "./Icon";
import { LogoMark } from "./Logo";

const reducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.dataset.motion === "reduced";

/** Metallic EMV chip, drawn with card tokens only. */
function Chip() {
  return (
    <svg className="bank-card__chip" viewBox="0 0 48 36" aria-hidden="true">
      <rect x="0.5" y="0.5" width="47" height="35" rx="7" className="chip__body" />
      <path
        d="M0.5 12H15M0.5 24H15M33 12H47.5M33 24H47.5M15 0.5V35.5M33 0.5V35.5M15 18H33M24 0.5V9M24 27V35.5"
        className="chip__lines"
      />
      <rect x="15" y="9" width="18" height="18" rx="4" className="chip__pad" />
    </svg>
  );
}

/** Fine guilloché waves, the classic security print of bank cards. */
function Guilloche() {
  return (
    <svg
      className="bank-card__guilloche"
      viewBox="0 0 320 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M-10 ${120 + i * 7} C 60 ${60 + i * 9}, 140 ${190 - i * 4}, 210 ${110 + i * 3} S 330 ${40 + i * 8}, 340 ${70 + i * 6}`}
        />
      ))}
    </svg>
  );
}

/**
 * Bank card with a physical 3D feel: layered brand glows, guilloché print, metallic chip,
 * embossed number, and a pointer-driven tilt with a moving glare (off for reduced motion).
 */
export function BankCard({ card, interactive = true }: { card: Card; interactive?: boolean }) {
  const { brand } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const frozen = card.status === "frozen";
  const virtual = card.kind === "virtual";

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !interactive || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.dataset.active = "true";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.dataset.active = "false";
  };

  return (
    <div className="bank-card-3d" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        className={`bank-card bank-card--${virtual ? "virtual" : "physical"}${frozen ? " bank-card--frozen" : ""}`}
        style={{ "--rx": "0deg", "--ry": "0deg", "--mx": "50%", "--my": "0%" } as CSSProperties}
        role="img"
        aria-label={`${card.name}, ${virtual ? "virtual" : "physical"} card ending ${card.last4}, expires ${card.expires}${frozen ? ", frozen" : ""}`}
      >
        <Guilloche />
        <span className="bank-card__glow" aria-hidden="true" />
        <span className="bank-card__glare" aria-hidden="true" />

        <div className="bank-card__top">
          <span className="bank-card__brand">
            <LogoMark brand={brand} size={28} />
            <span className="bank-card__wordmark">{brand.toUpperCase()}</span>
          </span>
          <span className="bank-card__kind">{virtual ? "Virtual" : "Debit"}</span>
        </div>

        <div className="bank-card__middle">
          {virtual ? (
            <span className="bank-card__virtual-badge">
              <Icon name="sparkle" size="var(--icon-size-sm)" /> Online only
            </span>
          ) : (
            <Chip />
          )}
          {card.contactless && !frozen && (
            <span className="bank-card__contactless">
              <Icon name="wifi" size="var(--icon-size-lg)" />
            </span>
          )}
        </div>

        <p className="bank-card__number">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>{card.last4}</span>
        </p>

        <div className="bank-card__bottom">
          <span className="bank-card__field">
            <span className="bank-card__label">Card holder</span>
            <span>{DEMO_USER.name.toUpperCase()}</span>
          </span>
          <span className="bank-card__field">
            <span className="bank-card__label">Expires</span>
            <span>{card.expires}</span>
          </span>
          <span className="bank-card__network" aria-hidden="true">
            ATLAS
            <small>demo</small>
          </span>
        </div>

        {frozen && (
          <span className="bank-card__frost">
            <Icon name="snow" size="var(--icon-size-xl)" />
            <span>Frozen</span>
          </span>
        )}
      </div>
    </div>
  );
}
