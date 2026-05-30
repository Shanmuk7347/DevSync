import React, {
  useEffect,
} from "react";

export default function Alert({
  alert,
  setalert,
}) {
  useEffect(() => {
    if (alert) {
      const timer =
        setTimeout(() => {
          setalert(null);
        }, 3000);

      return () =>
        clearTimeout(timer);
    }
  }, [alert, setalert]);

  if (!alert) return null;

  const {
    msg,
    type = "danger",
  } =
    typeof alert === "object"
      ? alert
      : {
          msg: alert,
          type: "danger",
        };

  const variants = {
    success: {
      bg: "bg-emerald-500/90 dark:bg-emerald-600/90",
      shadow:
        "shadow-emerald-500/20",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },

    danger: {
      bg: "bg-red-500/90 dark:bg-red-600/90",
      shadow:
        "shadow-red-500/20",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="12"
          />
          <line
            x1="12"
            y1="16"
            x2="12.01"
            y2="16"
          />
        </svg>
      ),
    },
  };

  const currentVariant =
    variants[type] ||
    variants.danger;

  return (
    <div
      className={`
      fixed top-6 right-6
      w-[320px]
      ${currentVariant.bg}
      backdrop-blur-xl
      border border-white/30
      text-white
      px-5 py-4
      rounded-2xl
      shadow-2xl ${currentVariant.shadow}
      z-[100]
      animate-in fade-in slide-in-from-top-4 duration-300
    `}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
          {
            currentVariant.icon
          }
        </div>

        <h2 className="text-sm font-semibold tracking-wide leading-tight">
          {msg}
        </h2>
      </div>

      {/* Progress Bar */}

      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl w-full animate-[shrink_3s_linear_forwards]" />
    </div>
  );
}