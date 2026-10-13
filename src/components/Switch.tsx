export function Switch(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  event?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={props.checked}
      aria-label={props.label}
      className="switch"
      onClick={() => props.onChange(!props.checked)}
      data-event={props.event}
    >
      <span className="switch__thumb" />
    </button>
  );
}
