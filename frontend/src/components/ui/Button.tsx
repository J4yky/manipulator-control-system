import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "ghost";

type ButtonSize = "small" | "medium" | "large" | "icon";

type ButtonProps = 
ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-500",
    secondary: "bg-slate-700 hover:bg-slate-600",
    danger: "bg-red-600 hover:bg-red-500",
    ghost: "bg-transparent hover:bg-slate-800",
}

const sizeClasses = {
  small: "h-8 px-3 text-xs",
  medium: "h-10 px-4 text-sm",
  large: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
    children,
    variant = "secondary",
    size = "medium",
    type = "button",
    className = "",
    ...buttonProps
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...buttonProps}
            >
            {children}
        </button>
    );
}