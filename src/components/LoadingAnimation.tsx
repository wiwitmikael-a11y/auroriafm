import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="w-64 h-24 relative mb-4">
      {/* Player 1 */}
      <div className="loading-player player-left">
        <div className="player-head"></div>
        <div className="player-body"></div>
      </div>
      
      {/* Ball */}
      <div className="loading-ball"></div>

      {/* Player 2 */}
      <div className="loading-player player-right">
        <div className="player-head"></div>
        <div className="player-body"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
