// ===========================
// Matrix Rain Background Effect
// ===========================
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.init());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        // Semi-transparent black to create fading effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(text, x, y);

            // Reset drop to top randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ===========================
// Navigation Toggle
// ===========================
class Navigation {
    constructor() {
        this.toggle = document.getElementById('nav-toggle');
        this.menu = document.getElementById('nav-menu');
        this.links = document.querySelectorAll('.nav-link');

        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.menu && this.toggle &&
                !this.menu.contains(e.target) &&
                !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Highlight active nav link
        this.highlightActiveLink();
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        this.links.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath ||
                (currentPath.includes(linkPath) && linkPath !== '/')) {
                link.style.color = 'var(--primary-color)';
            }
        });
    }
}

// ===========================
// Form Validation & Security
// ===========================
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.inputs = {
            name: this.form.querySelector('#name'),
            email: this.form.querySelector('#email'),
            subject: this.form.querySelector('#subject'),
            message: this.form.querySelector('#message'),
            honeypot: this.form.querySelector('#honeypot')
        };

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        Object.entries(this.inputs).forEach(([key, input]) => {
            if (input && key !== 'honeypot') {
                input.addEventListener('blur', () => this.validateField(key, input));
                input.addEventListener('input', () => this.clearError(input));
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // Honeypot check (bot detection)
        if (this.inputs.honeypot && this.inputs.honeypot.value) {
            console.log('Bot detected');
            return false;
        }

        // Validate all fields
        const isValid = this.validateAll();

        if (isValid) {
            this.submitForm();
        }
    }

    validateAll() {
        let isValid = true;

        Object.entries(this.inputs).forEach(([key, input]) => {
            if (input && key !== 'honeypot') {
                if (!this.validateField(key, input)) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    validateField(fieldName, input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMsg = '';

        // Check if field is empty
        if (!value) {
            errorMsg = 'This field is required';
            isValid = false;
        } else {
            switch (fieldName) {
                case 'name':
                    // Sanitize and validate name (no special characters except spaces, hyphens)
                    if (!/^[a-zA-Z\s\-']{2,50}$/.test(value)) {
                        errorMsg = 'Please enter a valid name (2-50 characters, letters only)';
                        isValid = false;
                    }
                    break;

                case 'email':
                    // Email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMsg = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;

                case 'subject':
                    if (value.length < 3 || value.length > 100) {
                        errorMsg = 'Subject must be between 3 and 100 characters';
                        isValid = false;
                    }
                    break;

                case 'message':
                    if (value.length < 10 || value.length > 1000) {
                        errorMsg = 'Message must be between 10 and 1000 characters';
                        isValid = false;
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showError(input, errorMsg);
        } else {
            this.clearError(input);
        }

        return isValid;
    }

    showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.form-error');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.classList.add('active');
        input.style.borderColor = 'var(--danger-color)';
    }

    clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.form-error');

        if (errorElement) {
            errorElement.classList.remove('active');
        }

        input.style.borderColor = 'var(--border-color)';
    }

    sanitizeInput(input) {
        // Remove potentially harmful characters
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Sanitize inputs
        const formData = {
            name: this.sanitizeInput(this.inputs.name.value),
            email: this.sanitizeInput(this.inputs.email.value),
            subject: this.sanitizeInput(this.inputs.subject.value),
            message: this.sanitizeInput(this.inputs.message.value),
            timestamp: Date.now()
        };

        try {
            // For GitHub Pages, you'll need to integrate with a service like:
            // - Formspree (https://formspree.io/)
            // - Netlify Forms
            // - EmailJS
            // Or use a serverless function

            // Example with fetch (replace with your actual endpoint)
            // const response = await fetch('YOUR_FORM_ENDPOINT', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData)
            // });

            // Simulate form submission for demo
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showSuccess();
            this.form.reset();

        } catch (error) {
            this.showError(submitBtn, 'Failed to send message. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success';
        successMsg.style.cssText = `
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--success-color);
            color: var(--success-color);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-top: 1rem;
            text-align: center;
        `;
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';

        this.form.appendChild(successMsg);

        setTimeout(() => successMsg.remove(), 5000);
    }
}

// ===========================
// Scroll Animations
// ===========================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.card, .project-card, .blog-card, .cert-badge');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===========================
// Security Headers Check (for development)
// ===========================
class SecurityCheck {
    constructor() {
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1') {
            this.checkSecurityHeaders();
        }
    }

    async checkSecurityHeaders() {
        try {
            const response = await fetch(window.location.href);
            const headers = response.headers;

            const securityHeaders = [
                'X-Frame-Options',
                'X-Content-Type-Options',
                'X-XSS-Protection',
                'Referrer-Policy',
                'Content-Security-Policy'
            ];

            console.group('🔒 Security Headers Check');
            securityHeaders.forEach(header => {
                const value = headers.get(header);
                if (value) {
                    console.log(`✅ ${header}: ${value}`);
                } else {
                    console.warn(`⚠️  ${header}: Not set`);
                }
            });
            console.groupEnd();
        } catch (error) {
            console.error('Security check failed:', error);
        }
    }
}

// ===========================
// Rate Limiting (Client-side for form submission)
// ===========================
class RateLimiter {
    constructor(maxAttempts = 3, timeWindow = 60000) {
        this.maxAttempts = maxAttempts;
        this.timeWindow = timeWindow;
        this.attempts = this.getAttempts();
    }

    getAttempts() {
        const stored = localStorage.getItem('formAttempts');
        return stored ? JSON.parse(stored) : [];
    }

    saveAttempts() {
        localStorage.setItem('formAttempts', JSON.stringify(this.attempts));
    }

    canSubmit() {
        const now = Date.now();

        // Remove old attempts outside time window
        this.attempts = this.attempts.filter(
            timestamp => now - timestamp < this.timeWindow
        );

        if (this.attempts.length >= this.maxAttempts) {
            return false;
        }

        return true;
    }

    recordAttempt() {
        this.attempts.push(Date.now());
        this.saveAttempts();
    }

    getTimeUntilReset() {
        if (this.attempts.length === 0) return 0;

        const oldestAttempt = Math.min(...this.attempts);
        const timePassed = Date.now() - oldestAttempt;
        return Math.max(0, this.timeWindow - timePassed);
    }
}

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix Rain
    new MatrixRain();

    // Initialize Navigation
    new Navigation();

    // Initialize Contact Form
    new ContactForm('contact-form');

    // Initialize Scroll Animations
    new ScrollAnimations();

    // Security Check (dev only)
    new SecurityCheck();

    // Smooth scroll for anchor links
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

    // Add active class to current page nav link
    const currentLocation = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
});

// ===========================
// XSS Protection Utilities
// ===========================
const SecurityUtils = {
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    // Sanitize URL to prevent javascript: protocol
    sanitizeUrl(url) {
        const protocols = ['http:', 'https:', 'mailto:', 'tel:'];
        try {
            const urlObj = new URL(url, window.location.origin);
            return protocols.includes(urlObj.protocol) ? url : '#';
        } catch {
            return '#';
        }
    },

    // Generate CSRF token (for future API integration)
    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
};

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityUtils, RateLimiter };
}
