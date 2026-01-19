function switchHero(target) {
    // Buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.target === target) {
            btn.classList.add('active');
        }
    });

    // Content
    document.querySelectorAll('.hero-content').forEach(content => {
        if (content.id === `hero-${target}`) {
            content.style.display = 'block';
            // Reset animation to replay it
            content.classList.remove('fade-in');
            void content.offsetWidth; // Trigger reflow
            content.classList.add('fade-in');
        } else {
            content.style.display = 'none';
        }
    });

    // H1 Text Update
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        // Simple fade out/in effect for text change
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            if (target === 'adulto') {
                heroTitle.innerText = "Mantené tu mente activa y tu autonomía, a tu ritmo y sin juicio.";
            } else {
                heroTitle.innerText = "Más autonomía para él/ella, más tranquilidad para vos.";
            }
            heroTitle.style.opacity = '1';
        }, 200);
        heroTitle.style.transition = 'opacity 0.2s ease';
    }

    console.log(`Switched to ${target}`);
}

// Simple FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.querySelector('.faq-grid');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const header = e.target.closest('.faq-header');
            if (!header) return;

            const item = header.parentElement;
            item.classList.toggle('active');
        });
    }

    // Carousel Logic
    initCarousel('location-carousel');

    // ---------------------------------------------------------
    // MOTION SYSTEM INITIALIZATION
    // ---------------------------------------------------------
    initMotionSystem();
});

function initCarousel(id) {
    const carousel = document.getElementById(id);
    if (!carousel) return;

    let index = 0;
    const slides = carousel.querySelectorAll('.carousel-slide');
    const total = slides.length;
    const prevBtn = carousel.parentElement.querySelector('.prev-btn');
    const nextBtn = carousel.parentElement.querySelector('.next-btn');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            index = (index > 0) ? index - 1 : total - 1;
            updateCarousel(carousel, index);
        });

        nextBtn.addEventListener('click', () => {
            index = (index < total - 1) ? index + 1 : 0;
            updateCarousel(carousel, index);
        });
    }
}

function updateCarousel(container, index) {
    const slides = container.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
            if (i === index) {
                slide.classList.remove('fade-in');
                void slide.offsetWidth;
                slide.classList.add('fade-in');
            }
        });
    }
}

/* 
   ==========================================================================
   MOTION ENGINE
   ========================================================================== 
*/

function initMotionSystem() {
    // A. SETUP ELEMENTS FOR REVEAL
    // We add .reveal-hidden to elements we want to animate
    const selectorList = [
        '.problem-card',
        '.diff-card',
        '.step',
        '.benefits-content li',
        '.grid-item',
        '.testimonial-card',
        '.pricing-card',
        '.section-title'
    ];

    selectorList.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal-hidden');
            // Add staggering for lists/grids based on index (modulo 3 for rows)
            const delay = (index % 3) * 100; // 0ms, 100ms, 200ms
            el.style.transitionDelay = `${delay}ms`;
        });
    });

    // Special case: Benefits Image (slide from left side usually, but reveal-hidden does up)
    const benImg = document.querySelector('.benefits-image');
    if (benImg) benImg.classList.add('reveal-hidden');

    // B. INTERSECTION OBSERVER (Scroll Reveal)
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-hidden').forEach(el => observer.observe(el));

    // C. TILT 3D EFFECT (Desktop Only)
    if (window.matchMedia("(hover: hover)").matches) {
        initTiltEffect();
    }

    // D. PARALLAX EFFECT
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.innerWidth > 768) {
        initParallax();
    }

    // E. HEADER SCROLL
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.problem-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Rotate values (limit to 10deg)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.classList.add('is-tilting');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-tilting');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function initParallax() {
    const benefitsImg = document.querySelector('.benefits-image');
    if (!benefitsImg) return;

    window.addEventListener('scroll', () => {
        // Simple requestAnimationFrame loop is better, but for single element listener is OK
        // Limit Frequency
        window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.05;
            // Only apply if in view roughly? Or just global parralax
            // To keep it light, let's just move it slightly
            // We need to verify section position to not jump
            // Simpler: just translate based on scroll relative to viewport?
            // Let's stick to a very subtle constant movement or skip if complex to calculate offsets without jerky jumps

            // benefitsImg.style.transform = `translateY(${rate}px)`; 
            // NOTE: Combined with reveal transform, this might conflict.
            // Better to apply parallax to the IMG inside the wrapper
            const img = benefitsImg.querySelector('img');
            if (img) {
                // img needs to be scaled up a bit to allow movement without showing gaps?
                // img.style.transform = `translateY(${rate * 0.5}px)`;
            }
        });
    }, { passive: true });
}
