// Custom Cursor Movement
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows exactly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay using GSAP if available, or simple CSS
    if (typeof gsap !== 'undefined') {
        gsap.to(cursorOutline, {
            x: posX - 20, // offset by half width
            y: posY - 20,
            duration: 0.15,
            ease: "power2.out"
        });
    } else {
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
});

// Scroll Reveal Animation for Section Titles and Cards
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // If it's a project grid, animate children sequentially
            if(entry.target.classList.contains('project-grid') || entry.target.classList.contains('awards-grid')) {
                const cards = entry.target.children;
                Array.from(cards).forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Select elements to observe
document.querySelectorAll('.section-title').forEach(title => {
    observer.observe(title);
});

// Pre-hide cards for staggered animation
document.querySelectorAll('.project-card, .award-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

document.querySelectorAll('.project-grid, .awards-grid').forEach(grid => {
    observer.observe(grid);
});

// Typing effect for the Hero section
const typingText = document.querySelector('.typing-text');
const roles = ["AI/ML Developer", "Data Science Enthusiast", "Software Engineer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', () => {
    if(typingText) {
        setTimeout(typeEffect, 1000);
    }
});

// Active state for navigation dock
const navItems = document.querySelectorAll('.dock-item');
const sections = document.querySelectorAll('section');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${entry.target.id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => {
    navObserver.observe(section);
});
