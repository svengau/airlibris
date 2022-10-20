import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ButtonProps {
  children: any;
  as?: any;
  href?: string;
  type?: string;
  variant?: string;
  className?: string;
  bgClassName?: string;
  bgHoverClassName?: string;
  disabled?: boolean;
  icon?: any;
  loading?: boolean;
  to?: string;
  onClick?: (e?: any) => any | void;
}

const variants = {
  primary: {
    className: "px-4 py-2 font-semibold text-white",
    bgClassName: "bg-blue-500",
    bgHoverClassName: "bg-blue-700",
  },
  secondary: {
    className:
      "px-4 py-2 font-semibold text-blue-600 border border-1 border-blue-600",
    bgClassName: "bg-white",
    bgHoverClassName: "bg-grey-100",
  },
};

function Button({
  as: As = "button",
  loading,
  disabled,
  icon: Icon,
  variant = "primary",
  className: _className,
  bgClassName: _bgClassName,
  bgHoverClassName: _bgHoverClassName,
  children,
  ...rest
}: ButtonProps) {
  const className = _className || variants[variant].className;
  const bgClassName = _bgClassName || variants[variant].bgClassName;
  const bgHoverClassName =
    _bgHoverClassName || variants[variant].bgHoverClassName;

  return (
    <As
      disabled={disabled || loading}
      {...rest}
      className={`
        text-sm rounded inline-flex items-center justify-center
        print:hidden
        ${bgClassName}
        ${className}
        ${
          disabled || loading
            ? "opacity-50 cursor-default"
            : `hover:${bgHoverClassName}`
        }
      `}
    >
      {loading ? (
        <ArrowPathIcon className="mr-3 text-xs animate-spin" />
      ) : (
        Icon && <Icon className="mr-3" />
      )}
      {children}
    </As>
  );
}

export default Button;
