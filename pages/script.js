
// Fix horizontal scrolling globally
const setNoHorizontalScroll = () => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
};
setNoHorizontalScroll();
window.addEventListener('resize', setNoHorizontalScroll);

// Enhanced interactions and animations for the STC Leadership page

document.addEventListener('DOMContentLoaded', function() {
    // Dynamically load navbar.html into #navbar
    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
        fetch('navbar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                navbarContainer.innerHTML = html;
                
                // Fix navbar paths for reverse proxy compatibility
                const currentPath = window.location.pathname;
                
                // Calculate how many levels deep we are from the root
                let basePrefix = '';
                
                // Check if we're in a subdirectory deployment (like /stc/pages/)
                const pathParts = currentPath.split('/').filter(part => part !== '');
                
                // If path has more than 1 part before pages, we're in a subdirectory
                let pagesIndex = -1;
                for (let i = 0; i < pathParts.length; i++) {
                    if (pathParts[i] === 'pages') {
                        pagesIndex = i;
                        break;
                    }
                }
                
                if (pagesIndex > 0) {
                    // We're in a subdirectory like /stc/pages/, need extra ../
                    basePrefix = '../'.repeat(pagesIndex);
                }
                
                // Fix all navbar links with data-navbar-link attribute
                const navbarLinks = navbarContainer.querySelectorAll('a[data-navbar-link]');
                navbarLinks.forEach(link => {
                    const originalHref = link.getAttribute('data-navbar-link');
                    if (originalHref && !originalHref.startsWith('http')) {
                        const newHref = basePrefix + originalHref;
                        link.setAttribute('href', newHref);
                    }
                });
                
                // Fix navbar images with data-navbar-img attribute
                const navbarImages = navbarContainer.querySelectorAll('img[data-navbar-img]');
                navbarImages.forEach(img => {
                    const originalSrc = img.getAttribute('data-navbar-img');
                    if (originalSrc && !originalSrc.startsWith('http')) {
                        const newSrc = basePrefix + originalSrc;
                        img.setAttribute('src', newSrc);
                    }
                });
                
                // Re-run navbar interactivity after injection
                const hamburger = navbarContainer.querySelector('.hamburger');
                const navLinks = navbarContainer.querySelector('.nav-links');
                if (hamburger && navLinks) {
                    hamburger.addEventListener('click', function(e) {
                        e.stopPropagation();
                        navLinks.classList.toggle('active');
                    });
                    document.addEventListener('click', function(e) {
                        if (window.innerWidth <= 992 && navLinks.classList.contains('active')) {
                            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                                navLinks.classList.remove('active');
                            }
                        }
                    });
                }
                // Dropdown functionality for mobile hamburger menu
                const dropdowns = navbarContainer.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    // Prevent dropdown links from navigating on mobile
                    const dropbtn = dropdown.querySelector('.dropbtn');
                    if (dropbtn) {
                        dropbtn.addEventListener('click', function(e) {
                            if (window.innerWidth <= 992) {
                                e.preventDefault();
                                e.stopPropagation();
                                dropdowns.forEach(d => {
                                    if (d !== dropdown) d.classList.remove('active');
                                });
                                dropdown.classList.toggle('active');
                            }
                        });
                    }
                });
                document.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        dropdowns.forEach(d => d.classList.remove('active'));
                    }
                });
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                navbarContainer.innerHTML = '<div style="padding: 1rem; background: #f8f9fa; text-align: center;">Navigation loading error</div>';
            });
    }
    // Dropdown functionality for mobile hamburger menu
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.stopPropagation();
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            }
        });
    });
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992 && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            }
        });
    }
    
    // Smooth scroll animation for any internal links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in animation to profile cards
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Observe for intersection
        observer.observe(card);
    });

    // Apply fade-in animation to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        observer.observe(title);
    });

    // Enhanced card interactions
    profileCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(139, 92, 246, 0.1);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Enhanced hover effects for contact items
        const contactItems = card.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.color = '#8B5CF6';
                this.style.transform = 'translateX(4px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.color = '#6B7280';
                this.style.transform = 'translateX(0)';
            });
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Dynamic gradient animation for hero
    let gradientAngle = 135;
    setInterval(() => {
        gradientAngle += 0.5;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.background = `linear-gradient(${gradientAngle}deg, #8B5CF6 0%, #A78BFA 100%)`;
        }
    }, 100);

    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// CSS animation keyframes (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid #8B5CF6 !important;
        outline-offset: 2px !important;
    }
    
    .loaded .hero-title {
        animation: fadeInUp 0.8s ease-out;
    }
    
    .loaded .hero-subtitle {
        animation: fadeInUp 0.8s ease-out 0.2s both;
    }
`;
document.head.appendChild(style);