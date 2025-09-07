import React from 'react';

interface StarRatingProps {
  currentAbility: number;
  potentialAbility: number;
}

// SVG path for a star
const starPath = "M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218z";

const Star: React.FC<{ color: string; offset?: string; id: string }> = ({ color, offset, id }) => (
  <svg width="16" height="16" viewBox="-1 -1 21 21" fill={color}>
    {offset && (
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect x="0" y="0" width={offset} height="19" />
        </clipPath>
      </defs>
    )}
    <path d={starPath} clipPath={offset ? `url(#clip-${id})` : undefined} />
  </svg>
);


const StarRating: React.FC<StarRatingProps> = ({ currentAbility, potentialAbility }) => {
  // Convert 1-200 ability score to a 0-10 half-star rating
  const caHalfStars = potentialAbility === 0 ? 0 : Math.max(1, Math.min(10, Math.floor((currentAbility - 1) / 20) + 1));
  const paHalfStars = potentialAbility === 0 ? 0 : Math.max(1, Math.min(10, Math.floor((potentialAbility - 1) / 20) + 1));

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fullStarIndex = i * 2;
    const halfStarIndex = fullStarIndex - 1;

    let caFill = '#374151'; // Base empty color
    let paFill = '#374151';
    let caOffset = '0';
    let paOffset = '0';

    // Potential Ability stars (Gray)
    if (paHalfStars >= fullStarIndex) {
        paFill = '#6b7280';
        paOffset = '19';
    } else if (paHalfStars >= halfStarIndex) {
        paFill = '#6b7280';
        paOffset = '9.5';
    }

    // Current Ability stars (Gold)
     if (caHalfStars >= fullStarIndex) {
        caFill = '#f59e0b';
        caOffset = '19';
    } else if (caHalfStars >= halfStarIndex) {
        caFill = '#f59e0b';
        caOffset = '9.5';
    }
    
    stars.push(
      <div key={i} className="relative">
        <Star color={paFill} offset={paOffset} id={`pa-${i}`} />
        <div className="absolute top-0 left-0">
          <Star color={caFill} offset={caOffset} id={`ca-${i}`} />
        </div>
      </div>
    );
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

export default StarRating;
