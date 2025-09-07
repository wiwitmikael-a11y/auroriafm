import React from 'react';
import { TacticSettings } from '../types';

interface TacticalInstructionsProps {
  tactics: TacticSettings;
}

const TacticalInstructions: React.FC<TacticalInstructionsProps> = ({ tactics }) => {
  return (
    <div>
      <h2 className="text-lg font-bold font-display text-text-emphasis mb-2">Instructions</h2>
      <div className="glass-surface p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Mentality</label>
          <select
            defaultValue={tactics.mentality}
            className="w-full"
          >
            <option>Very Defensive</option>
            <option>Defensive</option>
            <option>Balanced</option>
            <option>Attacking</option>
            <option>Very Attacking</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Pressing Intensity: {tactics.pressing_intensity}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            defaultValue={tactics.pressing_intensity}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Defensive Line: {tactics.defensive_line_height}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            defaultValue={tactics.defensive_line_height}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TacticalInstructions;