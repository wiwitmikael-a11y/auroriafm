import React, { useState, useEffect } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { assetManager } from '../services/assetManager';

const ManagerCat: React.FC = () => {
  const { managerName } = useWorld();
  const [catUrl, setCatUrl] = useState('');
  const [isPurring, setIsPurring] = useState(false);

  useEffect(() => {
    if (managerName) {
      const url = assetManager.generateManagerCat(managerName);
      setCatUrl(url);
    }
  }, [managerName]);

  const handleClick = () => {
    setIsPurring(true);
    // Remove the animation class after it finishes so it can be re-triggered
    setTimeout(() => {
      setIsPurring(false);
    }, 500);
  };

  if (!catUrl) {
    return null; // Don't render if the URL isn't ready
  }

  return (
    <img
      src={catUrl}
      alt="Your loyal manager cat"
      title="A good kitty"
      className={`manager-cat ${isPurring ? 'purr-animation' : ''}`}
      onClick={handleClick}
    />
  );
};

export default ManagerCat;
