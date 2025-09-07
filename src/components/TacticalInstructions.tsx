import React, { useState, useEffect } from 'react';
import { TacticSettings, FormationShape } from '../types';
import MiniFormationPitch from './MiniFormationPitch';
import { useWorld } from '../contexts/WorldContext';

interface TacticalInstructionsProps {
  tactics: TacticSettings;
  onAutoAssign: () => void;
}

const TacticalInstructions: React.FC<TacticalInstructionsProps> = ({ tactics, onAutoAssign }) => {
  const { managerClubId, updateClubTactics } = useWorld();
  const [localTactics, setLocalTactics] = useState<TacticSettings>(tactics);

  useEffect(() => {
    setLocalTactics(tactics);
  }, [tactics]);

  const handleTacticChange = (field: keyof TacticSettings, value: any) => {
    setLocalTactics(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateClubTactics(managerClubId, localTactics);
  };

  const formations: FormationShape[] = ['4-4-2', '4-3-3', '3-5-2', '5-3-2'];

  return (
    <div className="flex-shrink-0">
      <h2 className="text-lg font-bold font-display text-text-emphasis mb-2">Instructions</h2>
      <div className="glass-surface p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Formation</label>
                  <select 
                    value={localTactics.formation}
                    onChange={(e) => handleTacticChange('formation', e.target.value as FormationShape)}
                    className="w-full"
                  >
                    {formations.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                
                <MiniFormationPitch formation={localTactics.formation} />

                <button onClick={onAutoAssign} className="w-full button-primary" style={{backgroundColor: 'var(--color-accent-secondary)'}}>
                    Auto-Assign Best XI
                </button>
            </div>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Mentality</label>
                  <select 
                    value={localTactics.mentality}
                    onChange={(e) => handleTacticChange('mentality', e.target.value as TacticSettings['mentality'])}
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
                  <label className="block text-xs font-medium text-text-secondary mb-1">Pressing Intensity: {localTactics.pressing_intensity}</label>
                  <input 
                    type="range" min="1" max="5" 
                    value={localTactics.pressing_intensity} 
                    onChange={(e) => handleTacticChange('pressing_intensity', parseInt(e.target.value, 10))}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Defensive Line: {localTactics.defensive_line_height}</label>
                  <input 
                    type="range" min="1" max="5" 
                    value={localTactics.defensive_line_height}
                    onChange={(e) => handleTacticChange('defensive_line_height', parseInt(e.target.value, 10))}
                    className="w-full" />
                </div>
                 <button onClick={handleSave} className="w-full button-primary mt-2">Save Tactics</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalInstructions;