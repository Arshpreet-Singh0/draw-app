import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "outline";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  type? : "submit" | "button"
}

const variantClasses = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-[#4F45E4] text-white",
  outline: "border border-gray-500",
};

const defaultStyles =
  "px-4 py-2 rounded-md font-light flex items-center justify-center";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
  className,
  type
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={
        variantClasses[variant] +
        " " +
        `${className}` +
        " " +
        defaultStyles +
        `${fullWidth ? " w-full flex justify-center items-center" : ""} ${
          loading ? "opacity-45	" : ""
        }`
      }
      disabled={loading}
    >
      {startIcon && <div className="pr-2">{startIcon}</div>}

      {text}
    </button>
  );
}