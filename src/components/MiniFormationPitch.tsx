import React from 'react';
import { FormationShape } from '../types';

const FORMATION_COORDS: Record<FormationShape, { x: number; y: number }[]> = {
    '4-4-2': [
        { x: 50, y: 92 },
        { x: 20, y: 75 }, { x: 40, y: 78 }, { x: 60, y: 78 }, { x: 80, y: 75 },
        { x: 25, y: 50 }, { x: 45, y: 53 }, { x: 65, y: 53 }, { x: 85, y: 50 },
        { x: 40, y: 25 }, { x: 60, y: 25 },
    ],
    '4-3-3': [
        { x: 50, y: 92 },
        { x: 20, y: 75 }, { x: 40, y: 78 }, { x: 60, y: 78 }, { x: 80, y: 75 },
        { x: 35, y: 55 }, { x: 50, y: 60 }, { x: 65, y: 55 },
        { x: 25, y: 25 }, { x: 50, y: 20 }, { x: 75, y: 25 },
    ],
    '3-5-2': [
        { x: 50, y: 92 },
        { x: 30, y: 78 }, { x: 50, y: 80 }, { x: 70, y: 78 },
        { x: 15, y: 50 }, { x: 35, y: 55 }, { x: 50, y: 60 }, { x: 65, y: 55 }, { x: 85, y: 50 },
        { x: 40, y: 25 }, { x: 60, y: 25 },
    ],
    '5-3-2': [
        { x: 50, y: 92 },
        { x: 15, y: 75 }, { x: 35, y: 78 }, { x: 50, y: 80 }, { x: 65, y: 78 }, { x: 85, y: 75 },
        { x: 35, y: 50 }, { x: 50, y: 55 }, { x: 65, y: 50 },
        { x: 40, y: 25 }, { x: 60, y: 25 },
    ],
};

interface MiniFormationPitchProps {
  formation: FormationShape;
}

const MiniFormationPitch: React.FC<MiniFormationPitchProps> = ({ formation }) => {
  const coords = FORMATION_COORDS[formation] || [];
  
  return (
    <div className="w-full aspect-video bg-slate-900/50 rounded-md p-2 border border-border">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Pitch Outline */}
        <rect x="5" y="5" width="90" height="90" fill="none" stroke="var(--color-border)" strokeWidth="1" />
        {/* Halfway Line */}
        <line x1="5" y1="50" x2="95" y2="50" stroke="var(--color-border)" strokeWidth="1" />
        {/* Center Circle */}
        <circle cx="50" cy="50" r="15" fill="none" stroke="var(--color-border)" strokeWidth="1" />

        {/* Player Positions */}
        {coords.map((pos, index) => (
          <circle key={index} cx={pos.x} cy={pos.y} r="3" fill="var(--color-accent)" />
        ))}
      </svg>
    </div>
  );
};

export default MiniFormationPitch;