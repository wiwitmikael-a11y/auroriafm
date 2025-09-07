import React, { useState, useEffect, useMemo } from 'react';
import { useWorld } from '../contexts/WorldContext';
import Scoreboard from '../components/Scoreboard';
import MatchPitch from '../components/MatchPitch';
import CommentaryFeed from '../components/CommentaryFeed';
import { MATCH_EVENTS } from '../data/matchEvents';
import { MatchEvent } from '../types';

const Match: React.FC = () => {
    const { findClubById, managerClubId } = useWorld();
    const [time, setTime] = useState(0);
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [visibleEvents, setVisibleEvents] = useState<MatchEvent[]>([]);

    // For demonstration, we'll use the manager's club vs. a rival
    const homeTeam = useMemo(() => findClubById(managerClubId), [findClubById, managerClubId]);
    const awayTeam = useMemo(() => findClubById('gearhaven_utd'), [findClubById]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime + 1;
                if (newTime > 90) {
                    clearInterval(interval);
                    return 90;
                }

                const newEvents = MATCH_EVENTS.filter(event => event.minute === newTime);
                if (newEvents.length > 0) {
                    setVisibleEvents(prevEvents => [...prevEvents, ...newEvents].sort((a, b) => a.minute - b.minute));
                    newEvents.forEach(event => {
                        if (event.type === 'Goal') {
                            if (event.team === 'home') setHomeScore(s => s + 1);
                            if (event.team === 'away') setAwayScore(s => s + 1);
                        }
                    });
                }
                
                return newTime;
            });
        }, 200); // 200ms per minute for a quick match

        return () => clearInterval(interval);
    }, []);
    
    if (!homeTeam || !awayTeam) return <div>Loading teams...</div>;

    return (
        <div className="h-full flex flex-col gap-4 animate-fade-in">
            <div className="flex-shrink-0">
                <Scoreboard homeTeam={homeTeam} awayTeam={awayTeam} homeScore={homeScore} awayScore={awayScore} time={time} />
            </div>
            <div className="flex-grow flex gap-4 min-h-0">
                <div className="w-2/3">
                    <MatchPitch />
                </div>
                <div className="w-1/3">
                    <CommentaryFeed events={visibleEvents} />
                </div>
            </div>
        </div>
    );
};

export default Match;
