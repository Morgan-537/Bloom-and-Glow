export default function Card({ children, style, className = "", ...props }) {
  return (
    <div
      {...props}
      className={`card ${className}`.trim()}
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-card)",
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
