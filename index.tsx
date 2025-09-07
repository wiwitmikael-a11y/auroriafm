import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { WorldProvider } from './src/contexts/WorldContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './src/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WorldProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </WorldProvider>
  </React.StrictMode>
);