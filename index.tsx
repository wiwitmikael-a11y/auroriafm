import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { WorldProvider } from './src/contexts/WorldContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CrestProvider } from './src/contexts/CrestContext';
import { PortraitProvider } from './src/contexts/PortraitContext';
import './src/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WorldProvider>
      <CrestProvider>
        <PortraitProvider>
          <DndProvider backend={HTML5Backend}>
            <App />
          </DndProvider>
        </PortraitProvider>
      </CrestProvider>
    </WorldProvider>
  </React.StrictMode>
);
