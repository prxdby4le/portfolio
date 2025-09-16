// Global Variables
let currentSection = 'home';
let backgroundAnimation;

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
    initCustomCursor();
    
    // Start entrance animations directly
    setTimeout(() => {
        triggerEntranceAnimations();
    }, 300);
    
    // Setup project buttons
    setTimeout(() => {
        setupProjectButtons();
    }, 500);
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
        
        // Update URL without page reload
        history.pushState({section: section}, '', section === 'home' ? '/' : `/#${section}`);
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
        tracks: [
            { name: 'Barras e Versos', artist: 'prxdby4le', duration: '3:45' },
            { name: 'Boom Bap Classic', artist: 'prxdby4le', duration: '3:12' },
            { name: 'Underground Flow', artist: 'prxdby4le', duration: '2:58' },
            { name: 'Old School Vibes', artist: 'prxdby4le', duration: '3:28' },
            { name: 'Hip Hop Essence', artist: 'prxdby4le', duration: '3:15' }
        ]
    },
    'Drum & Bass': {
        genre: 'DnB',
        tracks: [
            { name: 'Neurofunk Bass', artist: 'prxdby4le', duration: '4:12' },
            { name: 'Liquid DnB Flow', artist: 'prxdby4le', duration: '5:34' },
            { name: 'Breakcore Madness', artist: 'prxdby4le', duration: '3:48' },
            { name: 'Jungle Rhythm', artist: 'prxdby4le', duration: '4:22' },
            { name: 'Bass Heavy Drop', artist: 'prxdby4le', duration: '3:55' }
        ]
    },
    'Trap Underground': {
        genre: 'Trap',
        tracks: [
            { name: 'Underground Vibes', artist: 'prxdby4le', duration: '3:24' },
            { name: 'Dark Atmosphere', artist: 'prxdby4le', duration: '2:58' },
            { name: 'Experimental Trap', artist: 'prxdby4le', duration: '3:42' },
            { name: 'Street Sounds', artist: 'prxdby4le', duration: '2:45' },
            { name: 'Raw Energy', artist: 'prxdby4le', duration: '3:18' }
        ]
    },
    'Synthwave': {
        genre: 'Synthwave',
        tracks: [
            { name: 'Neon Nights', artist: 'prxdby4le', duration: '3:55' },
            { name: 'Retro Drive', artist: 'prxdby4le', duration: '3:32' },
            { name: '80s Revival', artist: 'prxdby4le', duration: '3:18' },
            { name: 'Vapor Dreams', artist: 'prxdby4le', duration: '4:05' },
            { name: 'Synthetic Love', artist: 'prxdby4le', duration: '3:25' }
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
    }
};

// Playlist State
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;

// Play Audio Function
function playAudio(projectName) {
    openPlaylist(projectName);
    showNotification(`Abrindo playlist: ${projectName}`);
}

// Open Playlist Modal
function openPlaylist(projectName) {
    console.log('Opening playlist for:', projectName); // Debug log
    const modal = document.getElementById('playlist-modal');
    const playlistTitle = document.getElementById('playlist-title');
    const playlistTracks = document.getElementById('playlist-tracks');
    
    // Get playlist data
    const playlist = playlistData[projectName];
    console.log('Playlist data found:', playlist); // Debug log
    if (!playlist) {
        console.log('No playlist found for:', projectName);
        return;
    }
    
    // Set current playlist
    currentPlaylist = playlist.tracks;
    currentTrackIndex = 0;
    
    // Update title
    playlistTitle.textContent = `Playlist - ${playlist.genre}`;
    
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
    
    // Update now playing
    updateNowPlaying();
    
    // Show modal
    modal.classList.add('active');
    
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
}

// Select Track
function selectTrack(index) {
    currentTrackIndex = index;
    
    // Update active track
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Update now playing
    updateNowPlaying();
    
    // Auto play
    if (!isPlaying) {
        togglePlayPause();
    }
}

// Toggle Play/Pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    updateNowPlaying();
    
    if (isPlaying) {
        showNotification(`Reproduzindo: ${currentPlaylist[currentTrackIndex].name}`);
    } else {
        showNotification('Pausado');
    }
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
    isPlaying = false;
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
    
    // Remove continuous effects for minimal design
    
    // Mouse leave - reduce influence
    document.addEventListener('mouseleave', () => {
        mouse.isMoving = false;
        mouseInfluenceRadius = 0;
    });
    
    document.addEventListener('mouseenter', () => {
        mouseInfluenceRadius = 150;
    });
    
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
            this.y += this.vx;
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
        
        // No mouse trail for minimal design
    }
    
    // Create subtle sparkle near mouse
    function createMouseSparkle() {
        const sparkle = new MouseTrailParticle(
            mouse.x + (Math.random() - 0.5) * 30,
            mouse.y + (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        sparkle.size = Math.random() * 1.5 + 0.5;
        sparkle.decay = 0.05;
        sparkle.color = {
            r: 78 + Math.random() * 30,
            g: 205 + Math.random() * 30,
            b: 196 + Math.random() * 30
        };
        mouseParticles.push(sparkle);
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
        
        // Draw mouse interactions
        drawMouseEffects();
        
        // Update ripples
        updateRipples();
        
        requestAnimationFrame(animate);
    }
    
    // Minimal mouse effects
    function drawMouseEffects() {
        // Only very subtle glow when moving
        if (mouse.isMoving) {
            const glowRadius = 30;
            const gradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, glowRadius
            );
            
            gradient.addColorStop(0, 'rgba(78, 205, 196, 0.02)');
            gradient.addColorStop(1, 'rgba(78, 205, 196, 0)');
            
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
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
                    nextTrack();
                    break;
                case 'ArrowLeft':
                    prevTrack();
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

// Enhanced cursor trail effect
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
    });
    
    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
    
    updateCursorTrail();
});

function updateCursorTrail() {
    // Remove existing trail elements
    document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
    
    cursorTrail.forEach((point, index) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            left: ${point.x - 3}px;
            top: ${point.y - 3}px;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(78, 205, 196, ${0.8 - index * 0.08}), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10001;
            animation: trailFade 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 500);
    });
}

// Initialize Custom Cursor
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('button, a, .portfolio-card, .project-item');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Cursor click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
}

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

// Export functions for global access
window.portfolio = {
    showSection,
    playAudio,
    viewProject,
    watchVideo,
    cinematicSounds
};
