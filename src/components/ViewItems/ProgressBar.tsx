import React from "react";

interface ProgressBarProps {
  percentage: any; 
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    const barColor = (p: any) => {
  return "bg-emerald-500"; 
};
  return (
    <div className="flex items-center justify-start gap-2">
      {/* Progress track */}
      <div className="w-[90%] sm:w-[60%] h-2.5 bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full ${barColor(percentage)} transition-[width] duration-700 ease-out relative`}
          style={{ width: `${percentage}` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="progress"
        >
          {/* Stripes animation */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, white 0 6px, transparent 6px 12px)",
              animation: "move 1.2s linear infinite",
              backgroundSize: "16px 16px",
            }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="flex text-xs font-medium text-gray-700">
        {percentage}
      </span>
    </div>
  );
};

export default ProgressBar;
