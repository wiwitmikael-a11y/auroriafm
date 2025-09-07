import React from 'react';
import { NATIONS } from '../data/nations';

interface NationFlagProps {
  nationId: string;
  className?: string;
}

const NationFlag: React.FC<NationFlagProps> = ({ nationId, className = "w-6 h-6" }) => {
  const nation = NATIONS.find(n => n.id === nationId);
  if (!nation) {
    return <div className={`${className} bg-gray-500 rounded-sm`} title="Unknown Nation" />;
  }

  // Simple procedural flag based on nation ID. Could be replaced with actual images.
  const flagStyle = (id: string): React.CSSProperties => {
    switch (id) {
      case 'avalon':
        return { background: 'linear-gradient(to bottom, #0A5C36 50%, #F0E68C 50%)' };
      case 'gearhaven':
        return { background: 'linear-gradient(to right, #808080 50%, #DAA520 50%)' };
      case 'arcadia':
        return { background: 'radial-gradient(circle, #00BFFF 30%, #483D8B 30%)' };
      case 'grimmr':
        return { background: 'linear-gradient(45deg, #B22222 50%, #1c1c1c 50%)' };
      default:
        return { background: '#333' };
    }
  };

  return <div className={`${className} rounded-sm border border-black/20`} style={flagStyle(nationId)} title={nation.name} />;
};

export default NationFlag;