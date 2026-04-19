import React from 'react';

interface AngleDisplayProps {
  kneeAngle: number;
  hipAngle: number;
  backAngle: number;
  visible?: boolean;
}

export const AngleDisplay: React.FC<AngleDisplayProps> = ({
  kneeAngle,
  hipAngle,
  backAngle,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-black/50 p-3 backdrop-blur-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Joint Angles
      </div>
      <AngleRow label="Knee" value={kneeAngle} optimal={[80, 100]} />
      <AngleRow label="Hip" value={hipAngle} optimal={[70, 110]} />
      <AngleRow label="Back" value={backAngle} optimal={[0, 30]} isBackAngle />
    </div>
  );
};

interface AngleRowProps {
  label: string;
  value: number;
  optimal: [number, number];
  isBackAngle?: boolean;
}

const AngleRow: React.FC<AngleRowProps> = ({ label, value, optimal, isBackAngle = false }) => {
  const isGood = value >= optimal[0] && value <= optimal[1];
  const isWarning = isBackAngle
    ? value > optimal[1] && value <= optimal[1] + 15
    : value < optimal[0] - 20 || value > optimal[1] + 20;

  const color = isGood ? 'text-green-400' : isWarning ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="w-10 text-xs text-gray-400">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-1.5 rounded-full transition-all duration-150 ${isGood ? 'bg-green-400' : isWarning ? 'bg-yellow-400' : 'bg-red-400'}`}
          style={{ width: `${Math.min(100, (value / 180) * 100)}%` }}
        />
      </div>
      <span className={`w-16 text-right text-sm font-mono font-semibold ${color}`}>
        {value.toFixed(1)}°
      </span>
    </div>
  );
};

