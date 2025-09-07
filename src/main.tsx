import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WorldProvider } from './contexts/WorldContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CrestProvider } from './contexts/CrestContext';
import { PortraitProvider } from './contexts/PortraitContext';
import './index.css';

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