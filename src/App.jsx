import React from 'react';
import { AudioPlayerProvider } from './context/AudioPlayerContext.jsx';
import AppLayout from './components/AppLayout.jsx';

export function App(){
  return (
    <AudioPlayerProvider>
      <AppLayout />
    </AudioPlayerProvider>
  );
}

export default App;
