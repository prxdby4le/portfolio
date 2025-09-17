// Global Variables (CDN simplified)
let currentSection = 'home';
let backgroundAnimation;
// Base CDN (atualize com seu domínio Cloudflare/R2)
// Base pública Cloudflare R2 (namespace plano, sem subpastas)
const CDN_BASE = 'https://pub-3614ca84d95f46bab013d5e01081b5ea.r2.dev';
function buildCdnUrl(path) { return `${CDN_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`; }

// DOM Elements
const heroSection = document.querySelector('.hero-section');
const musicSection = document.getElementById('music-section');
const visualSection = document.getElementById('visual-section');
// videoSection removido
const aboutSection = document.getElementById('about');
const contactSection = document.getElementById('contact');
const backgroundCanvas = document.getElementById('background-canvas');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Initialize intro animations immediately
    initIntroAnimations();
    setupEventListeners();
    initBackgroundAnimation();
    
    // Start entrance animations directly
    setTimeout(() => {
        triggerEntranceAnimations();
    }, 300);
    
    // Setup project buttons
    setTimeout(() => {
        setupProjectButtons();
    }, 500);
});

// Open correct section on initial load if URL contains a hash (GitHub Pages friendly)
document.addEventListener('DOMContentLoaded', function() {
    const hash = (window.location.hash || '').replace(/^#/, '');
    const validSections = new Set(['home', 'music', 'visual', 'about', 'contact']);
    if (hash && validSections.has(hash)) {
        showSection(hash);
    }
});

// Keep UI in sync when the hash changes (e.g., manual URL change or external link)
window.addEventListener('hashchange', function() {
    const section = (window.location.hash || '').replace(/^#/, '') || 'home';
    showSection(section);
});

// Initialize intro state immediately
function initIntroAnimations() {
    const nav = document.querySelector('.main-nav');
    const heroContent = document.querySelector('.hero-content');
    const cards = document.querySelectorAll('.portfolio-card');
    
    // Set initial hidden states
    nav.style.transform = 'translateY(-100%)';
    nav.style.opacity = '0';
    
    heroContent.style.transform = 'scale(0.9) translateY(30px)';
    heroContent.style.opacity = '0';
    
    cards.forEach(card => {
        card.style.transform = 'translateY(60px) rotateX(15deg)';
        card.style.opacity = '0';
    });
}

// Hide Loading Screen

    console.log('[portfolio] Modo CDN ativo. Ajuste playlistData com URLs reais.');
// Cinematic entrance animations
function triggerEntranceAnimations() {
    const nav = document.querySelector('.main-nav');
    const heroContent = document.querySelector('.hero-content');
    
    // Navigation slide down
    nav.style.transform = 'translateY(-100%)';
    nav.style.opacity = '0';
    
    setTimeout(() => {
        nav.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
    }, 300);
    
    // Hero content fade in with scale
    heroContent.style.transform = 'scale(0.9) translateY(30px)';
    heroContent.style.opacity = '0';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        heroContent.style.transform = 'scale(1) translateY(0)';
        heroContent.style.opacity = '1';
    }, 800);
    
    // Portfolio cards staggered entrance
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach((card, index) => {
        card.style.transform = 'translateY(60px) rotateX(15deg)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateY(0) rotateX(0deg)';
            card.style.opacity = '1';
        }, 1200 + (index * 300));
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Portfolio navigation buttons
    const musicBtn = document.querySelector('[data-portfolio="music"]');
    const visualBtn = document.querySelector('[data-portfolio="visual"]');
    // videoBtn removido
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Portfolio buttons
    musicBtn.addEventListener('click', () => showSection('music'));
    visualBtn.addEventListener('click', () => showSection('visual'));
    // videoBtn removido
    
    // Back buttons
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => showSection('home'));
    });
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            showSection(target);
        });
    });
    
    // Project interaction buttons
    setupProjectButtons();
    
    // Smooth scroll for portfolio cards
    setupCardAnimations();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Show Section with Cinematic Transitions
function showSection(section) {
    // Create cinematic transition overlay
    createTransitionOverlay();
    
    setTimeout(() => {
        // Hide all sections
    const sections = [heroSection, musicSection, visualSection, aboutSection, contactSection];
        sections.forEach(sec => sec.classList.add('hidden'));
        
        // Show target section with cinematic entrance
        switch(section) {
            case 'home':
                heroSection.classList.remove('hidden');
                currentSection = 'home';
                cinematicEntranceHome();
                break;
            case 'music':
                musicSection.classList.remove('hidden');
                currentSection = 'music';
                cinematicEntrancePortfolio('music');
                break;
            case 'visual':
                visualSection.classList.remove('hidden');
                currentSection = 'visual';
                cinematicEntrancePortfolio('visual');
                break;
            // case 'video': removido
            case 'about':
                aboutSection.classList.remove('hidden');
                currentSection = 'about';
                cinematicEntranceAbout();
                break;
            case 'contact':
                contactSection.classList.remove('hidden');
                currentSection = 'contact';
                cinematicEntranceContact();
                break;
        }
        
    // Update URL without page reload (use hash-only to work on GitHub Pages project paths)
    history.pushState({ section: section }, '', section === 'home' ? '#' : `#${section}`);
    }, 800);
}

// Create cinematic transition overlay
function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #0a0a0a, #1a1a2e, #0a0a0a);
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    document.body.appendChild(overlay);
    
    // Fade in overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);
    
    // Remove overlay after transition
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 800);
    }, 1600);
}

// Cinematic entrance animations for different sections
function cinematicEntranceHome() {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.transform = 'scale(0.8) translateY(50px)';
    heroContent.style.opacity = '0';
    heroContent.style.filter = 'blur(10px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        heroContent.style.transform = 'scale(1) translateY(0)';
        heroContent.style.opacity = '1';
        heroContent.style.filter = 'blur(0)';
    }, 300);
}

function cinematicEntrancePortfolio(type) {
    const header = document.querySelector('.portfolio-header');
    const projects = document.querySelectorAll('.project-item');
    
    // Header entrance
    header.style.transform = 'translateX(-100px)';
    header.style.opacity = '0';
    
    setTimeout(() => {
        header.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        header.style.transform = 'translateX(0)';
        header.style.opacity = '1';
    }, 200);
    
    // Projects staggered entrance
    projects.forEach((project, index) => {
        project.style.transform = 'translateY(80px) rotateX(20deg) scale(0.8)';
        project.style.opacity = '0';
        project.style.filter = 'blur(5px)';
        
        setTimeout(() => {
            project.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            project.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
            project.style.opacity = '1';
            project.style.filter = 'blur(0)';
        }, 500 + (index * 150));
    });
    
    // Reconfigure project buttons after animation
    setTimeout(() => {
        setupProjectButtons();
    }, 1000);
}

function cinematicEntranceAbout() {
    const aboutContent = document.querySelector('.about-content');
    aboutContent.style.transform = 'scale(0.9) translateY(40px)';
    aboutContent.style.opacity = '0';
    
    setTimeout(() => {
        aboutContent.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        aboutContent.style.transform = 'scale(1) translateY(0)';
        aboutContent.style.opacity = '1';
    }, 400);
}

function cinematicEntranceContact() {
    const contactContent = document.querySelector('.contact-content');
    contactContent.style.transform = 'scale(0.9) translateY(40px)';
    contactContent.style.opacity = '0';
    
    setTimeout(() => {
        contactContent.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        contactContent.style.transform = 'scale(1) translateY(0)';
        contactContent.style.opacity = '1';
    }, 400);
}

// Animate Projects In
function animateProjectsIn() {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Setup Project Buttons
function setupProjectButtons() {
    // Play buttons for music projects
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        // Remove existing event listeners by cloning the element
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectName = this.closest('.project-item').querySelector('h3').textContent;
            console.log('Play button clicked for:', projectName); // Debug log
            playAudio(projectName);
        });
    });
    
    // View buttons for visual projects
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectName = this.closest('.project-item').querySelector('h3').textContent;
            viewProject(projectName);
        });
    });
    
    // watch buttons removidos
}

// =========== HELPERS PARA PADRÃO "Nome's (n).mp3" EM NAMESPACE PLANO ===========
// Gera faixas numeradas a partir de um padrão base (ex: base="boombap's", gera "boombap's (1).mp3")
function buildPatternTracks({ basePattern, count, displayBase, artist = 'prxdby4le', ext = 'mp3' }) {
    const safeDisplay = displayBase || basePattern.replace(/'s$/i,'');
    const tracks = [];
    for (let i = 1; i <= count; i++) {
        const filename = `${basePattern} (${i}).${ext}`; // Ex: boombap's (1).mp3
        tracks.push({
            name: `${safeDisplay} ${i}`,
            artist,
            duration: '0:00', // ajuste depois se quiser a duração real
            url: buildCdnUrl(filename)
        });
    }
    return tracks;
}

// CONFIG: Ajuste os counts conforme a quantidade real de arquivos no bucket.
// Se depois você subir mais arquivos, só aumentar o número.
// =============== PLAYLISTS GERADAS POR PADRÃO (AJUSTADAS COM OS NÚMEROS ENVIADOS) ===============
// ATENÇÃO: BasePattern deve corresponder exatamente ao prefixo dos arquivos no bucket.
// Se algum nome abaixo estiver diferente dos arquivos reais, ajuste apenas a string basePattern.
// Exemplos esperados de arquivos: "boombap's (1).mp3", "DrumandBass's (10).mp3" etc.
// Assumido (precisa confirmar se o prefixo está correto): TrapUnder's, pluggnb's, ambient's, drumless's, otherrythms's
// Caso o seu naming real seja diferente (ex: "trapunderground's"), troque o basePattern correspondente.
// Base real observada nas capturas:
// boombap's (n).mp3, DrumandBass's (n).mp3, Trap's (n).mp3, Plugg's (n).mp3,
// Hoodtrap's (n).mp3, Drumless's (n).mp3, Other (n).mp3
// Ambient possui 2 arquivos: Ambient's (1).wav e Ambient's (2).mp3 (trataremos manual)
// ================= DYNAMIC MANIFEST LOADER =================
let playlistData = {}; // será preenchido dinamicamente
let manifestLoaded = false;

async function loadManifest() {
    if (manifestLoaded) return playlistData;
    try {
        const res = await fetch('manifest.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('Manifest fetch falhou');
        const manifest = await res.json();
        const base = manifest.cdnBase || CDN_BASE;
        const playlists = manifest.playlists || {};
        const built = {};
        Object.entries(playlists).forEach(([name, cfg]) => {
            if (cfg.pattern) {
                built[name] = {
                    genre: cfg.genre || name,
                    tracks: buildPatternTracks({ basePattern: cfg.pattern.basePattern, count: cfg.pattern.count, ext: cfg.pattern.ext || 'mp3' })
                };
            } else if (cfg.files) {
                built[name] = {
                    genre: cfg.genre || name,
                    tracks: cfg.files.map((f, i) => ({
                        name: (name === 'Ambient' ? 'Ambient ' + (i+1) : name + (cfg.files.length>1? ' ' + (i+1): '')),
                        artist: 'prxdby4le',
                        duration: '0:00',
                        // NÃO pré-encode espaços aqui; buildCdnUrl já aplica encodeURIComponent em cada segmento.
                        // O replace anterior causava "%2520" (dupla codificação) e quebrava somente as faixas manuais (ex: Ambient).
                        url: buildCdnUrl(f)
                    }))
                };
            }
        });
        playlistData = built;
        manifestLoaded = true;
        console.log('[manifest] carregado');
    } catch (e) {
        console.error('Erro carregando manifest:', e);
        showNotification('Falha ao carregar manifest.json – usando configuração vazia');
    }
    return playlistData;
}

// (Playlists agora 100% vindas do manifest.json)

// Playlist State
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer = null;
let currentVolume = 0.7;

// (Removido: funções de detecção buildAudioUrl / probeAudio)

// (Funções de detecção removidas - uso direto de URLs CDN)
function formatDurationFromSeconds(seconds) {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function updatePlaylistWithRealData(playlistName) {
    if (!manifestLoaded) await loadManifest();
    return playlistData[playlistName];
}

function createAudioPlayer() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer = null;
    }
    
    audioPlayer = new Audio();
    audioPlayer.volume = currentVolume;
    audioPlayer.preload = 'metadata';
    
    // Audio event listeners
    audioPlayer.addEventListener('loadedmetadata', () => {
        updateProgressBar();
    });
    
    audioPlayer.addEventListener('timeupdate', () => {
        updateProgressBar();
    });
    
    audioPlayer.addEventListener('ended', () => {
        nextTrack();
    });
    
    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e, 'src:', audioPlayer?.src);
        // Marca a faixa atual como quebrada para não tentar novamente nesta sessão
        if (currentPlaylist[currentTrackIndex] && !currentPlaylist[currentTrackIndex]._broken) {
            currentPlaylist[currentTrackIndex]._broken = true;
            const items = document.querySelectorAll('.track-item');
            const item = items[currentTrackIndex];
            if (item) {
                item.classList.add('broken');
                const dur = item.querySelector('.track-duration');
                if (dur) dur.textContent = 'ERR';
            }
        }
        showNotification('Erro ao carregar – pulando');
        // Evita loop infinito se todas quebradas
        const hasPlayable = currentPlaylist.some(t => !t._broken && t.url);
        if (!hasPlayable) {
            showNotification('Nenhuma faixa reproduzível nesta playlist');
            isPlaying = false;
            updateNowPlaying();
            return;
        }
        // Avança para próxima não quebrada
        setTimeout(() => {
            let attempts = 0;
            do {
                currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
                attempts++;
            } while (currentPlaylist[currentTrackIndex]._broken && attempts <= currentPlaylist.length);
            const trackOk = loadTrack(window.currentPlaylistName, currentTrackIndex);
            if (trackOk) ensurePlayback();
        }, 400);
    });
    
    audioPlayer.addEventListener('loadstart', () => {
        showNotification('Carregando música...');
    });
    
    audioPlayer.addEventListener('canplay', () => {
        console.log('Audio ready to play');
    });
    
    return audioPlayer;
}

// Captura durações reais assincronamente e atualiza UI
function captureDurations(playlistName, tracks) {
    tracks.forEach((t, idx) => {
        if (!t.url) return;
        const temp = document.createElement('audio');
        temp.preload = 'metadata';
        temp.src = t.url;
        temp.addEventListener('loadedmetadata', () => {
            const d = temp.duration;
            if (!isNaN(d) && d > 0) {
                t.duration = formatTime(d);
                const span = document.querySelector(`.track-duration[data-duration-index="${idx}"]`);
                if (span) span.textContent = t.duration;
                // Atualiza total no título se todas carregarem
                if (tracks.every(tr => tr.duration && tr.duration !== '0:00')) {
                    const totalSeconds = tracks.reduce((acc, tr) => {
                        const parts = tr.duration.split(':').map(Number); return acc + parts[0]*60 + parts[1];
                    },0);
                    const playlistTitle = document.getElementById('playlist-title');
                    if (playlistTitle) {
                        const base = playlistTitle.textContent.replace(/•.+$/, '').trim();
                        playlistTitle.textContent = `${base} • ${formatDurationFromSeconds(totalSeconds)}`;
                    }
                }
            }
        });
    });
}

// Injeta controle de volume (slider) se não existir
function ensureVolumeControl() {
    const controls = document.querySelector('.player-controls');
    if (!controls) return;
    if (document.getElementById('volume-slider')) return;
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '6px';
    wrap.style.marginLeft = '12px';
    wrap.innerHTML = `<span style="font-size:12px;color:#888;">VOL</span><input id="volume-slider" type="range" min="0" max="100" value="${Math.round(currentVolume*100)}" style="width:90px;">`;
    controls.parentNode.insertBefore(wrap, controls.nextSibling);
    const slider = wrap.querySelector('#volume-slider');
    slider.addEventListener('input', e => {
        currentVolume = slider.value/100;
        if (audioPlayer) audioPlayer.volume = currentVolume;
    });
}

function loadTrack(playlistName, trackIndex) {
    const playlist = playlistData[playlistName];
    if (!playlist || !playlist.tracks[trackIndex]) return false;
    const track = playlist.tracks[trackIndex];
    if (!track.url) return false;
    if (!audioPlayer) createAudioPlayer();
    audioPlayer.src = track.url;
    audioPlayer.load();
    return true;
}

// Garante reprodução (autoplay) assim que a mídia puder tocar
function ensurePlayback() {
    if (!audioPlayer) return;
    const attempt = () => {
        const promise = audioPlayer.play();
        if (promise && typeof promise.then === 'function') {
            promise.then(() => {
                isPlaying = true;
                updateNowPlaying();
            }).catch(err => {
                console.warn('Falha ao iniciar autoplay:', err);
                showNotification('Interação necessária para reproduzir (clique ▶)');
            });
        } else {
            isPlaying = true;
            updateNowPlaying();
        }
    };
    if (audioPlayer.readyState >= 2) {
        attempt();
    } else {
        audioPlayer.addEventListener('canplay', attempt, { once: true });
    }
}

function updateProgressBar() {
    if (!audioPlayer) return;
    
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (duration && !isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        
        // Update progress bar if it exists
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = progressPercent + '%';
        }
        
        // Update time display
        const currentTimeDisplay = document.querySelector('.current-time');
        const totalTimeDisplay = document.querySelector('.total-time');
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(currentTime);
        }
        if (totalTimeDisplay) {
            totalTimeDisplay.textContent = formatTime(duration);
        }
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Play Audio Function
function playAudio(projectName) {
    openPlaylist(projectName);
    showNotification(`Abrindo playlist: ${projectName}`);
}

// Open Playlist Modal
async function openPlaylist(projectName) {
    console.log('Opening playlist for:', projectName);
    const modal = document.getElementById('playlist-modal');
    const playlistTitle = document.getElementById('playlist-title');
    const playlistTracks = document.getElementById('playlist-tracks');
    
    // Get playlist data
    if (!manifestLoaded) await loadManifest();
    let playlist = playlistData[projectName];
    if (!playlist) {
        console.log('No playlist found for:', projectName);
        showNotification('Playlist não encontrada');
        return;
    }
    
    // Show modal first with loading state
    modal.classList.add('active');
    playlistTitle.textContent = `Carregando - ${playlist.genre}`;
    playlistTracks.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">Detectando músicas...</div>';
    
    // CDN mode: playlist já pronta
    playlist = await updatePlaylistWithRealData(projectName);
    
    // Store current playlist info globally
    window.currentPlaylistName = projectName;
    currentPlaylist = playlist.tracks;
    currentTrackIndex = 0;
    
    // Calculate total duration
    let totalDuration = '0:00';
    if (playlist.duration) {
        totalDuration = playlist.duration;
    } else {
        const totalSeconds = (playlist.tracks || []).reduce((total, track) => {
            if (!track || !track.duration) return total;
            const parts = String(track.duration).split(':').map(Number);
            if (parts.length !== 2 || parts.some(isNaN)) return total;
            return total + (parts[0] * 60 + parts[1]);
        }, 0);
        totalDuration = formatDurationFromSeconds(totalSeconds);
    }
    
    // Update title with track count and total duration
    const trackCount = playlist.totalTracks || playlist.tracks.length;
    playlistTitle.textContent = `${playlist.genre} (${trackCount} ${trackCount === 1 ? 'música' : 'músicas'} • ${totalDuration})`;
    
    // Generate tracks HTML
    // Generate tracks HTML (durations serão atualizadas após metadata)
    const tracksHTML = playlist.tracks.map((track, index) => `
        <div class="track-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <span class="track-number">${(index + 1).toString().padStart(2, '0')}</span>
            <div class="track-info">
                <h5>${track.name}</h5>
                <p>${track.artist}</p>
            </div>
            <span class="track-duration" data-duration-index="${index}">${track.duration}</span>
        </div>
    `).join('');
    
    playlistTracks.innerHTML = tracksHTML;
    
    // Load first track if available
    if (playlist.tracks && playlist.tracks.length > 0) {
        loadTrack(projectName, 0);
        updateNowPlaying();
        showNotification(`Playlist pronta: ${playlist.tracks.length} ${playlist.tracks.length === 1 ? 'música' : 'músicas'}`);
    // Autoplay primeira faixa ao abrir a playlist (solicitado)
    ensurePlayback();
    } else {
        playlistTracks.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">Nenhuma música encontrada nesta pasta</div>';
        showNotification('Nenhuma música encontrada na pasta');
    }
    
    // Add event listeners to tracks
    document.querySelectorAll('.track-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            selectTrack(index);
        });
    });
    ensureVolumeControl();
}

// Update Now Playing Display
function updateNowPlaying() {
    const currentTrack = document.getElementById('current-track');
    const currentArtist = document.getElementById('current-artist');
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (currentPlaylist.length > 0) {
        const track = currentPlaylist[currentTrackIndex];
        currentTrack.textContent = track.name;
        currentArtist.textContent = track.artist;
    }
    
    playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
    
    // Update play indicator visibility
    const playIndicator = document.querySelector('.play-indicator');
    if (playIndicator) {
        playIndicator.style.display = isPlaying ? 'flex' : 'none';
    }
}

// Select Track
function selectTrack(index) {
    if (index < 0 || index >= currentPlaylist.length) return;
    
    // Stop current track
    if (audioPlayer) {
        audioPlayer.pause();
    }
    
    currentTrackIndex = index;
    
    // Update active track visually
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Load new track
    if (window.currentPlaylistName) {
        loadTrack(window.currentPlaylistName, index);
    }
    
    // Update now playing display
    updateNowPlaying();
    
    // Sempre iniciar reprodução ao selecionar (autoplay solicitado)
    ensurePlayback();
}

// Toggle Play/Pause
function togglePlayPause() {
    if (!audioPlayer) {
        showNotification('Nenhuma música carregada');
        return;
    }
    
    if (isPlaying) {
        // Pause
        audioPlayer.pause();
        isPlaying = false;
        showNotification('Pausado');
    } else {
        // Play
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                showNotification(`Reproduzindo: ${currentPlaylist[currentTrackIndex].name}`);
            }).catch(error => {
                console.error('Error playing audio:', error);
                showNotification('Erro ao reproduzir música');
                isPlaying = false;
            });
        }
    }
    
    updateNowPlaying();
}

// Next Track
function nextTrack() {
    if (currentTrackIndex < currentPlaylist.length - 1) {
        selectTrack(currentTrackIndex + 1);
    } else {
        selectTrack(0); // Loop to first track
    }
    ensurePlayback();
}

// Previous Track
function prevTrack() {
    if (currentTrackIndex > 0) {
        selectTrack(currentTrackIndex - 1);
    } else {
        selectTrack(currentPlaylist.length - 1); // Loop to last track
    }
    ensurePlayback();
}

// Close Playlist
function closePlaylist() {
    const modal = document.getElementById('playlist-modal');
    modal.classList.remove('active');
    
    // Stop audio playback
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    
    isPlaying = false;
    updateNowPlaying();
}

// View Project Function
function viewProject(projectName) {
    // Create a modal or redirect to project page
    showNotification(`Abrindo: ${projectName}`);
    
    // Simulate opening project in a new tab
    setTimeout(() => {
        // window.open('#', '_blank');
        console.log(`Opening project: ${projectName}`);
    }, 500);
}

// funções de vídeo removidas

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 40px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border: 1px solid #333;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup Card Animations
function setupCardAnimations() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    switch(e.key) {
        case 'Escape':
            if (currentSection !== 'home') {
                showSection('home');
            }
            break;
        case '1':
            if (currentSection === 'home') {
                showSection('music');
            }
            break;
        case '2':
            if (currentSection === 'home') {
                showSection('visual');
            }
            break;
    // tecla '3' para vídeo removida
        case 'h':
            showSection('home');
            break;
        case 'a':
            showSection('about');
            break;
        case 'c':
            showSection('contact');
            break;
    }
}

// Enhanced Cinematic Background Animation
function initBackgroundAnimation() {
    const canvas = backgroundCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse tracking for cinematic effects
    document.addEventListener('mousemove', (e) => {
        // Calculate velocity
        mouse.velocity.x = e.clientX - mouse.lastX;
        mouse.velocity.y = e.clientY - mouse.lastY;
        
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isMoving = true;
        
        // Create mouse trail particles
        if (Math.abs(mouse.velocity.x) > 2 || Math.abs(mouse.velocity.y) > 2) {
            createMouseTrailParticle();
        }
        
        // Reset moving state after a delay
        clearTimeout(mouse.moveTimeout);
        mouse.moveTimeout = setTimeout(() => {
            mouse.isMoving = false;
        }, 100);
    });
    
    // Mouse click effects
    document.addEventListener('mousedown', (e) => {
        isMousePressed = true;
        createMouseClickEffect(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', () => {
        isMousePressed = false;
    });
    
    // Minimal particles array
    const particles = [];
    const particleCount = 12; // Very minimal
    const connectionDistance = 150;
    let mouse = { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2, 
        isMoving: false,
        lastX: 0,
        lastY: 0,
        velocity: { x: 0, y: 0 }
    };
    
    // Interactive mouse effects
    let mouseInfluenceRadius = 150;
    let mouseParticles = [];
    let isMousePressed = false;
    

    
    // Minimal Particle class
    class MinimalParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.1; // Very slow movement
            this.vy = (Math.random() - 0.5) * 0.1;
            this.size = Math.random() * 1 + 0.3; // Very small particles
            this.opacity = Math.random() * 0.2 + 0.05; // Very subtle
            this.originalOpacity = this.opacity;
            this.pulseSpeed = Math.random() * 0.005 + 0.002; // Very slow pulse
            this.pulse = Math.random() * Math.PI * 2;
            this.driftAngle = Math.random() * Math.PI * 2;
            this.driftSpeed = Math.random() * 0.0003 + 0.0001;
        }
        
        getColor() {
            return { r: 78, g: 205, b: 196 }; // Single minimal color
        }
        
        update() {
            // Minimal drift animation
            this.driftAngle += this.driftSpeed;
            const driftX = Math.sin(this.driftAngle) * 0.05;
            const driftY = Math.cos(this.driftAngle * 0.8) * 0.05;
            
            // Very subtle mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100 && mouse.isMoving) {
                const force = (100 - distance) / 100;
                this.opacity = Math.min(this.opacity + force * 0.1, 0.3);
            } else {
                this.opacity = Math.max(this.opacity - 0.005, this.originalOpacity);
            }
            
            // Apply minimal movement
            this.x += this.vx + driftX;
            this.y += this.vy + driftY;
            
            // Pulse effect
            this.pulse += this.pulseSpeed;
            
            // Screen wrapping
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        
        draw() {
            const color = this.getColor();
            const pulseEffect = Math.sin(this.pulse) * 0.1;
            const currentOpacity = this.opacity + pulseEffect * 0.05;
            
            // Single minimal dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity})`;
            ctx.fill();
        }
    }
    
    // Initialize minimal particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new MinimalParticle());
    }
    
    // Mouse Trail Particle Class
    class MouseTrailParticle {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx * 0.1;
            this.vy = vy * 0.1;
            this.size = Math.random() * 4 + 2;
            this.opacity = 1;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.02;
            this.color = {
                r: 78 + Math.random() * 50,
                g: 205 + Math.random() * 50,
                b: 196 + Math.random() * 50
            };
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.life -= this.decay;
            this.opacity = this.life;
            this.size *= 0.99;
        }
        
        draw() {
            if (this.life <= 0) return;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fill();
            
            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.3})`;
            ctx.fill();
        }
    }
    
    // Create mouse trail particle
    function createMouseTrailParticle() {
        if (mouseParticles.length > 15) { // Reduced max particles
            mouseParticles.shift();
        }
        
        const particle = new MouseTrailParticle(
            mouse.x + (Math.random() - 0.5) * 20,
            mouse.y + (Math.random() - 0.5) * 20,
            mouse.velocity.x,
            mouse.velocity.y
        );
        mouseParticles.push(particle);
    }
    
    // Minimal click effect
    function createMouseClickEffect(x, y) {
        // Only create a simple ripple
        createRippleEffect(x, y);
    }
    
    // Ripple Effect
    let ripples = [];
    
    function createRippleEffect(x, y) {
        ripples.push({
            x: x,
            y: y,
            radius: 0,
            opacity: 0.3,
            maxRadius: 50
        });
    }
    
    function updateRipples() {
        ripples = ripples.filter(ripple => {
            ripple.radius += 2;
            ripple.opacity = 0.3 * (1 - ripple.radius / ripple.maxRadius);
            
            if (ripple.opacity > 0) {
                // Single minimal ripple
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(78, 205, 196, ${ripple.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                return true;
            }
            return false;
        });
    }
    

    

    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw main particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update and draw mouse trail particles
        mouseParticles = mouseParticles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });
        
        // Draw connections
        drawConnections();
        
        // Update ripples
        updateRipples();
        
        requestAnimationFrame(animate);
    }
    

    
    // Minimal connections - only draw very few
    function drawConnections() {
        for (let i = 0; i < particles.length; i += 2) { // Skip every other particle
            for (let j = i + 2; j < particles.length; j += 2) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 0.05 * (1 - distance / connectionDistance);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(78, 205, 196, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Start animation
    animate();
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.section) {
        showSection(e.state.section);
    } else {
        showSection('home');
    }
});

// Enhanced mouse movement effect for cards
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.portfolio-card, .project-item');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const rotateX = deltaY * 8;
        const rotateY = deltaX * 8;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            // Enhanced 3D transform
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-15px) 
                scale(1.02)
            `;
            
            // Add dynamic glow effect
            const glowIntensity = Math.max(Math.abs(deltaX), Math.abs(deltaY));
            card.style.boxShadow = `
                0 25px 50px rgba(0, 0, 0, 0.4),
                0 0 ${30 + glowIntensity * 20}px rgba(78, 205, 196, ${0.2 + glowIntensity * 0.3}),
                inset 0 1px 0 rgba(255, 255, 255, ${0.1 + glowIntensity * 0.2})
            `;
            
            // Create light streak effect
            createLightStreak(card, deltaX, deltaY);
            
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
            card.style.boxShadow = '';
            removeLightStreak(card);
        }
    });
});

// Light streak effect functions
function createLightStreak(card, deltaX, deltaY) {
    let streak = card.querySelector('.light-streak');
    if (!streak) {
        streak = document.createElement('div');
        streak.className = 'light-streak';
        streak.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                ${Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90}deg,
                transparent 0%,
                rgba(255, 255, 255, 0.1) 45%,
                rgba(78, 205, 196, 0.2) 50%,
                rgba(255, 255, 255, 0.1) 55%,
                transparent 100%
            );
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        `;
        card.appendChild(streak);
    }
    
    streak.style.opacity = Math.max(Math.abs(deltaX), Math.abs(deltaY)) * 0.8;
    streak.style.background = `linear-gradient(
        ${Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90}deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 45%,
        rgba(78, 205, 196, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 55%,
        transparent 100%
    )`;
}

function removeLightStreak(card) {
    const streak = card.querySelector('.light-streak');
    if (streak) {
        streak.style.opacity = '0';
    }
}





// Smooth scrolling for project grid
function setupSmoothScrolling() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.project-item').forEach(item => {
        observer.observe(item);
    });
}

// Initialize smooth scrolling after DOM is loaded
document.addEventListener('DOMContentLoaded', setupSmoothScrolling);

// Magnetic effect for interactive elements
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.enter-btn, .play-btn, .view-btn, .back-btn');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

// Initialize magnetic effect
document.addEventListener('DOMContentLoaded', initMagneticEffect);

// Initialize Playlist Controls
document.addEventListener('DOMContentLoaded', function() {
    // Close playlist button
    document.getElementById('close-playlist').addEventListener('click', closePlaylist);
    
    // Player controls
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('next-btn').addEventListener('click', nextTrack);
    document.getElementById('prev-btn').addEventListener('click', prevTrack);
    
    // Close playlist when clicking outside
    document.getElementById('playlist-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePlaylist();
        }
    });
    
    // Progress bar click functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.progress-track')) {
            const progressTrack = e.target.closest('.progress-track');
            const rect = progressTrack.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progressPercent = clickX / rect.width;
            
            if (audioPlayer && audioPlayer.duration) {
                const newTime = progressPercent * audioPlayer.duration;
                audioPlayer.currentTime = newTime;
                updateProgressBar();
            }
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('playlist-modal');
        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closePlaylist();
                    break;
                case ' ':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey) {
                        nextTrack();
                    } else {
                        // Skip forward 10 seconds
                        if (audioPlayer) {
                            audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration || 0);
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if (e.ctrlKey) {
                        prevTrack();
                    } else {
                        // Skip backward 10 seconds
                        if (audioPlayer) {
                            audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
                        }
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    // Volume up
                    if (audioPlayer) {
                        currentVolume = Math.min(currentVolume + 0.1, 1);
                        audioPlayer.volume = currentVolume;
                        showNotification(`Volume: ${Math.round(currentVolume * 100)}%`);
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    // Volume down
                    if (audioPlayer) {
                        currentVolume = Math.max(currentVolume - 0.1, 0);
                        audioPlayer.volume = currentVolume;
                        showNotification(`Volume: ${Math.round(currentVolume * 100)}%`);
                    }
                    break;
            }
        }
    });
});

// Cinematic sound effects (Web Audio API)
function createCinematicSounds() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playTransitionSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.8);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
    }
    
    function playHoverSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    return { playTransitionSound, playHoverSound };
}

// Initialize cinematic sounds
let cinematicSounds;
try {
    cinematicSounds = createCinematicSounds();
} catch (e) {
    console.log('Web Audio API not supported');
    cinematicSounds = {
        playTransitionSound: () => {},
        playHoverSound: () => {}
    };
}

// Add sound effects to interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover sounds to cards
    const cards = document.querySelectorAll('.portfolio-card, .project-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cinematicSounds.playHoverSound();
        });
    });
    
    // Add transition sounds
    const buttons = document.querySelectorAll('.enter-btn, .back-btn, .nav-links a');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            cinematicSounds.playTransitionSound();
        });
    });
});







// Scroll interaction with background
let scrollY = 0;
let scrollSpeed = 0;

window.addEventListener('scroll', () => {
    const newScrollY = window.scrollY;
    scrollSpeed = Math.abs(newScrollY - scrollY);
    scrollY = newScrollY;
    
    // Affect background animation based on scroll
    if (typeof particles !== 'undefined') {
        particles.forEach(particle => {
            if (scrollSpeed > 5) {
                particle.vx += (Math.random() - 0.5) * scrollSpeed * 0.001;
                particle.vy += (Math.random() - 0.5) * scrollSpeed * 0.001;
            }
        });
    }
});

// Parallax effect for cinematic elements
function initParallaxEffects() {
    const rays = document.querySelectorAll('.ray');
    const bars = document.querySelectorAll('.bar');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        rays.forEach((ray, index) => {
            const speed = (index + 1) * 0.5;
            ray.style.transform = `translateY(${scrollPercent * speed * 50}px)`;
        });
        
        bars.forEach(bar => {
            bar.style.opacity = 0.7 - scrollPercent * 0.3;
        });
    });
}

// Initialize parallax effects
document.addEventListener('DOMContentLoaded', initParallaxEffects);

window.portfolio = { showSection, playAudio, viewProject, cinematicSounds };
