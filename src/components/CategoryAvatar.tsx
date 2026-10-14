import type { CSSProperties } from "react";
import { avatarForName } from "../data/avatars";
import { Icon, type IconName } from "./Icon";
import { PersonAvatar } from "./PersonAvatar";

/** Stable colour slot and icon per category, so a category looks the same in every list and chart. */
const CATS: Record<string, { slot: number; icon: IconName }> = {
  groceries: { slot: 1, icon: "cart" },
  transport: { slot: 2, icon: "bus" },
  dining: { slot: 3, icon: "dining" },
  bills: { slot: 4, icon: "receipt" },
  shopping: { slot: 5, icon: "bag" },
  health: { slot: 6, icon: "heart" },
  entertainment: { slot: 7, icon: "ticket" },
  transfers: { slot: 8, icon: "swap" },
};

export function categoryColor(id: string) {
  if (id === "income") return "var(--color-amount-positive)";
  const c = CATS[id];
  return c ? `var(--color-chart-category-${c.slot})` : "var(--bar-chart-fill)";
}

export function CategoryAvatar({
  categoryId,
  size = "md",
}: {
  categoryId: string;
  size?: "sm" | "md";
}) {
  const icon: IconName =
    categoryId === "income" ? "arrowDownLeft" : (CATS[categoryId]?.icon ?? "wallet");
  return (
    <span
      className={`cat-avatar cat-avatar--${size}`}
      style={{ "--cat": categoryColor(categoryId) } as CSSProperties}
      aria-hidden="true"
    >
      <Icon name={icon} size={size === "sm" ? "var(--icon-size-sm)" : "var(--icon-size-md)"} />
    </span>
  );
}

/** Transaction avatar: the contact's face for transfers to a demo contact, otherwise the category icon. */
export function TxAvatar({
  categoryId,
  merchant,
  size = "md",
}: {
  categoryId: string;
  merchant: string;
  size?: "sm" | "md";
}) {
  const face = categoryId === "transfers" ? avatarForName(merchant) : undefined;
  return face ? (
    <PersonAvatar name={merchant} src={face} size={size} />
  ) : (
    <CategoryAvatar categoryId={categoryId} size={size} />
  );
}
