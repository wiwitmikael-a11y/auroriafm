import React from 'react';

const MatchPitch: React.FC = () => {
    return (
        <div
          className="relative w-full h-full glass-surface overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(var(--color-accent) 1px, transparent 1px),
              radial-gradient(var(--color-accent) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            boxShadow: 'inset 0 0 40px rgba(0, 246, 255, 0.3)',
          }}
        >
          {/* Center Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-accent/50" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] aspect-square border-2 border-accent/50 rounded-full" />
          {/* Goal Boxes */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[15%] h-[40%] border-2 border-accent/50 rounded-lg" />
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[15%] h-[40%] border-2 border-accent/50 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/30 font-display text-2xl tracking-widest uppercase">Match in Progress</p>
          </div>
        </div>
      );
};

export default MatchPitch;