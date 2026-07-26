import { cn } from "../../utils/cn";

export default function Input({ icon: Icon, className, ...props }) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={20} />
        </div>
      )}
      <input
        className={cn(
          "w-full py-3.5 px-4 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 shadow-sm",
          Icon && "pl-11",
          className,
        )}
        {...props}
      />
    </div>
  );
}
