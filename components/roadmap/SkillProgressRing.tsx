"use client";

import React from "react";

interface SkillProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  ringColorHex?: string;
  children?: React.ReactNode;
}

export function SkillProgressRing({
  percent,
  size = 88,
  strokeWidth = 5,
  ringColorHex,
  children,
}: SkillProgressRingProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  // Determine stroke color if not explicitly provided
  const getStrokeColor = () => {
    if (ringColorHex) return ringColorHex;
    if (clampedPercent >= 100) return "#00C48C"; // Mastered / Completed Green
    if (clampedPercent > 0) return "#6E43FF"; // In Progress Purple
    return "#FF8A00"; // Pending / 0% Orange
  };

  const strokeColor = getStrokeColor();

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>

      <span className="mt-2 text-[11px] font-medium text-text-secondary">
        {clampedPercent}% <span className="text-gray-400">de avance</span>
      </span>
    </div>
  );
}
