import { cn } from "../../utils/cn";

export default function Button({
  children,
  className,
  variant = "primary",
  isLoading,
  ...props
}) {
  const baseStyle =
    "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30",
    secondary:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/30",
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        children
      )}
    </button>
  );
}
