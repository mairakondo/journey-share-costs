import type { ReactNode } from "react";

export function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className="icon-button">
      {children}
    </button>
  );
}
