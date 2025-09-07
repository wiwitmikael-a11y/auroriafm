import React from 'react';

interface RadarChartProps {
  data: { name: string; value: number }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size * 0.35;
  const numSides = data.length;
  const angleSlice = (Math.PI * 2) / numSides;

  const points = data.map((item, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    // Multiply attribute value (1-20) by 5 to fit 0-100 scale of chart
    const valueRadius = (item.value * 5 / 100) * radius;
    const x = center + valueRadius * Math.cos(angle);
    const y = center + valueRadius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const axes = data.map((item, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x1 = center;
    const y1 = center;
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    const labelX = center + (radius + 18) * Math.cos(angle);
    const labelY = center + (radius + 18) * Math.sin(angle);
    return {
      line: { x1, y1, x2, y2 },
      label: { x: labelX, y: labelY, text: item.name }
    };
  });
  
  const levels = [0.25, 0.5, 0.75, 1.0];
  const levelPolygons = levels.map(level => {
      return Array.from({ length: numSides }).map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const r = radius * level;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return `${x},${y}`;
      }).join(' ');
  }).reverse();


  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {levelPolygons.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke="var(--color-border)" strokeWidth="1" />
      ))}
      {axes.map((axis, i) => (
        <line key={i} {...axis.line} stroke="var(--color-border)" strokeWidth="1" />
      ))}
      <polygon points={points} fill="rgba(0, 246, 255, 0.3)" stroke="var(--color-accent)" strokeWidth="2" />
      {data.map((item, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const valueRadius = (item.value * 5 / 100) * radius;
          const x = center + valueRadius * Math.cos(angle);
          const y = center + valueRadius * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r="3" fill="var(--color-accent)" />
      })}
      {axes.map((axis, i) => (
        <text
          key={i}
          x={axis.label.x}
          y={axis.label.y}
          fontSize="11"
          fontWeight="bold"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-display)"
        >
          {axis.label.text}
        </text>
      ))}
    </svg>
  );
};

export default RadarChart;