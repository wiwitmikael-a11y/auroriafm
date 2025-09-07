import React from 'react';
import { TacticSettings, FormationShape } from '../types';

interface TacticalInstructionsProps {
  tactics: TacticSettings;
  onAutoAssign: () => void;
}

const TacticalInstructions: React.FC<TacticalInstructionsProps> = ({ tactics, onAutoAssign }) => {
  const formations: FormationShape[] = ['4-4-2', '4-3-3', '3-5-2', '5-3-2'];

  return (
    <div>
      <h2 className="text-lg font-bold font-display text-text-emphasis mb-2">Instructions</h2>
      <div className="glass-surface p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Formation</label>
          <select defaultValue={tactics.formation} className="w-full">
            {formations.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <button onClick={onAutoAssign} className="w-full button-primary" style={{backgroundColor: 'var(--color-accent-secondary)'}}>
            Auto-Assign Best XI
        </button>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Mentality</label>
          <select defaultValue={tactics.mentality} className="w-full">
            <option>Very Defensive</option>
            <option>Defensive</option>
            <option>Balanced</option>
            <option>Attacking</option>
            <option>Very Attacking</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Pressing Intensity: {tactics.pressing_intensity}</label>
          <input type="range" min="1" max="5" defaultValue={tactics.pressing_intensity} className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Defensive Line: {tactics.defensive_line_height}</label>
          <input type="range" min="1" max="5" defaultValue={tactics.defensive_line_height} className="w-full" />
        </div>
        <button className="w-full button-primary mt-2">Save Tactics</button>
      </div>
    </div>
  );
};

export default TacticalInstructions;