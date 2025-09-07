import React from 'react';
import Scoreboard from '../components/Scoreboard';
import MatchPitch from '../components/MatchPitch';
import CommentaryFeed from '../components/CommentaryFeed';
import { MATCH_EVENTS } from '../data/matchEvents';
import { CLUBS } from '../data/clubs';

const Match: React.FC = () => {
    // Using mock data for demonstration
    const homeTeam = CLUBS.find(c => c.id === 'avalon_albion');
    const awayTeam = CLUBS.find(c => c.id === 'gearhaven_utd');
    
    if (!homeTeam || !awayTeam) return null;

  return (
    <div className="h-full flex flex-col">
        <div className="mb-4">
            <Scoreboard 
                homeTeam={homeTeam} 
                awayTeam={awayTeam} 
                homeScore={1}
                awayScore={1}
                time={90}
            />
        </div>
        <div className="flex-grow grid grid-cols-3 gap-4 min-h-0">
            <div className="col-span-2">
                <MatchPitch />
            </div>
            <div className="col-span-1">
                <CommentaryFeed events={MATCH_EVENTS} />
            </div>
        </div>
    </div>
  );
};

export default Match;