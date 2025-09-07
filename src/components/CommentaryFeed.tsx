import React from 'react';
import { MatchEvent } from '../types';

interface CommentaryFeedProps {
  events: MatchEvent[];
}

const CommentaryFeed: React.FC<CommentaryFeedProps> = ({ events }) => {
  const getIconForEvent = (type: MatchEvent['type']) => {
    switch (type) {
      case 'Goal': return '⚽';
      case 'Chance': return '🎯';
      case 'Card': return '🟨';
      case 'Sub': return '🔄';
      default: return '🎙️';
    }
  };

  return (
    <div className="glass-surface h-full p-4 flex flex-col">
      <h3 className="text-xl font-display font-bold text-text-emphasis mb-4 flex-shrink-0">Match Commentary</h3>
      <div className="flex-grow overflow-y-auto space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex gap-3 text-sm">
            <div className="w-12 text-center flex-shrink-0">
              <p className="font-bold text-accent">{event.minute}'</p>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-text-primary">
                <span className="mr-2">{getIconForEvent(event.type)}</span>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentaryFeed;