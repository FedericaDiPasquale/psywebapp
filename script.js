// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form validation and submission
const appointmentForm = document.getElementById('appointmentForm');
const successMessage = document.createElement('div');
successMessage.className = 'success-message';
successMessage.innerHTML = 'Grazie! La tua richiesta è stata inviata con successo. Ti contatteremo presto per confermare l\'appuntamento.';

// Insert success message before the form
appointmentForm.parentNode.insertBefore(successMessage, appointmentForm);

appointmentForm.addEventListener('submit', function(e) {
    // Get form data
    const formData = new FormData(appointmentForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time', 'privacy'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field]) {
            input.style.borderColor = '#e53e3e';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        document.getElementById('email').style.borderColor = '#e53e3e';
        isValid = false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (data.phone && !phoneRegex.test(data.phone)) {
        document.getElementById('phone').style.borderColor = '#e53e3e';
        isValid = false;
    }
    
    // Date validation (not in the past)
    if (data.date) {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            document.getElementById('date').style.borderColor = '#e53e3e';
            isValid = false;
        }
    }
    
    if (!isValid) {
        e.preventDefault();
        showNotification('Per favore, controlla i campi evidenziati in rosso.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;
    appointmentForm.classList.add('loading');
    
    // Form will submit to Formspree automatically
    // Success/error handling will be done via URL parameters
});

// Helper function to get service name
function getServiceName(serviceValue) {
    const serviceNames = {
        'support': 'Sostegno Psicologico',
        'diagnostic': 'Consultazione Psicodiagnostica',
        'psychotherapy': 'Psicoterapia Individuale Adulti e Adolescenti',
        'consultation': 'Prima Consultazione'
    };
    return serviceNames[serviceValue] || serviceValue;
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Update available times based on selected date
dateInput.addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const dayOfWeek = selectedDate.getDay();
    const timeSelect = document.getElementById('time');
    
    // Clear existing options
    timeSelect.innerHTML = '<option value="">Seleziona un orario</option>';
    
    // Define available times based on day
    let availableTimes = [];
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    } else if (dayOfWeek === 6) { // Saturday
        availableTimes = ['09:00', '10:00', '11:00'];
    } else { // Sunday
        availableTimes = [];
    }
    
    // Add time options
    availableTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    if (availableTimes.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nessun orario disponibile';
        option.disabled = true;
        timeSelect.appendChild(option);
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#48bb78';
            break;
        case 'error':
            notification.style.background = '#e53e3e';
            break;
        case 'warning':
            notification.style.background = '#ed8936';
            break;
        default:
            notification.style.background = '#2c5aa0';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .about-content, .contact-content, .booking-container');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Service selection helper
const serviceSelect = document.getElementById('service');
const messageTextarea = document.getElementById('message');

serviceSelect.addEventListener('change', function() {
    const serviceMessages = {
        'support': 'Descrivi brevemente le difficoltà che stai affrontando e il tipo di supporto di cui hai bisogno...',
        'diagnostic': 'Descrivi il motivo della consultazione psicodiagnostica e le aree che vorresti valutare...',
        'psychotherapy': 'Descrivi le difficoltà psicologiche o relazionali che stai affrontando...',
        'consultation': 'Descrivi il motivo della prima consultazione e le tue aspettative...'
    };
    
    const placeholder = serviceMessages[this.value] || 'Descrivi brevemente il motivo della richiesta o eventuali preferenze...';
    messageTextarea.placeholder = placeholder;
});

// Form field focus effects
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentNode.classList.remove('focused');
        }
    });
});

// Add click-to-call functionality
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const phoneNumber = this.getAttribute('href').replace('tel:', '');
        if (confirm(`Vuoi chiamare ${phoneNumber}?`)) {
            window.location.href = this.getAttribute('href');
        }
    });
});

// Add email click functionality
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const email = this.getAttribute('href').replace('mailto:', '');
        if (confirm(`Vuoi inviare un'email a ${email}?`)) {
            window.location.href = this.getAttribute('href');
        }
    });
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add loading states for better UX
function addLoadingState(element) {
    element.style.position = 'relative';
    element.style.pointerEvents = 'none';
    element.style.opacity = '0.7';
}

function removeLoadingState(element) {
    element.style.pointerEvents = 'auto';
    element.style.opacity = '1';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dr. Di Pasquale Lorena - Psicoterapeuta website loaded successfully');
    
    // Add any initialization code here
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
    }
});
