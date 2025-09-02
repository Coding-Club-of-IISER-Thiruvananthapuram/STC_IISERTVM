// Anvesha page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    updateAnveshaInfo();
    loadAnveshaGallery();
    setupFormHandlers();
    initAnimations();
});

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
            src: 'https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/gallery/Events/Anvesha/img1.jpg',
            alt: 'Anvesha Main Event'
        },
        {
            src: 'https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/gallery/Events/Anvesha/Inauguration/img1.jpg',
            alt: 'Anvesha Inauguration'
        },
        {
            src: 'https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/gallery/Events/Anvesha/Afficionados/img1.jpg?raw=true',
            alt: 'Competition Event'
        },
        {
            src: 'https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/gallery/Events/Anvesha/BahFest/img1.jpg?raw=true',
            alt: 'BAHFest'
        },
        {
            src: 'https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/gallery/Events/Anvesha/Blackbox/img1.jpg?raw=true',
            alt: 'Black BOX'
        },
        {
            src: 'https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/gallery/Events/Anvesha/Blender%20Workshop/img1.jpg?raw=true',
            alt: 'Workshop'
        },
         {
            src: 'https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/gallery/Events/Anvesha/Jigyasa/img1.jpg?raw=true',
            alt: 'Jigyasa'
        },
        {
            src: 'https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/gallery/Events/Anvesha/Entanglement/img3.jpg?raw=true',
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
