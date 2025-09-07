import React, { useState } from 'react';
import { useWorld } from '../contexts/WorldContext';

interface PromptGeneratorModalProps {
  onClose: () => void;
}

const PromptGeneratorModal: React.FC<PromptGeneratorModalProps> = ({ onClose }) => {
  const { addPlayerFromPrompt } = useWorld();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    // Add a small delay to give a sense of processing
    setTimeout(() => {
        addPlayerFromPrompt(prompt);
        setIsLoading(false);
        onClose();
    }, 500);
  };

  const placeholderPrompts = [
    "A knight with spiky blonde hair and steel plate armor",
    "A rogue wearing a red bandana and a green vest",
    "A warrior with long brown hair and heavy steel greaves"
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="glass-surface p-6">
          <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-display font-bold text-text-emphasis">Generate Player from Prompt</h2>
                <p className="text-text-secondary text-sm">Describe the player you want to create.</p>
            </div>
            <button onClick={onClose} className="modal-close-button -mt-2 -mr-2" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="my-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`e.g., "${placeholderPrompts[0]}"`}
              className="w-full h-24 p-3 rounded-lg bg-slate-900/50 border border-border focus:border-accent focus:outline-none transition-colors"
            />
            <div className="text-xs text-text-secondary mt-2">
                <p><span className="font-bold">Keywords to try:</span></p>
                <p><span className="font-bold">Appearance:</span> spiky/long hair, blonde/brown, bandana</p>
                <p><span className="font-bold">Armor:</span> vest, plate, armor, steel, greaves, trousers</p>
                <p><span className="font-bold">Archetype:</span> knight, warrior, rogue, commoner</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="button-primary"
            >
              {isLoading ? 'Generating...' : 'Generate Character'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGeneratorModal;
