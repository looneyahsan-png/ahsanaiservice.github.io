// ===== MAIN JAVASCRIPT FILE =====

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ===== FORM VALIDATION AND SUBMISSION =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusDiv = document.getElementById('form-status');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.addRealTimeValidation();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }
    
    validateForm() {
        const form = this.form;
        let isValid = true;
        
        // Remove previous validation classes
        form.classList.remove('was-validated');
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        });
        
        // Validate email format
        const emailField = form.querySelector('#email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('is-invalid');
            }
        }
        
        // Validate phone format (optional)
        const phoneField = form.querySelector('#phone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
                isValid = false;
                phoneField.classList.add('is-invalid');
            }
        }
        
        form.classList.add('was-validated');
        return isValid;
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        // Validate email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Validate phone
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
            }
        }
        
        // Update field classes
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission();
            
            // Show success message
            this.showStatus('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
            this.form.reset();
            this.form.classList.remove('was-validated');
            
        } catch (error) {
            // Show error message
            this.showStatus('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }
    
    showStatus(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        
        this.statusDiv.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="${icon} me-2"></i>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            const alert = this.statusDiv.querySelector('.alert');
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => {
                    this.statusDiv.innerHTML = '';
                }, 150);
            }
        }, 5000);
    }
}

// ===== SCROLL TO TOP BUTTON =====
class ScrollToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }
    
    createButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(button);
        return button;
    }
    
    init() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        });
        
        // Smooth scroll to top
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(52, 58, 64, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'rgba(52, 58, 64, 1)';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }
    
    init() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before next text
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== PARTICLE ANIMATION =====
class ParticleAnimation {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = {
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1
            };
            this.particles.push(particle);
        }
    }
    
    animate() {
        // This would typically use Canvas API for better performance
        // For simplicity, we're using CSS animations in the stylesheet
        requestAnimationFrame(() => this.animate());
    }
}

// ===== FADE IN ON SCROLL =====
function initFadeInOnScroll() {
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
}

// ===== FORM ENHANCEMENTS =====
function initFormEnhancements() {
    // Add floating labels effect
    const formControls = document.querySelectorAll('.form-control, .form-select');
    
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if field has value on page load
        if (control.value) {
            control.parentElement.classList.add('focused');
        }
    });
}

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }
}

// ===== THEME SWITCHER (Optional) =====
function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    
    if (themeSwitcher) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter animation
    animateCounters();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize scroll to top button
    new ScrollToTop();
    
    // Initialize navbar scroll effect
    initNavbarScrollEffect();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize fade in on scroll
    initFadeInOnScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize form enhancements
    initFormEnhancements();
    
    // Initialize preloader
    initPreloader();
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Initialize typing animation for hero text (if element exists)
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'AI Solutions',
            'Machine Learning',
            'Innovation',
            'Future Technology'
        ]);
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Skip to main content functionality
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink && document.activeElement === document.body) {
            skipLink.focus();
        }
    }
});

// Focus management for modals
document.addEventListener('shown.bs.modal', function(e) {
    const modal = e.target;
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
});

// ===== ANALYTICS TRACKING =====
function trackEvent(category, action, label) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'contactForm') {
        trackEvent('Form', 'Submit', 'Contact Form');
    }
});

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('Button', 'Click', e.target.textContent.trim());
    }
});

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Format phone number as user types
function formatPhoneNumber(input) {
    const phoneNumber = input.value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) {
        input.value = phoneNumber;
    } else if (phoneNumberLength < 7) {
        input.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        input.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success message
        showToast('Copied to clipboard!', 'success');
    }, function(err) {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy to clipboard', 'error');
    });
}

// Show toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container or create one
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🚀 Ahsan AI Service Website
Built with modern web technologies
- HTML5, CSS3, JavaScript ES6+
- Bootstrap 5.3.0
- Font Awesome 6.4.0
- AOS Animation Library

For support: info@ahsanaiservice.com
`);