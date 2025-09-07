import React from 'react';

const libraries = [
    { name: 'React', license: 'MIT License', link: 'https://github.com/facebook/react' },
    { name: 'Gemini API', license: 'Google Cloud Platform Terms of Service', link: 'https://cloud.google.com/terms' },
    { name: 'DiceBear (Inspiration)', license: 'Code: MIT, Styles: Varies (e.g., CC BY 4.0)', link: 'https://www.dicebear.com/licenses/', note: 'Procedural avatars inspired by DiceBear. All styles used in-game are original creations.' },
    { name: 'jsfxr (Inspiration)', license: 'Unlicense (Public Domain)', link: 'https://sfxr.me/', note: 'Procedural sound effects are inspired by the algorithms of sfxr.' },
    { name: 'rot.js (Inspiration)', license: 'BSD 3-Clause License', link: 'https://github.com/ondras/rot.js', note: 'Future procedural map generation will be based on algorithms popularized by rot.js.' },
    { name: 'Tracery (Inspiration)', license: 'Apache License 2.0', link: 'https://github.com/galaxykate/tracery', note: 'Future procedural text generation will be based on concepts from Tracery.' },
];

const Legal: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Legal & Attributions</h1>
        <p className="text-md text-text-secondary">Aetherium Chronicle is built with and inspired by the following open-source software.</p>
      </div>

      <div className="glass-surface p-6">
        <div className="space-y-6">
          {libraries.map(lib => (
            <div key={lib.name} className="border-b border-border pb-4 last:border-b-0">
              <h2 className="text-xl font-bold text-accent">{lib.name}</h2>
              <p className="text-sm text-text-primary"><strong>License:</strong> {lib.license}</p>
              {lib.note && <p className="text-sm text-text-secondary mt-1"><em>{lib.note}</em></p>}
              <a href={lib.link} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-1 inline-block">
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legal;
