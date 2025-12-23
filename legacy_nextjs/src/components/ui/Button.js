import { Loader2 } from "lucide-react";

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) {
    const baseClass = "btn";
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "btn-ghost"
    };

    return (
        <button
            className={`${baseClass} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {children}
        </button>
    );
}
