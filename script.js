// ================================================================
//  CONFIG — Burası dışında başka bir yere dokunman gerekmiyor
// ================================================================
const DEMO_PASSWORD   = 'zorandus2026';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1560231089329668136/fb5vQH5ZUVAFlTIYjlFo8zFuIJHWV2gQn_48y7d8BcnUJZpW3le2Mo6u5lkZjKRuDoJo'; // <-- webhook URL
const DOWNLOAD_URL    = 'https://www.dropbox.com/scl/fi/qfs5f8jf9rtd6lkcsd5p1/ZorandusDemo.exe?rlkey=h58bab9w7nhovr6lgbeh9k6qs&st=y1dl1omb&e=1&dl=1';         // <-- dosya linki
// ================================================================


// Smooth scrolling for navigation links & logo
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // Header background change on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }, { passive: true });
});


// FAQ Toggle Functionality
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Gallery Modal Functions
function openGalleryModal(imageSrc) {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('galleryModalImage');
    modalImage.src = imageSrc;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.getElementById('galleryModal').addEventListener('click', function(e) {
    if (e.target === this) { closeGalleryModal(); }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGalleryModal();
        closePasswordModal();
    }
});

// Trailer Functions
function playTrailer() {
    const trailersSection = document.getElementById('trailers');
    if (trailersSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = trailersSection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
}

// Password Modal Functions
function openPasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'flex';
    showPasswordStep();
    setTimeout(() => document.getElementById('passwordInput').focus(), 80);
    document.body.style.overflow = 'hidden';
}

function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    showPasswordStep();
    clearModalInputs();
    hideModalMessages();
    document.body.style.overflow = 'auto';
}

function showPasswordStep() {
    document.getElementById('passwordStep').classList.add('active');
    document.getElementById('buildStep').classList.remove('active');
}

function showBuildStep() {
    document.getElementById('passwordStep').classList.remove('active');
    document.getElementById('buildStep').classList.add('active');
    document.getElementById('usernameInput').focus();
}

function goBackToPassword() {
    showPasswordStep();
    hideModalMessages();
}

function clearModalInputs() {
    document.getElementById('passwordInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('invitedByInput').value = '';
}

function hideModalMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('loadingMessage').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Step 1: Password verification — local check
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const password = document.getElementById('passwordInput').value.trim();
    hideModalMessages();

    if (!password) {
        showError('Please enter your password.');
        return;
    }

    if (password === DEMO_PASSWORD) {
        showBuildStep();
    } else {
        showError('Invalid password. Please try again.');
    }
});

// Step 2: Download — send webhook then trigger download
document.getElementById('downloadForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username   = document.getElementById('usernameInput').value.trim();
    const invitedBy  = document.getElementById('invitedByInput').value.trim();
    const loadingDiv = document.getElementById('loadingMessage');

    hideModalMessages();

    if (!username) {
        showError('Please enter your username.');
        return;
    }

    loadingDiv.style.display = 'block';
    loadingDiv.textContent = 'Preparing your download...';

    // --- Discord webhook embed ---
    try {
        const now       = new Date();
        const timeStr   = now.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', hour12: false });
        const userAgent = navigator.userAgent;
        const platform  = userAgent.includes('Win') ? 'Windows'
                        : userAgent.includes('Mac') ? 'macOS'
                        : userAgent.includes('Linux') ? 'Linux'
                        : 'Unknown';

        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    author: {
                        name: 'Zorandus: Beyond The Gates',
                        icon_url: 'https://i.imgur.com/4M34hi2.png'
                    },
                    title: 'New Demo Download',
                    color: 0xc9a84c,
                    fields: [
                        { name: 'Username',    value: `\`${username}\``,              inline: true  },
                        { name: 'Invited By',  value: invitedBy ? `\`${invitedBy}\`` : '*direct*', inline: true  },
                        { name: 'Platform',    value: platform,                        inline: true  },
                        { name: 'Time (TR)',   value: timeStr,                         inline: false }
                    ],
                    footer: { text: 'Zorandus Demo Tracker' },
                    timestamp: now.toISOString()
                }]
            })
        });
    } catch (err) {
        console.warn('Webhook failed (non-blocking):', err);
    }

    // --- Trigger download ---
    loadingDiv.textContent = `Welcome, ${username}! Starting your download...`;

    const link = document.createElement('a');
    link.href     = DOWNLOAD_URL;
    link.download = 'Zorandus_Beyond_The_Gates_Demo_v1.2.6.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    loadingDiv.textContent = `Download started. Welcome beyond the gates, ${username}.`;
    setTimeout(() => { closePasswordModal(); }, 3200);
});



// Scroll-triggered fade-in animations (no parallax transforms that break layout)
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.feature-card, .gallery-item, .faq-item');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    function animateOnScroll() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll, { passive: true });
    animateOnScroll();
});

// Floating particles in hero (subtle, no layout impact)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i = 0; i < 18; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-gold);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.3;
            animation: float ${6 + Math.random() * 10}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 6}s;
        `;
        hero.appendChild(particle);
    }
}

const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float {
        0%   { transform: translateY(80px) scale(0); opacity: 0; }
        10%  { opacity: 0.3; }
        90%  { opacity: 0.3; }
        100% { transform: translateY(-120px) scale(1); opacity: 0; }
    }
`;
document.head.appendChild(particleStyles);

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createParticles, 800);
});