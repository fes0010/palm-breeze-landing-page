// Navigation functionality
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Counter animation for stats
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            if (target % 1 !== 0) {
                element.textContent = target.toFixed(1);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
    };

    updateCounter();
}

// Intersection Observer for scroll reveal animations
const revealElements = document.querySelectorAll('.service-card, .feature-item, .plan-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal', 'active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
});

// Stats counter animation on scroll
const statsSection = document.querySelector('.about');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                animateCounter(stat);
            });
            statsAnimated = true;
        }
    });
}, {
    threshold: 0.5
});

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Form submission handler with security checks
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form element
    const form = event.target;
    
    // Honeypot check - if website field is filled, it's a bot
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value !== '') {
        console.log('Bot detected');
        return false;
    }
    
    // Get form data
    const formData = {
        name: form.querySelector('#name').value,
        phone: form.querySelector('#phone').value,
        email: form.querySelector('#email').value || 'Not provided',
        plan: form.querySelector('#plan').value,
        message: form.querySelector('#message').value || 'None',
        timestamp: new Date().toISOString()
    };
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.plan) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    // Phone validation
    const phonePattern = /^[0-9]{10,13}$/;
    if (!phonePattern.test(formData.phone.replace(/[\s-]/g, ''))) {
        alert('Please enter a valid phone number.');
        return false;
    }
    
    // In production, send this data to your backend
    console.log('Form data:', formData);
    
    // For now, create a WhatsApp message
    const whatsappMessage = `Hi! I'm interested in Palm Breeze Internet.%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0APlan: ${formData.plan}%0AMessage: ${formData.message}`;
    const whatsappURL = `https://wa.me/254742224414?text=${whatsappMessage}`;
    
    // Show success message
    alert('Thank you for your interest! Redirecting you to WhatsApp to complete your request.');
    
    // Redirect to WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Reset form
    form.reset();
    
    return false;
}

// Legacy form handler for compatibility
const contactForm = document.querySelector('.contact-form');
if (contactForm && !contactForm.getAttribute('onsubmit')) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        if (emailInput.value) {
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
}

// Plan selection buttons
const planButtons = document.querySelectorAll('.plan-card .btn');
planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const planName = e.target.closest('.plan-card').querySelector('h3').textContent;
        alert(`You've selected the ${planName} plan! Our team will contact you shortly.`);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled <= window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Animated background particles (optional enhancement)
function createParticle() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(0, 212, 255, 0.5);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${5 + Math.random() * 10}s linear infinite;
        pointer-events: none;
    `;
    
    hero.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// Create particles periodically
setInterval(createParticle, 500);

// Add floating animation to particles
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, -100vh);
            opacity: 0;
        }
    }
    
    .particle {
        animation: particleFloat 15s linear infinite !important;
    }
`;
document.head.appendChild(style);

// Scroll indicator hide on scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (scrollIndicator) {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
});

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Prevent default behavior for demo buttons
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

console.log('Festus Digital Technologies - Website Loaded Successfully! 🚀');
