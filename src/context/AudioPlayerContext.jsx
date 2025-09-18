import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Contexto simples para disponibilizar playlists e ação de abrir playlist.
// Mantido leve apenas para alimentar a UI de MusicSection.

const AudioPlayerContext = createContext({
	playlists: {},
	current: null,
	openPlaylist: () => {},
	closePlaylist: () => {},
});

const demoPlaylists = {
	"LoFi Tapes": {
		tracks: [
			{ title: 'Night Drive', duration: 152 },
			{ title: 'Dusty Memories', duration: 188 },
			{ title: 'Analog Warmth', duration: 201 },
		]
	},
	"Synth Experiments": {
		tracks: [
			{ title: 'Neon Bloom', duration: 174 },
			{ title: 'Circuit Pulse', duration: 163 },
		]
	},
	"Drum Sketches": {
		tracks: [
			{ title: 'Break Study 01', duration: 92 },
			{ title: 'Break Study 02', duration: 104 },
			{ title: 'Break Study 03', duration: 87 },
			{ title: 'Break Study 04', duration: 110 },
		]
	},
	"Ambient Layers": {
		tracks: [
			{ title: 'Cloud Drift', duration: 242 },
			{ title: 'Frozen Echo', duration: 221 },
		]
	}
};

export function AudioPlayerProvider({ children }) {
	const [playlists] = useState(demoPlaylists); // estático por enquanto
	const [current, setCurrent] = useState(null);

	const openPlaylist = useCallback((name) => {
		if (!playlists[name]) return;
		setCurrent(name);
		// Futuro: abrir modal/player detalhado
		// console.log('Abrindo playlist', name);
	}, [playlists]);

	const closePlaylist = useCallback(() => setCurrent(null), []);

	const value = useMemo(() => ({ playlists, current, openPlaylist, closePlaylist }), [playlists, current, openPlaylist, closePlaylist]);

	return (
		<AudioPlayerContext.Provider value={value}>
			{children}
		</AudioPlayerContext.Provider>
	);
}

export function useAudioPlayer(){
	return useContext(AudioPlayerContext);
}

export default AudioPlayerContext;
