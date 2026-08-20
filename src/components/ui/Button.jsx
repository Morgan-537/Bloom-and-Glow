export default function Button({ children, variant = "primary", as: As = "button", ...props }) {
  const styles = {
    primary: {
      background: "var(--color-primary)",
      color: "var(--color-white)",
      border: "none",
    },
    gradient: {
      background: "var(--gradient-primary)",
      color: "var(--color-white)",
      border: "none",
    },
    outline: {
      background: "var(--color-white)",
      color: "var(--color-dark)",
      border: "1px solid var(--color-border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-primary)",
      border: "none",
    },
  };

  return (
    <As
      {...props}
      style={{
        ...styles[variant],
        padding: "12px 20px",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "opacity 0.15s ease",
        ...props.style,
      }}
    >
      {children}
    </As>
  );
}
