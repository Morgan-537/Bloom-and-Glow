const TONES = {
  success: { bg: "var(--color-success-bg)", fg: "var(--color-success)" },
  pending: { bg: "var(--color-pending-bg)", fg: "var(--color-pending)" },
  danger: { bg: "var(--color-danger-bg)", fg: "var(--color-danger)" },
  neutral: { bg: "var(--color-border)", fg: "var(--color-gray)" },
};

export default function Badge({ tone = "neutral", children }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        background: t.bg,
        color: t.fg,
        fontSize: 11,
        fontWeight: 600,
        padding: "5px 12px",
        borderRadius: 999,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
