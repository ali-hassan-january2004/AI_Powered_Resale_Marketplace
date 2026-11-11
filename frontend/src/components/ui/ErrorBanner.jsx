import { AlertCircle } from "lucide-react";

export default function ErrorBanner({ message = "Something went wrong.", onRetry, className = "" }) {
  return (
    <div role="alert" className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 ${className}`}>
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="font-medium underline hover:no-underline">Try again</button>
      )}
    </div>
  );
}