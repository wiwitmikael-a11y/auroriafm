import React from 'react';
import { TacticalPlayer } from '../types';
import PlayerChit from './PlayerChit';

interface RosterListProps {
  players: TacticalPlayer[];
}

const RosterList: React.FC<RosterListProps> = ({ players }) => {
  return (
    <div className="flex-grow flex flex-col min-h-0">
        <h2 className="text-lg font-bold font-display text-text-emphasis mb-2">Roster</h2>
        <div className="flex-grow glass-surface p-2 overflow-y-auto">
            <div className="grid grid-cols-3 gap-1">
                {players.map(player => (
                    <PlayerChit key={player.id} player={player} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default RosterList;