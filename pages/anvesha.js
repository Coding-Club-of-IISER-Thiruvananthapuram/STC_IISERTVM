// Anvesha page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    updateAnveshaInfo();
    loadAnveshaGallery();
    setupFormHandlers();
    initAnimations();
    initAlphabetSoup();
});

// Initialize Alphabet Soup Animation
function initAlphabetSoup() {
    const loader = document.getElementById('loader');
    const soupContainer = document.getElementById('soup-container');
    
    loader.classList.add('show');
    soupContainer.classList.add('loading');

    // Anvesha content for alphabet soup
    const content = [{
        title: "ANVESHA 2025",
        desc: "The Annual Science & Technology Fest of IISER Thiruvananthapuram"
    }, {
        title: "Innovation & Discovery",
        desc: "Join us for three days of groundbreaking competitions, workshops, exhibitions, and research presentations."
    }, {
        title: "Save the Date",
        desc: "October 31st-November 2nd, 2025 at IISER Thiruvananthapuram."
    }, {
        title: "Get Ready to Explore",
        desc: "Experience cutting-edge research, participate in exciting competitions, and witness the future of science unfold."
    }];

    let currentPage = 0;

    // Generate content structure
    setTimeout(() => {
        for (let i = 0; i < content.length; i++) {
            // Split content letters to array
            for (let obj in content[i]) {
                if (typeof content[i][obj] === "string") {
                    content[i][obj] = content[i][obj].split("");
                } else if (typeof content[i][obj] === "object") {
                    let toPush = [];
                    for (let j = 0; j < content[i][obj].length; j++) {
                        for (let k = 0; k < content[i][obj][j].length; k++) {
                            toPush.push(content[i][obj][j][k]);
                        }
                    }
                    content[i][obj] = toPush;
                }
            }

            // Create mutable segments
            const segments = document.getElementById('segments');
            const mutableWrap = document.createElement('div');
            mutableWrap.className = 'letters-wrap mutable';
            mutableWrap.innerHTML = '<div class="soup-title"></div><div class="soup-desc"></div>';
            segments.appendChild(mutableWrap);
            setText(i, content, 'mutable');

            // Create position data segments
            const positionWrap = document.createElement('div');
            positionWrap.className = 'letters-wrap position-data';
            positionWrap.innerHTML = '<div class="soup-title"></div><div class="soup-desc"></div>';
            segments.appendChild(positionWrap);
            setText(i, content, 'position-data');
        }

        // Hide loader and start animation
        loader.classList.remove('show');
        soupContainer.classList.remove('loading');
        soupContainer.classList.add('loaded');
        
        setTimeout(() => {
            arrangeCurrentPage();
            scrambleOthers();
            addLetterHoverEffects();
            setupNavigation();
        }, 500);

    }, 1500);

    function setText(index, contentData, type) {
        const wraps = document.querySelectorAll(`.letters-wrap.${type}`);
        const currentWrap = wraps[index];
        if (!currentWrap) return;
        
        const titleEl = currentWrap.querySelector('.soup-title');
        const descEl = currentWrap.querySelector('.soup-desc');

        // Add title letters with proper spacing
        for (let j = 0; j < contentData[index].title.length; j++) {
            const span = document.createElement('span');
            span.className = 'letter';
            const char = contentData[index].title[j];
            
            if (char === ' ') {
                span.innerHTML = '&nbsp;'; // Use non-breaking space
                span.style.minWidth = '12px'; // Ensure minimum width for spaces
                span.style.display = 'inline-block';
            } else {
                span.textContent = char;
            }
            
            titleEl.appendChild(span);
        }

        // Add description letters with proper spacing
        for (let j = 0; j < contentData[index].desc.length; j++) {
            const span = document.createElement('span');
            span.className = 'letter';
            const char = contentData[index].desc[j];
            
            if (char === ' ') {
                span.innerHTML = '&nbsp;'; // Use non-breaking space
                span.style.minWidth = '6px'; // Ensure minimum width for spaces
                span.style.display = 'inline-block';
            } else {
                span.textContent = char;
            }
            
            descEl.appendChild(span);
        }
    }

    function addLetterHoverEffects() {
        const allLetters = document.querySelectorAll('.letter');
        allLetters.forEach(letter => {
            letter.addEventListener('mouseenter', () => {
                if (letter.classList.contains('active')) {
                    letter.style.color = '#ffd700';
                    letter.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.9), 0 4px 15px rgba(0,0,0,0.8)';
                    letter.style.transform = 'scale(1.08)';
                }
            });
            
            letter.addEventListener('mouseleave', () => {
                if (letter.classList.contains('active')) {
                    letter.style.color = '#ffffff';
                    letter.style.textShadow = '';
                    letter.style.transform = '';
                }
            });
        });
    }

    function setupNavigation() {
        const prevBtn = document.getElementById('soup-prev');
        const nextBtn = document.getElementById('soup-next');

        if (!prevBtn || !nextBtn) return;

        prevBtn.style.display = 'none';
        
        prevBtn.addEventListener('click', function() {
            nextBtn.style.display = 'inline';
            currentPage--;
            if (currentPage === 0) {
                prevBtn.style.display = 'none';
            }
            animateTransition();
            pauseAutoAdvance();
        });

        nextBtn.addEventListener('click', function() {
            prevBtn.style.display = 'inline';
            currentPage++;
            if (currentPage === content.length - 1) {
                nextBtn.style.display = 'none';
            }
            animateTransition();
            pauseAutoAdvance();
        });

        // Start auto-advance
        startAutoAdvance();
    }

    // Event handlers
    window.addEventListener('resize', debounce(function() {
        setTimeout(() => {
            arrangeCurrentPage();
            scrambleOthers();
        }, 100);
    }, 250));

    function animateTransition() {
        // Add transition effect
        const allLetters = document.querySelectorAll('.letters-wrap.mutable .letter');
        allLetters.forEach(letter => {
            letter.classList.remove('active');
        });

        setTimeout(() => {
            arrangeCurrentPage();
            scrambleOthers();
        }, 200);
    }

    function arrangeCurrentPage() {
        const mutableWraps = document.querySelectorAll('.letters-wrap.mutable');
        const positionWraps = document.querySelectorAll('.letters-wrap.position-data');
        
        if (!mutableWraps[currentPage] || !positionWraps[currentPage]) return;

        const currentMutable = mutableWraps[currentPage];
        const currentPosition = positionWraps[currentPage];

        // Arrange title letters
        const titleLetters = currentMutable.querySelectorAll('.soup-title .letter');
        const titlePositions = currentPosition.querySelectorAll('.soup-title .letter');
        
        for (let i = 0; i < titleLetters.length; i++) {
            if (titlePositions[i]) {
                const rect = titlePositions[i].getBoundingClientRect();
                titleLetters[i].style.left = rect.left + 'px';
                titleLetters[i].style.top = rect.top + 'px';
                titleLetters[i].style.color = '#fff';
                titleLetters[i].style.zIndex = '9001';
                titleLetters[i].classList.add('active');
            }
        }

        // Arrange description letters
        const descLetters = currentMutable.querySelectorAll('.soup-desc .letter');
        const descPositions = currentPosition.querySelectorAll('.soup-desc .letter');
        
        for (let i = 0; i < descLetters.length; i++) {
            if (descPositions[i]) {
                const rect = descPositions[i].getBoundingClientRect();
                descLetters[i].style.left = rect.left + 'px';
                descLetters[i].style.top = rect.top + 'px';
                descLetters[i].style.color = '#fff';
                descLetters[i].style.zIndex = '9001';
                descLetters[i].classList.add('active');
            }
        }
    }

    function scrambleOthers() {
        const mutableWraps = document.querySelectorAll('.letters-wrap.mutable');
        
        for (let i = 0; i < content.length; i++) {
            if (currentPage === i) continue;

            const currentWrap = mutableWraps[i];
            if (!currentWrap) continue;

            const parts = [
                ['title', '.soup-title'],
                ['desc', '.soup-desc']
            ];

            for (let j = 0; j < parts.length; j++) {
                const letters = currentWrap.querySelectorAll(`${parts[j][1]} .letter`);
                
                for (let k = 0; k < letters.length; k++) {
                    // Reduce chaos by limiting the random positioning to specific zones
                    const zones = [
                        { x: 0.1, y: 0.1, w: 0.2, h: 0.2 },
                        { x: 0.7, y: 0.1, w: 0.2, h: 0.2 },
                        { x: 0.1, y: 0.7, w: 0.2, h: 0.2 },
                        { x: 0.7, y: 0.7, w: 0.2, h: 0.2 },
                        { x: 0.4, y: 0.05, w: 0.2, h: 0.1 },
                        { x: 0.4, y: 0.85, w: 0.2, h: 0.1 }
                    ];
                    
                    const zone = zones[Math.floor(Math.random() * zones.length)];
                    const randLeft = Math.floor((zone.x + Math.random() * zone.w) * window.innerWidth);
                    const randTop = Math.floor((zone.y + Math.random() * zone.h) * window.innerHeight);
                    
                    letters[k].style.left = randLeft + 'px';
                    letters[k].style.top = randTop + 'px';
                    letters[k].style.color = 'rgba(170, 170, 170, 0.2)';
                    letters[k].style.zIndex = 'initial';
                    letters[k].classList.remove('active');
                }
            }
        }
    }

    let autoAdvanceInterval;

    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            const nextBtn = document.getElementById('soup-next');
            if (currentPage < content.length - 1) {
                nextBtn.click();
            } else {
                // Reset to first slide
                const prevBtn = document.getElementById('soup-prev');
                currentPage = -1;
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'inline';
                nextBtn.click();
            }
        }, 12000);
    }

    function pauseAutoAdvance() {
        clearInterval(autoAdvanceInterval);
        // Restart after 20 seconds of inactivity
        setTimeout(() => {
            startAutoAdvance();
        }, 20000);
    }

    // Debounce utility function
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
}

// Update Anvesha information from data.js
function updateAnveshaInfo() {
    // Check if latestUpdates contains Anvesha information
    if (typeof latestUpdates !== 'undefined' && Array.isArray(latestUpdates)) {
        const anveshaUpdate = latestUpdates.find(update => 
            update.title && update.title.toLowerCase().includes('anvesha')
        );
        
        if (anveshaUpdate) {
            // Update date if available
          //  const dateElements = document.querySelectorAll('#anvesha-date, #reg-date');
            //if (anveshaUpdate.date) {
              //  dateElements.forEach(el => {
               // ''    if (el) el.textContent = anveshaUpdate.date;
               // });
}
            
            // Update description in hero section
            const heroDescription = document.querySelector('.hero-description');
            if (heroDescription && anveshaUpdate.excerpt) {
                heroDescription.textContent = anveshaUpdate.excerpt;
            }
        }
    
    
    // Update event information from upcomingEvents
    if (typeof upcomingEvents !== 'undefined' && Array.isArray(upcomingEvents)) {
        const anveshaEvent = upcomingEvents.find(event => 
            event.title && event.title.toLowerCase().includes('anvesha')
        );
        
        if (anveshaEvent) {
           // const dateElements = document.querySelectorAll('#anvesha-date, #reg-date');
           // if (anveshaEvent.date) {
             //   dateElements.forEach(el => {
           //         if (el) el.textContent = anveshaEvent.date;
            //    });
            }
        }
    }


// Load Anvesha gallery images
function loadAnveshaGallery() {
    const galleryGrid = document.getElementById('anvesha-gallery');
    if (!galleryGrid) return;
    
    // Gallery images from Anvesha events
    const galleryImages = [
        {
            src: '../images/gallery/Events/Anvesha/img1.webp',
            alt: 'Anvesha Main Event'
        },
        {
            src: '../images/gallery/Events/Anvesha/Inauguration/img1.webp',
            alt: 'Anvesha Inauguration'
        },
        {
            src: '../images/gallery/Events/Anvesha/Afficionados/img1.webp',
            alt: 'Competition Event'
        },
        {
            src: '../images/gallery/Events/Anvesha/BahFest/img1.webp',
            alt: 'BAHFest'
        },
        {
            src: '../images/gallery/Events/Anvesha/Blackbox/img1.webp',
            alt: 'Black BOX'
        },
        {
            src: '../images/gallery/Events/Anvesha/Blender%20Workshop/img1.webp',
            alt: 'Workshop'
        },
         {
            src: '../images/gallery/Events/Anvesha/Jigyasa/img1.webp',
            alt: 'Jigyasa'
        },
        {
            src: '../images/gallery/Events/Anvesha/Entanglement/img3.webp',
            alt: 'contrapt'
        }

    ];
    
    galleryGrid.innerHTML = '';
    
    galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/250x200?text=Anvesha+${index + 1}'" />
        `;
        
        // Add click handler for image expansion (future enhancement)
        galleryItem.addEventListener('click', () => {
            openImageModal(image.src, image.alt);
        });
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Open image in modal (basic implementation)
function openImageModal(src, alt) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // Close modal on click
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Setup form handlers
function setupFormHandlers() {
    // Interest registration form
    const interestForm = document.getElementById('interest-form');
    if (interestForm) {
        interestForm.addEventListener('submit', handleInterestForm);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

// Handle interest registration form
function handleInterestForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.institution || !data.category || !data.interest) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = event.target.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        // Reset form
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        showMessage('Thank you for your interest! We\'ll send you updates about Anvesha 2025.', 'success');
        
        // Log the data (in real implementation, this would be sent to a server)
        console.log('Interest registration:', data);
    }, 2000);
}

// Handle newsletter form
function handleNewsletterForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    const submitButton = event.target.querySelector('button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        showMessage('Successfully subscribed to newsletter!', 'success');
        
        // Log the email (in real implementation, this would be sent to a server)
        console.log('Newsletter subscription:', email);
    }, 1500);
}

// Show message to user
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageEl.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            break;
        case 'error':
            messageEl.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
            break;
        default:
            messageEl.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
    }
    
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}

// Initialize animations and interactions
function initAnimations() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.event-category, .timeline-item, .stat-item, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Dynamic stats counter (simple version)
    animateCounters();
}

// Animate number counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 50; // Animation speed
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / speed;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 50);
    });
}

// Social sharing functionality (future enhancement)
function shareOnSocial(platform) {
    const url = window.location.href;
    const title = 'Anvesha 2025 - Annual Science Fest at IISER TVM';
    const text = 'Join us at Anvesha 2025, the premier science and technology festival!';
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Export functions for global access
window.anveshaPage = {
    shareOnSocial,
    showMessage,
    openImageModal
};
