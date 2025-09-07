import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useWorld } from '../contexts/WorldContext';
import Scoreboard from '../components/Scoreboard';
import MatchPitch from '../components/MatchPitch';
import CommentaryFeed from '../components/CommentaryFeed';
import { MatchEvent, Club } from '../types';
import { liveMatchEngine } from '../engine/liveMatchEngine';
import { useNavigate } from 'react-router-dom';
import { commentaryService } from '../services/commentaryService';

const Match: React.FC = () => {
    const { liveMatch, finishLiveMatch, findClubById, players } = useWorld();
    const navigate = useNavigate();

    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [visibleEvents, setVisibleEvents] = useState<MatchEvent[]>([]);
    const [time, setTime] = useState(0);
    const [matchFinished, setMatchFinished] = useState(false);
    const [matchStarted, setMatchStarted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const homeTeam = useMemo(() => liveMatch ? findClubById(liveMatch.home_team_id) : null, [liveMatch, findClubById]);
    const awayTeam = useMemo(() => liveMatch ? findClubById(liveMatch.away_team_id) : null, [liveMatch, findClubById]);

    useEffect(() => {
        const generateInitialCommentary = () => {
            if (!homeTeam || !awayTeam) return;
            const kickoffCommentary = commentaryService.generateCommentary({
                type: 'Kickoff',
                minute: 0,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                homeScore: 0,
                awayScore: 0,
                actingTeam: 'home',
            });
            setVisibleEvents([{
                minute: 0,
                type: 'Commentary',
                team: 'none',
                description: kickoffCommentary
            }]);
        }

        if (liveMatch && homeTeam && awayTeam) {
            liveMatchEngine.initialize(liveMatch, players, homeTeam, awayTeam);
            generateInitialCommentary();
        }
    }, [liveMatch, homeTeam, awayTeam, players]);
    
    const handleNextHighlight = useCallback(() => {
        if (isGenerating || !homeTeam || !awayTeam) return;

        if (!matchStarted) setMatchStarted(true);
        setIsGenerating(true);

        // Add a small delay for better UX, making the simulation feel less instant.
        setTimeout(() => {
            const { newTime, newEvents, matchOver } = liveMatchEngine.simulateNextChunk();
            
            setTime(newTime);

            let newHomeScore = homeScore;
            let newAwayScore = awayScore;
            newEvents.forEach(event => {
                if (event.type === 'Goal') {
                    if (event.team === 'home') newHomeScore++;
                    if (event.team === 'away') newAwayScore++;
                }
            });
            setHomeScore(newHomeScore);
            setAwayScore(newAwayScore);
            
            if (matchOver) {
                setMatchFinished(true);
                const ftCommentary = commentaryService.generateCommentary({
                    type: 'FullTime',
                    minute: newTime,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    homeScore: newHomeScore,
                    awayScore: newAwayScore,
                    actingTeam: 'home'
                });
                newEvents.push({ minute: newTime, type: 'Commentary', team: 'none', description: ftCommentary });
            }

            setVisibleEvents(prev => [...prev, ...newEvents].sort((a, b) => a.minute - b.minute));
            setIsGenerating(false);
        }, 300); // 300ms delay
    }, [matchStarted, isGenerating, homeTeam, awayTeam, homeScore, awayScore]);

    const handleFinishMatch = () => {
        if (!liveMatch) return;
        const result = {
            day: liveMatch.day,
            home_team_id: liveMatch.home_team_id,
            away_team_id: liveMatch.away_team_id,
            home_score: homeScore,
            away_score: awayScore,
            events: visibleEvents,
        };
        finishLiveMatch(result);
        navigate('/dashboard'); // Navigate away after finishing
    };
    
    if (!liveMatch || !homeTeam || !awayTeam) {
        return (
            <div className="h-full flex items-center justify-center glass-surface">
                <p>No active match. Loading...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4 animate-fade-in">
            <div className="flex-shrink-0">
                <Scoreboard homeTeam={homeTeam} awayTeam={awayTeam} homeScore={homeScore} awayScore={awayScore} time={time} />
            </div>
            <div className="flex-grow flex gap-4 min-h-0">
                <div className="w-2/3 flex flex-col gap-4">
                    <MatchPitch />
                    <div className="flex-shrink-0 glass-surface p-2 text-center">
                        {matchFinished ? (
                            <button onClick={handleFinishMatch} className="button-primary w-1/3">
                                Finish Match
                            </button>
                        ) : (
                            <button onClick={handleNextHighlight} className="button-primary w-1/3" disabled={isGenerating}>
                                {isGenerating ? 'Simulating...' : matchStarted ? 'Next Highlight' : 'Kick Off'}
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-1/3">
                    <CommentaryFeed events={visibleEvents} />
                </div>
            </div>
        </div>
    );
};

export default Match;