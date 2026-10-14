/** Round avatar for a person: 3D image when one exists, otherwise initials. Decorative — the name is always shown next to it. */
export const initialsOf = (s: string) =>
  s
    .split(/[\s&·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export function PersonAvatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`person-avatar person-avatar--${size}`} aria-hidden="true">
      {src ? (
        <img src={src} alt="" width="128" height="128" loading="lazy" decoding="async" />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}
