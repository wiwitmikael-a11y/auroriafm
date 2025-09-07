import React from 'react';
import { Player, FormationShape } from '../types';
import { FORMATION_COORDS } from '../pages/Tactics';
import FormationSlot from './FormationSlot';

interface FormationPitchProps {
  formation: (Player | null)[];
  formationShape: FormationShape;
  onDrop: (item: { id: string, from: 'squad' | 'pitch', originalIndex: number }, targetIndex: number | null) => void;
}

const FormationPitch: React.FC<FormationPitchProps> = ({ formation, formationShape, onDrop }) => {
    const formationLayout = FORMATION_COORDS[formationShape];

  return (
    <div 
        className="relative w-full flex-grow glass-surface overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(var(--color-accent) 1px, transparent 1px),
              radial-gradient(var(--color-accent) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            boxShadow: 'inset 0 0 40px rgba(0, 246, 255, 0.3)',
          }}
    >
      {/* Center Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-accent/50" />
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] aspect-square border-2 border-accent/50 rounded-full" />

        {formationLayout.map((slot, index) => (
            <FormationSlot
                key={index}
                player={formation[index]}
                position={slot.pos}
                positionIndex={index}
                coords={slot.coords}
                onDrop={onDrop}
            />
        ))}
    </div>
  );
};

export default FormationPitch;