function switchHero(target) {
    // Buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.target === target) {
            btn.classList.add('active');
        }
    });

    // Content
    document.querySelectorAll('.hero-content').forEach(content => {
        if(content.id === `hero-${target}`) {
            content.style.display = 'block';
            content.classList.add('fade-in');
        } else {
            content.style.display = 'none';
            content.classList.remove('fade-in');
        }
    });

    // H1 Text Update
    const heroTitle = document.getElementById('hero-title');
    if(heroTitle) {
        if(target === 'adulto') {
            heroTitle.innerText = "Mantené tu mente activa y tu autonomía, a tu ritmo y sin juicio.";
        } else {
            heroTitle.innerText = "Más autonomía para él/ella, más tranquilidad para vos.";
        }
    }
    
    // Smooth scroll if needed or analytic event
    console.log(`Switched to ${target}`);
}

// Simple FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
    // Will attach listeners to FAQ items once they are in the DOM
    const faqContainer = document.querySelector('.faq-grid');
    if(faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const header = e.target.closest('.faq-header');
            if(!header) return;
            
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    }

    // Carousel Logic
    initCarousel('location-carousel');
});

function initCarousel(id) {
    const carousel = document.getElementById(id);
    if(!carousel) return;

    let index = 0;
    const slides = carousel.querySelectorAll('.carousel-slide');
    const total = slides.length;
    const prevBtn = carousel.parentElement.querySelector('.prev-btn');
    const nextBtn = carousel.parentElement.querySelector('.next-btn');

    if(prevBtn && nextBtn) {
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
    if(slides.length > 0) {
        // Simple transform logic assumes slides are 100% width
        // For simplicity in vanilla JS without complex calc, we can just hide/show or transform
        // Let's use simple class toggling for fade effect like Hero
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
    }
}
