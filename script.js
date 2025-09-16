// Global Variables
let currentSection = 'home';
let backgroundAnimation;
// Environment flags (optimize detection for GitHub Pages)
const IS_GITHUB_PAGES = /github\.io$/i.test(window.location.hostname);
const DEBUG_SCAN = /[?&]debug=1/.test(window.location.search);
const DETECT_MAX_INDEX = IS_GITHUB_PAGES ? 20 : 60; // limit scan length
const DETECT_STOP_IF_NONE_AFTER = IS_GITHUB_PAGES ? 6 : 12; // early-stop if none found
const SUPPORTED_FORMATS = IS_GITHUB_PAGES ? ['mp3'] : ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
const MAX_ATTEMPTS_PER_FOLDER = IS_GITHUB_PAGES ? 80 : 400; // hard cap of URL probes per folder
const PROBE_TIMEOUT_MS = IS_GITHUB_PAGES ? 3500 : 5000; // slightly tighter timeout on pages
const VERBOSE_DETECTION_LOGS = !IS_GITHUB_PAGES; // reduce log noise in prod
// Cache for detection results to avoid repeated network requests per folder
const audioDetectionCache = new Map();
// Lazy-loaded manifest of exact filenames per folder (optional)
let audioManifest = null;
let audioManifestLoadAttempted = false;

async function loadAudioManifest() {
    if (audioManifestLoadAttempted) return audioManifest;
    audioManifestLoadAttempted = true;
    try {
        const res = await fetch('assets/audio/manifest.json', { cache: 'no-cache' });
        if (!res.ok) {
            if (VERBOSE_DETECTION_LOGS) console.warn('Manifest not found (optional).');
            audioManifest = null;
            return null;
        }
        audioManifest = await res.json();
        if (VERBOSE_DETECTION_LOGS) console.log('Audio manifest loaded.', audioManifest);
        return audioManifest;
    } catch (e) {
        if (VERBOSE_DETECTION_LOGS) console.warn('Failed to load manifest (optional):', e);
        audioManifest = null;
        return null;
    }
}

// DOM Elements
const heroSection = document.querySelector('.hero-section');
const musicSection = document.getElementById('music-section');
const visualSection = document.getElementById('visual-section');
const videoSection = document.getElementById('video-section');
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
    const validSections = new Set(['home', 'music', 'visual', 'video', 'about', 'contact']);
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

    console.log('[portfolio] Dicas: use portfolio.testAllFolders() ou portfolio.testSingleFolder("1-boombap") no console para diagnosticar arquivos de áudio.');
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
    const videoBtn = document.querySelector('[data-portfolio="video"]');
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Portfolio buttons
    musicBtn.addEventListener('click', () => showSection('music'));
    visualBtn.addEventListener('click', () => showSection('visual'));
    videoBtn.addEventListener('click', () => showSection('video'));
    
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
        const sections = [heroSection, musicSection, visualSection, videoSection, aboutSection, contactSection];
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
            case 'video':
                videoSection.classList.remove('hidden');
                currentSection = 'video';
                cinematicEntrancePortfolio('video');
                break;
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
    
    // Watch buttons for video projects
    const watchButtons = document.querySelectorAll('.watch-btn');
    watchButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectName = this.closest('.project-item').querySelector('h3').textContent;
            watchVideo(projectName);
        });
    });
}

// Playlist Data
const playlistData = {
    'O Fino do Boombap': {
        genre: 'Boombap',
        folder: '1-boombap',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:45', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:12', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '2:58', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '3:28', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:15', file: '5.mp3' }
        ]
    },
    'Drum & Bass': {
        genre: 'DnB',
        folder: '2-dnb',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '4:12', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '5:34', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:48', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '4:22', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:55', file: '5.mp3' }
        ]
    },
    'Trap Underground': {
        genre: 'Trap Underground',
        folder: '3-trap_under',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:24', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '2:58', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:42', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '2:45', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:18', file: '5.mp3' }
        ]
    },
    'Synthwave': {
        genre: 'Synthwave',
        folder: '4-synthwave',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:55', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:32', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:18', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '4:05', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:25', file: '5.mp3' }
        ]
    },
    'Bluecore': {
        genre: 'Bluecore',
        tracks: [
            { name: 'Blue Trash Talk', artist: 'prxdby4le ft. Yung Loof', duration: '2:58' },
            { name: 'Core Essence', artist: 'prxdby4le', duration: '3:12' },
            { name: 'Experimental Blue', artist: 'prxdby4le ft. Yung Loof', duration: '3:35' },
            { name: 'Trash Vibes', artist: 'prxdby4le', duration: '2:45' },
            { name: 'Blue Energy', artist: 'prxdby4le ft. Yung Loof', duration: '3:22' }
        ]
    },
    'Trap Mainstream': {
        genre: 'Trap',
        tracks: [
            { name: 'Popular Vibes', artist: 'prxdby4le', duration: '3:15' },
            { name: 'Commercial Beat', artist: 'prxdby4le', duration: '2:48' },
            { name: 'Radio Ready', artist: 'prxdby4le', duration: '3:28' },
            { name: 'Chart Topper', artist: 'prxdby4le', duration: '3:05' },
            { name: 'Mainstream Flow', artist: 'prxdby4le', duration: '2:55' }
        ]
    },
    'Diversos': {
        genre: 'Experimental',
        tracks: [
            { name: 'Violino Sessions', artist: 'o violino', duration: '4:18' },
            { name: 'Personal Sound', artist: 'prxdby4le', duration: '3:45' },
            { name: 'Experimental Vibe', artist: 'prxdby4le', duration: '5:12' },
            { name: 'Mixed Feelings', artist: 'o violino', duration: '3:32' },
            { name: 'Creative Flow', artist: 'prxdby4le', duration: '4:05' }
        ]
    },
    'Hyper Aesthetic': {
        genre: 'Hyper Aesthetic',
        folder: '6-hyper',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:28', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '4:15', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:42', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '3:55', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '4:08', file: '5.mp3' }
        ]
    },
    'Hoodtrap': {
        genre: 'Hoodtrap',
        folder: '7-hoodtrap',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '2:48', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:12', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '2:35', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '3:25', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:08', file: '5.mp3' }
        ]
    },
    'Plugg\'nb': {
        genre: 'Plugg\'nb',
        folder: '8-plugnb',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:18', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:45', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '4:02', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '3:28', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:55', file: '5.mp3' }
        ]
    },
    'Ambient': {
        genre: 'Ambient',
        folder: '9-ambient',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '5:32', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '6:18', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '4:45', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '5:12', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '4:28', file: '5.mp3' }
        ]
    },
    'Drumless': {
        genre: 'Drumless',
        folder: '10-drumless',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:42', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '4:15', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:28', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '4:05', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:58', file: '5.mp3' }
        ]
    },
    'Voltmix': {
        genre: 'Voltmix',
        folder: '11-voltmix',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '2:42', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:15', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '2:58', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '3:22', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '2:48', file: '5.mp3' }
        ]
    },
    'Outros Ritmos': {
        genre: 'Outros Ritmos',
        folder: '12-other_rythms',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:28', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:45', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:12', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '4:05', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '3:38', file: '5.mp3' }
        ]
    },
    'Bluecore': {
        genre: 'Bluecore',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le ft. Yung Loof', duration: '2:58', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:12', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le ft. Yung Loof', duration: '3:35', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '2:45', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le ft. Yung Loof', duration: '3:22', file: '5.mp3' }
        ]
    },
    'Trap Mainstream': {
        genre: 'Trap Mainstream',
        tracks: [
            { name: 'Track 1', artist: 'prxdby4le', duration: '3:15', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '2:48', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '3:28', file: '3.mp3' },
            { name: 'Track 4', artist: 'prxdby4le', duration: '3:05', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '2:55', file: '5.mp3' }
        ]
    },
    'Diversos': {
        genre: 'Diversos',
        tracks: [
            { name: 'Track 1', artist: 'o violino', duration: '4:18', file: '1.mp3' },
            { name: 'Track 2', artist: 'prxdby4le', duration: '3:45', file: '2.mp3' },
            { name: 'Track 3', artist: 'prxdby4le', duration: '5:12', file: '3.mp3' },
            { name: 'Track 4', artist: 'o violino', duration: '3:32', file: '4.mp3' },
            { name: 'Track 5', artist: 'prxdby4le', duration: '4:05', file: '5.mp3' }
        ]
    }
};

// Playlist State
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer = null;
let currentVolume = 0.7;

// Audio Detection and Utility Functions
function buildAudioUrl(folderPath, filename) {
    // Encode only the filename to preserve relative path
    const safe = encodeURIComponent(filename).replace(/'/g, '%27');
    return `assets/audio/${folderPath}/${safe}`;
}

function probeAudio(url, timeoutMs = PROBE_TIMEOUT_MS) {
    // Try to load audio metadata using an <audio> element (works locally and over http)
    return new Promise((resolve) => {
        const audio = new Audio();
        let settled = false;
        let sawLoadStart = false;

        const complete = (result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeoutId);
            audio.removeEventListener('loadedmetadata', onLoad);
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('loadeddata', onLoadedData);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('loadstart', onLoadStart);
            resolve(result);
        };

        const onLoad = () => complete(audio.duration && !isNaN(audio.duration) ? audio.duration : 0);
        const onCanPlay = () => complete(audio.duration && !isNaN(audio.duration) ? audio.duration : 0);
        const onLoadedData = () => complete(audio.duration && !isNaN(audio.duration) ? audio.duration : 0);
        const onError = () => complete(null);
        const onLoadStart = () => { sawLoadStart = true; };

        audio.addEventListener('loadedmetadata', onLoad);
        audio.addEventListener('canplaythrough', onCanPlay);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('loadeddata', onLoadedData);
        audio.addEventListener('error', onError);
        audio.addEventListener('loadstart', onLoadStart);

        const timeoutId = setTimeout(() => {
            // If carregamento iniciou mas não obteve metadata, considere existente sem duração
            if (sawLoadStart) complete(0); else complete(null);
        }, timeoutMs);
        audio.preload = 'metadata';
        audio.src = url;
        try { audio.load(); } catch {}
    });
}

function deriveTrackNameFromFilename(filename) {
    try {
        const base = filename.replace(/\.[^/.]+$/, '');
        return base
            .replace(/[_-]+/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    } catch {
        return filename;
    }
}

async function detectAudioFiles(folderPath) {
    const audioFiles = [];
    let attempts = 0;

    if (VERBOSE_DETECTION_LOGS) {
        console.log(`🔍 Detecting audio files in: assets/audio/${folderPath}`);
    }

    // Try manifest first (exact filenames, minimal requests)
    const manifest = await loadAudioManifest();
    const manifestFiles = manifest && manifest[folderPath];
    if (Array.isArray(manifestFiles) && manifestFiles.length > 0) {
        for (let i = 0; i < manifestFiles.length; i++) {
            const filename = manifestFiles[i];
            const url = buildAudioUrl(folderPath, filename);
            attempts++;
            const duration = await probeAudio(url);
            if (duration !== null) {
                audioFiles.push({
                    index: i + 1,
                    name: deriveTrackNameFromFilename(filename) || `Track ${i + 1}`,
                    file: filename,
                    duration: duration || 0,
                    path: url
                });
            }
            if (attempts >= MAX_ATTEMPTS_PER_FOLDER) break;
        }
        if (VERBOSE_DETECTION_LOGS) console.log(`✅ Used manifest for ${folderPath}: ${audioFiles.length} files`);
        return audioFiles.sort((a, b) => a.index - b.index);
    }

    const baseName = folderPath.split('-').slice(1).join('-');

    // Minimal, folder-aware base names for production
    const prodBases = (() => {
        const bases = [baseName];
        if (folderPath === '12-other_rythms') bases.push('Other', 'other');
        if (folderPath === '11-voltmix') bases.push('Voltmix', "Voltmix's");
        return Array.from(new Set(bases.filter(Boolean)));
    })();

    // Dev synonyms (more permissive)
    const devBases = Array.from(new Set([
        baseName,
        baseName.replace(/[-_\s]/g, ''),
        ...(folderPath === '1-boombap' ? ['boombap', 'BoomBap', 'Boom Bap'] : []),
        ...(folderPath === '2-dnb' ? ['dnb', 'DnB', 'DrumandBass', 'Drum and Bass', 'Drum & Bass'] : []),
        ...(folderPath === '3-trap_under' ? ['trap_under', 'trapunder', 'TrapUnderground', 'Trap Underground', 'Trap'] : []),
        ...(folderPath === '4-synthwave' ? ['synthwave', 'Synthwave', 'Synthwaves'] : []),
        ...(folderPath === '6-hyper' ? ['hyper', 'Hyper', 'HyperAesthetic', 'Hyper Aesthetic', 'HyperType'] : []),
        ...(folderPath === '7-hoodtrap' ? ['hoodtrap', 'Hoodtrap'] : []),
        ...(folderPath === '8-plugnb' ? ['pluggnb', 'plugg', "Plugg'nb", 'Plugg'] : []),
        ...(folderPath === '9-ambient' ? ['ambient', 'Ambient'] : []),
        ...(folderPath === '10-drumless' ? ['drumless', 'Drumless'] : []),
        ...(folderPath === '11-voltmix' ? ['voltmix', 'Voltmix', "Voltmix's", "voltmix's"] : []),
        ...(folderPath === '12-other_rythms' ? ['other_rythms', 'Other', 'other', 'Other Rythms', 'OutrosRitmos', 'Outros Ritmos', 'others'] : [])
    ].filter(Boolean)));

    const candidateBases = IS_GITHUB_PAGES ? prodBases : devBases;

    // Helper to build patterns per folder/index (minimalistic in production)
    const buildNamingPatterns = (i) => {
        const patterns = [];
        const two = i.toString().padStart(2, '0');

        if (folderPath === '12-other_rythms') {
            // Known pattern: Other (N)
            patterns.push(`Other (${i})`);
        } else {
            // Prefer base's (i) and base (i)
            candidateBases.forEach(base => {
                patterns.push(`${base}'s (${i})`);
                patterns.push(`${base} (${i})`);
            });
            // Generic fallbacks
            patterns.push(two);
            patterns.push(`${i}`);
            patterns.push(`Track ${i}`);
        }
        return Array.from(new Set(patterns));
    };

    // Single-file patterns (only when i === 1)
    const buildSingleFilePatterns = () => {
        const singles = [];
        if (folderPath === '11-voltmix') {
            singles.push("Voltmix's", 'Voltmix');
        }
        // Keep conservative for other folders
        return Array.from(new Set(singles));
    };

    let lastFoundIndex = 0;
    for (let i = 1; i <= DETECT_MAX_INDEX; i++) {
        let foundFile = null;

        // Try single-file only on first index for specific folder(s)
        if (i === 1) {
            const singles = buildSingleFilePatterns();
            for (const single of singles) {
                for (const format of SUPPORTED_FORMATS) {
                    const filename = `${single}.${format}`;
                    const url = buildAudioUrl(folderPath, filename);
                    attempts++;
                    const duration = await probeAudio(url);
                    if (duration !== null) {
                        foundFile = {
                            index: 1,
                            name: deriveTrackNameFromFilename(filename) || 'Track 1',
                            file: filename,
                            duration: duration || 0,
                            path: url
                        };
                        if (VERBOSE_DETECTION_LOGS) console.log(`✅ Found single: ${filename} (${formatDurationFromSeconds(duration || 0)}) -> ${url}`);
                        break;
                    }
                    if (attempts >= MAX_ATTEMPTS_PER_FOLDER) break;
                }
                if (foundFile || attempts >= MAX_ATTEMPTS_PER_FOLDER) break;
            }
        }

        // Try indexed patterns
        const namingPatterns = buildNamingPatterns(i);
        for (const pattern of namingPatterns) {
            if (foundFile || attempts >= MAX_ATTEMPTS_PER_FOLDER) break;
            for (const format of SUPPORTED_FORMATS) {
                const filename = `${pattern}.${format}`;
                const url = buildAudioUrl(folderPath, filename);
                attempts++;
                const duration = await probeAudio(url);
                if (duration !== null) {
                    foundFile = {
                        index: i,
                        name: deriveTrackNameFromFilename(filename) || `Track ${i}`,
                        file: filename,
                        duration: duration || 0,
                        path: url
                    };
                    if (VERBOSE_DETECTION_LOGS) console.log(`✅ Found: ${filename} (${formatDurationFromSeconds(duration || 0)}) -> ${url}`);
                    break;
                }
            }
        }

        if (foundFile) {
            audioFiles.push(foundFile);
            lastFoundIndex = i;
        } else {
            // early break heuristics
            if (audioFiles.length > 0 && i > lastFoundIndex + 2) {
                if (VERBOSE_DETECTION_LOGS) console.log(`ℹ️ Stopping near index ${i}: consecutive gaps`);
                break;
            }
            if (i >= DETECT_STOP_IF_NONE_AFTER && audioFiles.length === 0) {
                if (VERBOSE_DETECTION_LOGS) console.log(`❌ No files after first ${i} tries, stopping`);
                break;
            }
        }

        if (attempts >= MAX_ATTEMPTS_PER_FOLDER) {
            if (VERBOSE_DETECTION_LOGS) console.log(`⛔ Max attempts reached (${attempts}) for ${folderPath}`);
            break;
        }
    }

    if (VERBOSE_DETECTION_LOGS) console.log(`✅ Detection complete: Found ${audioFiles.length} audio files in ${folderPath} (attempts: ${attempts})`);
    return audioFiles.sort((a, b) => a.index - b.index);
}

async function checkFileExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function getAudioDuration(url) {
    return new Promise((resolve) => {
        const audio = new Audio();
        
        const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoad);
            audio.removeEventListener('error', onError);
        };
        
        const onLoad = () => {
            cleanup();
            resolve(audio.duration || 0);
        };
        
        const onError = () => {
            cleanup();
            resolve(0);
        };
        
        const timeout = setTimeout(() => {
            cleanup();
            resolve(0);
        }, 3000);
        
        audio.addEventListener('loadedmetadata', () => {
            clearTimeout(timeout);
            onLoad();
        });
        
        audio.addEventListener('error', () => {
            clearTimeout(timeout);
            onError();
        });
        
        audio.preload = 'metadata';
        audio.src = url;
    });
}



function formatDurationFromSeconds(seconds) {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function updatePlaylistWithRealData(playlistName) {
    const playlist = playlistData[playlistName];
    if (!playlist || !playlist.folder) {
        // Playlists without folder remain static
        return playlist;
    }
    
    try {
        showNotification('Carregando informações da playlist...');
        console.log(`🔍 Scanning folder: ${playlist.folder}`);
        // Use cache when available to prevent repeated scans on Pages
        let realAudioFiles = audioDetectionCache.get(playlist.folder);
        if (!realAudioFiles) {
            realAudioFiles = await detectAudioFiles(playlist.folder);
            audioDetectionCache.set(playlist.folder, realAudioFiles);
        }
        
    if (realAudioFiles.length > 0) {
            // Calculate total duration
            const totalDuration = realAudioFiles.reduce((sum, file) => {
                const duration = file.duration && !isNaN(file.duration) ? file.duration : 0;
                return sum + duration;
            }, 0);
            
            // Update the playlist with real data
            playlist.tracks = realAudioFiles.map((file, index) => ({
                name: deriveTrackNameFromFilename(file.file) || `Track ${file.index}`,
                artist: playlist.tracks[index]?.artist || 'prxdby4le',
                duration: formatDurationFromSeconds(file.duration || 0),
                file: file.file
            }));
            
            // Update playlist metadata
            playlist.duration = formatDurationFromSeconds(totalDuration);
            playlist.totalTracks = realAudioFiles.length;
            
            console.log(`✅ Updated ${playlistName}: ${realAudioFiles.length} tracks, total: ${formatDurationFromSeconds(totalDuration)}`);
            showNotification(`Playlist carregada: ${realAudioFiles.length} músicas encontradas`);
        } else {
            console.warn(`⚠️ No audio files found in folder: ${playlist.folder}`);
            // Evita usar placeholders errados; limpa a lista para refletir que não há arquivos válidos
            playlist.tracks = [];
            delete playlist.duration;
            playlist.totalTracks = 0;
            showNotification('Nenhuma música encontrada na pasta');
        }
        
        return playlist;
    } catch (error) {
        console.error('❌ Error detecting audio files:', error);
        showNotification('Erro ao carregar playlist');
        return playlist; // Return original if detection fails
    }
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
        showNotification('Erro ao carregar a música - pulando para próxima');
        setTimeout(() => {
            nextTrack();
        }, 1000);
    });
    
    audioPlayer.addEventListener('loadstart', () => {
        showNotification('Carregando música...');
    });
    
    audioPlayer.addEventListener('canplay', () => {
        console.log('Audio ready to play');
    });
    
    return audioPlayer;
}

function loadTrack(playlistName, trackIndex) {
    const playlist = playlistData[playlistName];
    if (!playlist || !playlist.tracks[trackIndex]) return false;
    
    const track = playlist.tracks[trackIndex];
    const audioPath = buildAudioUrl(playlist.folder, track.file);
    
    if (!audioPlayer) {
        createAudioPlayer();
    }
    
    audioPlayer.src = audioPath;
    audioPlayer.load();
    
    return true;
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
    
    // Update playlist with real audio file data
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
    const tracksHTML = playlist.tracks.map((track, index) => `
        <div class="track-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <span class="track-number">${(index + 1).toString().padStart(2, '0')}</span>
            <div class="track-info">
                <h5>${track.name}</h5>
                <p>${track.artist}</p>
            </div>
            <span class="track-duration">${track.duration}</span>
        </div>
    `).join('');
    
    playlistTracks.innerHTML = tracksHTML;
    
    // Load first track if available
    if (playlist.tracks && playlist.tracks.length > 0 && playlist.folder) {
        loadTrack(projectName, 0);
        updateNowPlaying();
        showNotification(`Playlist carregada: ${playlist.tracks.length} ${playlist.tracks.length === 1 ? 'música' : 'músicas'}`);
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
    
    // Auto play the new track
    if (isPlaying || !audioPlayer.paused) {
        setTimeout(() => {
            togglePlayPause();
        }, 100);
    }
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
}

// Previous Track
function prevTrack() {
    if (currentTrackIndex > 0) {
        selectTrack(currentTrackIndex - 1);
    } else {
        selectTrack(currentPlaylist.length - 1); // Loop to last track
    }
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

// Watch Video Function
function watchVideo(projectName) {
    // Create a video player modal or redirect to video page
    showNotification(`Reproduzindo vídeo: ${projectName}`);
    
    // Create video modal (simplified version)
    createVideoModal(projectName);
}

// Create Video Modal
function createVideoModal(projectName) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        background: #1a1a1a;
        border-radius: 15px;
        padding: 30px;
        max-width: 800px;
        width: 90%;
        text-align: center;
        border: 1px solid rgba(78, 205, 196, 0.3);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;
    
    videoContainer.innerHTML = `
        <h3 style="color: white; margin-bottom: 20px; font-size: 24px;">${projectName}</h3>
        <div style="background: #333; height: 300px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: #666; font-size: 18px;">🎬 Preview do Vídeo</span>
        </div>
        <button id="close-modal" style="
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border: none;
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
        ">Fechar</button>
    `;
    
    modal.appendChild(videoContainer);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
    
    // Close modal functionality
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 500);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 500);
        }
    });
}

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
        case '3':
            if (currentSection === 'home') {
                showSection('video');
            }
            break;
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
    const magneticElements = document.querySelectorAll('.enter-btn, .play-btn, .view-btn, .watch-btn, .back-btn');
    
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

// Test function to check all folders
async function testAllFolders() {
    if (IS_GITHUB_PAGES && !DEBUG_SCAN) {
        console.warn('🧪 Teste pesado desativado no GitHub Pages. Adicione ?debug=1 à URL para habilitar.');
        return;
    }
    console.log('🧪 Testing all playlist folders...');
    
    for (const [playlistName, playlist] of Object.entries(playlistData)) {
        if (playlist.folder) {
            console.log(`\n📁 Testing folder: ${playlist.folder}`);
            try {
                const files = await detectAudioFiles(playlist.folder);
                console.log(`✅ Found ${files.length} files in ${playlist.folder}`);
                files.slice(0, 5).forEach(file => {
                    console.log(`  - ${file.file} (${formatDurationFromSeconds(file.duration || 0)})`);
                });
                if (files.length > 5) {
                    console.log(`  ... and ${files.length - 5} more files`);
                }
            } catch (error) {
                console.error(`❌ Error in ${playlist.folder}:`, error);
            }
        }
    }
}

// Test single folder function
async function testSingleFolder(folderName) {
    if (IS_GITHUB_PAGES && !DEBUG_SCAN) {
        console.warn('🧪 Teste desativado no GitHub Pages. Adicione ?debug=1 à URL para habilitar.');
        return [];
    }
    console.log(`🧪 Testing single folder: ${folderName}`);
    try {
        const files = await detectAudioFiles(folderName);
        console.log(`✅ Found ${files.length} files`);
        files.forEach(file => {
            console.log(`  - ${file.file} (${formatDurationFromSeconds(file.duration || 0)})`);
        });
        return files;
    } catch (error) {
        console.error(`❌ Error:`, error);
        return [];
    }
}

// Export functions for global access
window.portfolio = {
    showSection,
    playAudio,
    viewProject,
    watchVideo,
    cinematicSounds,
    testAllFolders,
    testSingleFolder
};
