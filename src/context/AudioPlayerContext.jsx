import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const CDN_BASE = 'https://pub-3614ca84d95f46bab013d5e01081b5ea.r2.dev';

function buildCdnUrl(path){
  return `${CDN_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

function buildPatternTracks({ basePattern, count, ext='mp3', displayBase, artist='prxdby4le'}) {
  const safe = displayBase || basePattern.replace(/'s$/i,'');
  const tracks=[];
  for(let i=1;i<=count;i++){
    const filename = `${basePattern} (${i}).${ext}`;
    tracks.push({
      id: `${basePattern}-${i}`,
      name: `${safe} ${i}`,
      artist,
      url: buildCdnUrl(filename),
      duration: '0:00'
    });
  }
  return tracks;
}

const AudioPlayerContext = createContext(null);
export const useAudioPlayer = () => useContext(AudioPlayerContext);

export function AudioPlayerProvider({ children }) {
  const [manifest, setManifest] = useState(null);
  const [playlists, setPlaylists] = useState({});
  const [currentPlaylistName, setCurrentPlaylistName] = useState(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durations, setDurations] = useState({}); // key: playlist:trackIndex -> mm:ss
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  // load manifest
  useEffect(()=>{
    fetch('manifest.json', {cache:'no-cache'})
      .then(r=>r.ok?r.json():Promise.reject('manifest fail'))
      .then(data=>{
        setManifest(data);
        const built={};
        Object.entries(data.playlists||{}).forEach(([name,cfg])=>{
          if(cfg.pattern){
            built[name]={ genre: cfg.genre||name, tracks: buildPatternTracks(cfg.pattern)};
          } else if (cfg.files){
            built[name]={ genre: cfg.genre||name, tracks: cfg.files.map((f,i)=>({
              id:`${name}-${i}`,
              name: (name==='Ambient'?`Ambient ${i+1}`: cfg.files.length>1? `${name} ${i+1}`: name),
              artist:'prxdby4le',
              url: buildCdnUrl(f),
              duration:'0:00'
            }))};
          }
        });
        setPlaylists(built);
      })
      .catch(err=>console.error('[manifest]',err));
  },[]);

  // init audio element
  useEffect(()=>{
    const el = new Audio();
    el.preload='metadata';
    el.volume=volume;
    const onEnded=()=>next();
    const onError=()=>{ console.warn('audio error'); next(); };
    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError);
    audioRef.current = el;
    return ()=>{ el.pause(); el.removeEventListener('ended', onEnded); el.removeEventListener('error', onError); };
  },[]);

  // apply volume
  useEffect(()=>{ if(audioRef.current) audioRef.current.volume=volume; },[volume]);

  const loadCurrent = useCallback(()=>{
    if(!audioRef.current || !currentPlaylistName) return;
    const list = playlists[currentPlaylistName];
    if(!list) return;
    const track = list.tracks[trackIndex];
    if(!track) return;
    audioRef.current.src = track.url;
    audioRef.current.load();
    const play = ()=>{ audioRef.current.play().then(()=>setIsPlaying(true)).catch(()=>{}); };
    if(audioRef.current.readyState>=2) play(); else audioRef.current.addEventListener('canplay', play, {once:true});
  },[currentPlaylistName, trackIndex, playlists]);

  useEffect(()=>{ loadCurrent(); },[loadCurrent]);

  const openPlaylist = (name)=>{
    setCurrentPlaylistName(name);
    setTrackIndex(0);
  };
  const playPause = ()=>{
    if(!audioRef.current) return;
    if(isPlaying){ audioRef.current.pause(); setIsPlaying(false);} else { audioRef.current.play().then(()=>setIsPlaying(true)); }
  };
  const next = ()=>{
    if(!currentPlaylistName) return;
    const list = playlists[currentPlaylistName];
    if(!list) return;
    setTrackIndex(i=> (i+1)%list.tracks.length);
  };
  const prev = ()=>{
    if(!currentPlaylistName) return;
    const list = playlists[currentPlaylistName];
    if(!list) return;
    setTrackIndex(i=> (i-1+list.tracks.length)%list.tracks.length);
  };

  // Capture duration on metadata load
  useEffect(()=>{
    const el = audioRef.current;
    if(!el) return;
    const handler = () => {
      if(!currentPlaylistName) return;
      const d = el.duration;
      if(isFinite(d) && !isNaN(d)){
        const mm = Math.floor(d/60);
        const ss = Math.floor(d%60).toString().padStart(2,'0');
        const key = `${currentPlaylistName}:${trackIndex}`;
        setDurations(prev=> prev[key] ? prev : ({...prev, [key]: `${mm}:${ss}`}));
      }
    };
    el.addEventListener('loadedmetadata', handler);
    return ()=> el.removeEventListener('loadedmetadata', handler);
  },[currentPlaylistName, trackIndex]);

  // decorate playlists with durations
  const decoratedPlaylists = React.useMemo(()=>{
    return Object.fromEntries(Object.entries(playlists).map(([name,pl])=> {
      const tracks = pl.tracks.map((t,i)=>{
        const key = `${name}:${i}`;
        return durations[key] ? {...t, duration: durations[key]} : t;
      });
      return [name,{...pl, tracks}];
    }));
  },[playlists,durations]);

  const value = {
    manifest, playlists: decoratedPlaylists, currentPlaylistName, trackIndex, isPlaying, volume,
    setVolume, openPlaylist, playPause, next, prev, setTrackIndex,
    currentTrack: currentPlaylistName ? decoratedPlaylists[currentPlaylistName]?.tracks[trackIndex] : null
  };
  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}
