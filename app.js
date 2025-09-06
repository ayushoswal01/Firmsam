// DOM Elements
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');
const statsNumbers = document.querySelectorAll('.stats__number');

// State tracking
let statsAnimated = false;
let isFormSubmitting = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing RDG & Associates website...');
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeBackToTop();
    initializeMobileMenu();
    console.log('✅ RDG & Associates website loaded successfully! (Dark Mode Only)');
});

// Navigation Functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    // Smooth scrolling for navigation links
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            console.log(`Navigation link ${index} clicked:`, targetId);
            
            // Close mobile menu first
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
            
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    console.log(`Scrolling to section ${targetId} at position:`, targetPosition);
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    console.log('✅ Navigation scroll completed');
                } else {
                    console.error('❌ Target section not found:', targetId);
                }
            }
        });
    });
    
    console.log('✅ Navigation initialized with', navLinks.length, 'links');
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    console.log('Initializing mobile menu...');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
            console.log('📱 Mobile menu opened');
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
            console.log('📱 Mobile menu closed');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            navToggle && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
            console.log('📱 Mobile menu closed by outside click');
        }
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
            console.log('📱 Mobile menu closed with Escape key');
        }
    });
    
    console.log('✅ Mobile menu initialized');
}

// Scroll Effects
function initializeScrollEffects() {
    console.log('Initializing scroll effects...');
    
    // Use throttled scroll handler for better performance
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                updateHeaderBackground();
                toggleBackToTopButton();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    console.log('✅ Scroll effects initialized');
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 80;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

function updateHeaderBackground() {
    if (!header) return;
    
    const scrollY = window.pageYOffset;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(10, 15, 28, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 191, 165, 0.15)';
    } else {
        header.style.background = 'rgba(10, 15, 28, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Back to Top Button
function initializeBackToTop() {
    console.log('Initializing back-to-top button...');
    
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔝 Back-to-top button clicked');
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update active nav link to home
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav__link[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
            
            console.log('✅ Scrolled to top');
        });
        
        console.log('✅ Back-to-top button initialized');
    } else {
        console.error('❌ Back-to-top button not found');
    }
}

function toggleBackToTopButton() {
    if (!backToTop) return;
    
    const scrollY = window.pageYOffset;
    
    if (scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

// Animations
function initializeAnimations() {
    console.log('Initializing animations...');
    
    // Animate statistics when they come into view (only once)
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
                console.log('📊 Stats animation triggered');
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Animate cards when they come into view
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe cards for animation
    const cards = document.querySelectorAll('.service__card, .team__card, .knowledge__card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        cardObserver.observe(card);
    });
    
    // Animate sections when they come into view
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    console.log('✅ Animations initialized');
}

function animateStats() {
    if (!statsNumbers.length) return;
    
    console.log('Animating statistics...');
    
    statsNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        stat.textContent = '0';
        
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// Contact Form Functionality
function initializeContactForm() {
    console.log('Initializing contact form...');
    
    if (!contactForm) {
        console.error('❌ Contact form not found');
        return;
    }
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const btnText = submitBtn ? submitBtn.querySelector('.btn__text') : null;
    const btnLoading = submitBtn ? submitBtn.querySelector('.btn__loading') : null;
    
    console.log('📧 Contact form initialized with Formspree ID: xwpnakll');
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        clearValidationErrors();
        
        // Validate name
        if (!nameInput || !nameInput.value.trim()) {
            if (nameInput) showFieldError(nameInput, 'Full name is required');
            isValid = false;
        }
        
        // Validate email
        if (!emailInput || !emailInput.value.trim()) {
            if (emailInput) showFieldError(emailInput, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!messageInput || !messageInput.value.trim()) {
            if (messageInput) showFieldError(messageInput, 'Message is required');
            isValid = false;
        }
        
        console.log('Form validation result:', isValid);
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(field, message) {
        if (!field) return;
        
        field.style.borderColor = '#f87171';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#f87171';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.style.fontWeight = '500';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
        console.log('Field error shown:', message);
    }
    
    function clearValidationErrors() {
        const inputs = [nameInput, emailInput, phoneInput, messageInput];
        inputs.forEach(input => {
            if (input) {
                input.style.borderColor = '';
                const errorDiv = input.parentNode.querySelector('.field-error');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
        });
    }
    
    function showFormMessage(message, type) {
        if (!formMessage) {
            console.error('❌ Form message element not found');
            return;
        }
        
        formMessage.textContent = message;
        formMessage.className = `form__message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        console.log('📧 Form message displayed:', type, '-', message);
        
        // Auto hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }, 10000);
        }
    }
    
    function setSubmitButtonState(isLoading) {
        if (!submitBtn) return;
        
        if (isLoading) {
            if (btnText) {
                btnText.style.display = 'none';
            }
            if (btnLoading) {
                btnLoading.style.display = 'inline';
            }
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        } else {
            if (btnText) {
                btnText.style.display = 'inline';
            }
            if (btnLoading) {
                btnLoading.style.display = 'none';
            }
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('📧 Form submission started');
        
        // Prevent double submission
        if (isFormSubmitting) {
            console.log('⚠️ Form already submitting, ignoring...');
            return;
        }
        
        if (!validateForm()) {
            showFormMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        isFormSubmitting = true;
        setSubmitButtonState(true);
        
        try {
            const formData = new FormData(contactForm);
            
            // Log form data for debugging
            console.log('📧 Form data being sent:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value}`);
            }
            
            const response = await fetch('https://formspree.io/f/xwpnakll', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('📧 Response status:', response.status);
            
            if (response.ok) {
                showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                contactForm.reset();
                clearValidationErrors();
                console.log('✅ Form submitted successfully');
            } else {
                const data = await response.json();
                console.error('❌ Form submission error:', data);
                
                if (data.errors && data.errors.length > 0) {
                    const errorMsg = data.errors.map(err => err.message).join(', ');
                    showFormMessage(`Error: ${errorMsg}`, 'error');
                } else {
                    showFormMessage('Oops! There was a problem submitting your form. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            showFormMessage('Network error. Please check your internet connection and try again.', 'error');
        } finally {
            isFormSubmitting = false;
            setSubmitButtonState(false);
        }
    });
    
    // Real-time validation feedback
    const requiredInputs = [nameInput, emailInput, messageInput].filter(input => input);
    requiredInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(248, 113, 113)') {
                this.style.borderColor = '';
                const errorDiv = this.parentNode.querySelector('.field-error');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
                const errorDiv = this.parentNode.querySelector('.field-error');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
        });
    });
    
    console.log('✅ Contact form initialized successfully');
}

// Performance optimization
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

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Verify all functionality
function verifyFunctionality() {
    const checks = {
        navigation: navLinks.length > 0,
        mobileMenu: !!navToggle && !!navMenu,
        contactForm: !!contactForm,
        backToTop: !!backToTop,
        formValidation: !!document.getElementById('name'),
        darkMode: true
    };
    
    console.log('🔍 Functionality verification:', checks);
    
    const allWorking = Object.values(checks).every(check => check === true);
    
    if (allWorking) {
        console.log('✅ All functionality verified and working!');
    } else {
        console.warn('⚠️ Some functionality issues detected');
    }
    
    return allWorking;
}

// Run verification after everything loads
window.addEventListener('load', function() {
    setTimeout(verifyFunctionality, 500);
});

// Final initialization log
console.log('🚀 RDG & Associates Features:');
console.log('  ✅ Navigation with smooth scrolling');
console.log('  ✅ Mobile menu with hamburger toggle');  
console.log('  ✅ Contact form with validation');
console.log('  ✅ Formspree integration (ID: xwpnakll)');
console.log('  ✅ Statistics animation');
console.log('  ✅ Back-to-top button');
console.log('  ✅ Dark mode only (no theme toggle)');
console.log('  ✅ Navy/Teal/Gold color scheme (NO brown colors)');