// Global Variables
let currentSection = 'home';
let backgroundAnimation;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const heroSection = document.querySelector('.hero-section');
const musicSection = document.getElementById('music-section');
const visualSection = document.getElementById('visual-section');
const aboutSection = document.getElementById('about');
const contactSection = document.getElementById('contact');
const backgroundCanvas = document.getElementById('background-canvas');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    initBackgroundAnimation();
});

// Initialize Application
function initializeApp() {
    // Simulate loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                hideLoading();
            }, 500);
        }
        loadingProgress.style.width = progress + '%';
    }, 100);
}

// Hide Loading Screen
function hideLoading() {
    // Cinematic fade out with scale effect
    loadingScreen.style.transform = 'scale(0.8)';
    loadingScreen.style.opacity = '0';
    loadingScreen.style.filter = 'blur(10px)';
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Trigger entrance animations
        triggerEntranceAnimations();
    }, 1500);
}

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
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Portfolio buttons
    musicBtn.addEventListener('click', () => showSection('music'));
    visualBtn.addEventListener('click', () => showSection('visual'));
    
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
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectName = this.closest('.project-item').querySelector('h3').textContent;
            playAudio(projectName);
        });
    });
    
    // View buttons for visual projects
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectName = this.closest('.project-item').querySelector('h3').textContent;
            viewProject(projectName);
        });
    });
}

// Play Audio Function
function playAudio(projectName) {
    // Create a visual feedback for the play action
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = '⏸ PLAYING';
    button.style.background = 'linear-gradient(45deg, #4ecdc4, #45b7d1)';
    
    // Simulate audio playing
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
    }, 3000);
    
    // Show notification
    showNotification(`Reproduzindo: ${projectName}`);
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
    
    // Enhanced particles array
    const particles = [];
    const particleCount = 80;
    const connectionDistance = 120;
    let mouse = { x: 0, y: 0 };
    
    // Mouse tracking for cinematic effects
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // Enhanced Cinematic Particle class
    class CinematicParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = this.getRandomColor();
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulse = 0;
            this.trail = [];
            this.maxTrailLength = 5;
        }
        
        getRandomColor() {
            const colors = [
                { r: 255, g: 255, b: 255 },
                { r: 78, g: 205, b: 196 },
                { r: 255, g: 107, b: 107 },
                { r: 120, g: 119, b: 198 }
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.vx += (dx / distance) * force * 0.1;
                this.vy += (dy / distance) * force * 0.1;
            }
            
            // Apply some friction
            this.vx *= 0.99;
            this.vy *= 0.99;
            
            // Add to trail
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Pulse effect
            this.pulse += this.pulseSpeed;
            
            // Wrap around screen
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
        }
        
        draw() {
            // Draw trail
            this.trail.forEach((point, index) => {
                const trailOpacity = (index / this.trail.length) * this.opacity * 0.3;
                const trailSize = this.size * (index / this.trail.length) * 0.5;
                
                ctx.beginPath();
                ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${trailOpacity})`;
                ctx.fill();
            });
            
            // Draw main particle with glow
            const glowSize = this.size + Math.sin(this.pulse) * 2;
            const currentOpacity = this.opacity + Math.sin(this.pulse) * 0.2;
            
            // Outer glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity * 0.1})`;
            ctx.fill();
            
            // Inner particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity})`;
            ctx.fill();
        }
    }
    
    // Initialize cinematic particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new CinematicParticle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    // Enhanced cinematic connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 0.3 * (1 - distance / connectionDistance);
                    
                    // Create gradient line
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    
                    gradient.addColorStop(0, `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${opacity})`);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Add glow effect to connections
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(78, 205, 196, ${opacity * 0.5})`;
                    ctx.lineWidth = 4;
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.stroke();
                    ctx.globalCompositeOperation = 'source-over';
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

// Mouse movement effect for cards
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const rotateX = deltaY * 5;
        const rotateY = deltaX * 5;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        }
    });
});

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

// Export functions for global access
window.portfolio = {
    showSection,
    playAudio,
    viewProject,
    cinematicSounds
};
