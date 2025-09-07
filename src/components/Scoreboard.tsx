import React from 'react';
import { Club } from '../types';
import ClubCrest from './ClubCrest';

interface ScoreboardProps {
  homeTeam: Club;
  awayTeam: Club;
  homeScore: number;
  awayScore: number;
  time: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ homeTeam, awayTeam, homeScore, awayScore, time }) => {
  return (
    <div className="glass-surface p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/3">
        <ClubCrest clubId={homeTeam.id} className="w-12 h-12" />
        <h2 className="text-2xl font-display font-bold text-text-emphasis">{homeTeam.name}</h2>
      </div>
      
      <div className="text-center">
        <p className="text-5xl font-display font-black text-text-emphasis">{homeScore} - {awayScore}</p>
        <p className="text-lg text-accent font-semibold" style={{textShadow: '0 0 5px var(--color-accent)'}}>{time}'</p>
      </div>

      <div className="flex items-center gap-4 w-1/3 justify-end">
        <h2 className="text-2xl font-display font-bold text-text-emphasis">{awayTeam.name}</h2>
        <ClubCrest clubId={awayTeam.id} className="w-12 h-12" />
      </div>
    </div>
  );
};

export default Scoreboard;