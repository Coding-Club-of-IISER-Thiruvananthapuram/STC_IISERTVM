document.addEventListener("DOMContentLoaded", function() {
    const isPagesDirectory = window.location.pathname.includes('/pages/');
    const basePath = isPagesDirectory ? '../' : '';

    const loadPartial = (selector, url) => {
        const element = document.querySelector(selector);
        if (!element) {
            return Promise.resolve(); // Return resolved promise if element doesn't exist
        }
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load ${url}`);
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
            });
    };

    Promise.all([
        loadPartial('header', `${basePath}header.html`),
        loadPartial('footer', `${basePath}footer.html`)
    ]).then(() => {
        // --- AFTER HEADER/FOOTER ARE LOADED ---

        // Fix footer links based on current page location
        const footerHomeLinks = document.querySelectorAll('.footer-link-home');
        const footerPageLinks = document.querySelectorAll('.footer-link-pages');
        
        footerHomeLinks.forEach(link => {
            if (!isPagesDirectory) {
                // If we're on the home page, change ../index.html to index.html
                link.setAttribute('href', 'index.html');
            }
            // If we're in pages directory, keep ../index.html
        });
        
        footerPageLinks.forEach(link => {
            if (!isPagesDirectory) {
                // If we're on the home page, add pages/ prefix
                const href = link.getAttribute('href');
                link.setAttribute('href', `pages/${href}`);
            }
            // If we're in pages directory, keep the relative paths as is
        });

        // Fix image paths
        document.querySelectorAll('img').forEach(img => {
            const originalSrc = img.getAttribute('src');
            if (isPagesDirectory && !originalSrc.startsWith('http') && !originalSrc.startsWith('../')) {
                img.setAttribute('src', `../${originalSrc}`);
            }
        });

        // Hamburger Menu
        const hamburgerButton = document.getElementById('hamburger-button');
        const mainNav = document.getElementById('main-nav');
        if (hamburgerButton && mainNav) {
            hamburgerButton.addEventListener('click', () => {
                mainNav.classList.toggle('nav-active');
                hamburgerButton.setAttribute('aria-expanded', mainNav.classList.contains('nav-active'));
            });
        }

        // --- PAGE-SPECIFIC & DYNAMIC CONTENT ---
        const pagePath = window.location.pathname;

        // FAQ on About page
        if (pagePath.includes('about.html')) {
            document.querySelectorAll('.faq-item .faq-question').forEach(button => {
                button.addEventListener('click', () => {
                    const answer = button.nextElementSibling;
                    button.classList.toggle('active');
                    answer.style.maxHeight = button.classList.contains('active') ? answer.scrollHeight + 'px' : null;
                });
            });
        }

        // Gallery Page
        if (pagePath.includes('gallery.html')) {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const galleryItems = document.querySelectorAll('.gallery-item-full');
            
            console.log('Gallery filter system initialized');
            console.log('Filter buttons found:', filterButtons.length);
            console.log('Gallery items found:', galleryItems.length);
            
            if (filterButtons.length > 0) {
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const filter = button.dataset.filter;
                        console.log('Filter clicked:', filter);
                        
                        // Remove active class from all buttons
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        // Add active class to clicked button
                        button.classList.add('active');
                        
                        // Filter gallery items
                        galleryItems.forEach(item => {
                            const category = item.dataset.category;
                            const shouldShow = filter === 'all' || category === filter;
                            
                            if (shouldShow) {
                                item.style.display = 'block';
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            } else {
                                item.style.display = 'none';
                                item.style.opacity = '0';
                                item.style.transform = 'scale(0.8)';
                            }
                        });
                        
                        console.log('Filtering completed for:', filter);
                    });
                });
            }
            const lightbox = document.getElementById('lightbox');
            if (lightbox) {
                const lightboxImg = document.getElementById('lightbox-img');
                const closeBtn = document.querySelector('.lightbox-close');
                galleryItems.forEach(item => {
                    item.addEventListener('click', () => {
                        lightbox.style.display = 'block';
                        lightboxImg.src = item.querySelector('img').src;
                    });
                });
                if(closeBtn) closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
                lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.style.display = 'none'; });
            }
        }
        
        // Leadership Page
        if (pagePath.includes('leadership.html')) {
            const directorContainer = document.getElementById('director-section');
            const leadershipContainer = document.getElementById('leadership-grid-container');
            const councilContainer = document.getElementById('council-grid-container');
            const formerAdvisorsContainer = document.getElementById('former-advisors-container');
            const pastSecretariesContainer = document.getElementById('past-secretaries-container');

            if (typeof leadershipData !== 'undefined') {
                if (directorContainer && leadershipData.director) {
                    const { director } = leadershipData;
                    directorContainer.innerHTML = `
                        <div class="director-message-box">
                            <div class="director-profile">
                                <div class="director-image">
                                    <img src="${director.imageUrl}" alt="${director.name}" class="director-photo">
                                </div>
                                <div class="director-info">
                                    <h3 class="director-name">${director.name}</h3>
                                    <h4 class="director-role">${director.title}</h4>
                                    <p class="director-message">"${director.message}"</p>
                                </div>
                            </div>
                        </div>`;
                }
                if (leadershipContainer) {
                    let leadershipHtml = '';
                    if (leadershipData.dosa) {
                        const { dosa } = leadershipData;
                        leadershipHtml += `
                            <div class="profile-card">
                                <div class="profile-image">
                                    <img src="${dosa.imageUrl}" alt="${dosa.name}" class="profile-photo">
                                </div>
                                <div class="profile-info">
                                    <h3 class="profile-name">${dosa.name}</h3>
                                    <h4 class="profile-role">${dosa.title}</h4>
                                    <p class="profile-bio">"${dosa.message}"</p>
                                </div>
                            </div>`;
                    }
                    if (leadershipData.currentAdvisors) {
                        leadershipData.currentAdvisors.forEach(advisor => {
                            leadershipHtml += `
                                <div class="profile-card">
                                    <div class="profile-image">
                                        <img src="${advisor.imageUrl}" alt="${advisor.name}" class="profile-photo">
                                    </div>
                                    <div class="profile-info">
                                        <h3 class="profile-name">${advisor.name}</h3>
                                        <h4 class="profile-role">${advisor.title}</h4>
                                        <p class="profile-bio">"${advisor.message}"</p>
                                    </div>
                                </div>`;
                        });
                    }
                    leadershipContainer.innerHTML = leadershipHtml;
                }
                if (formerAdvisorsContainer && leadershipData.formerAdvisors) {
                    let advisorsHtml = '';
                    leadershipData.formerAdvisors.forEach(advisor => {
                        advisorsHtml += `<div class="team-member-card">
                            <img src="${advisor.imageUrl}" alt="${advisor.name}">
                            <h4>${advisor.name}</h4>
                            <p>Faculty Advisor (${advisor.period || ''})</p>
                        </div>`;
                    });
                    formerAdvisorsContainer.innerHTML = advisorsHtml;
                }
            }
            if (councilContainer && typeof councilMembers !== 'undefined') {
                councilMembers.forEach(member => {
                    councilContainer.innerHTML += `<div class="team-member-card"><img src="${member.imageUrl}" alt="${member.name}"><h4>${member.name}</h4><p>${member.position}</p></div>`;
                });
            }
            if (pastSecretariesContainer && typeof pastSecretaries !== 'undefined') {
                let secretariesHtml = '';
                pastSecretaries.forEach(secretary => {
                    secretariesHtml += `<div class="team-member-card">
                        <img src="${secretary.imageUrl}" alt="${secretary.name}">
                        <h4>${secretary.name}</h4>
                        <p>Secretary (${secretary.period || secretary.year})</p>
                    </div>`;
                });
                pastSecretariesContainer.innerHTML = secretariesHtml;
            }
        }

        // Club Pages Team Sections
        if (pagePath.includes('club-')) {
            const teamContainer = document.getElementById('team-grid-container');
            if (teamContainer && typeof clubTeams !== 'undefined') {
                const clubAcronym = pagePath.split('club-')[1].split('.html')[0];
                const team = clubTeams[clubAcronym];
                if (team && team.length > 0) {
                    team.forEach(member => {
                        teamContainer.innerHTML += `<div class="team-member-card"><img src="${member.imageUrl}" alt="${member.name}"><h4>${member.name}</h4><p>${member.position}</p></div>`;
                    });
                } else {
                    teamContainer.innerHTML = "<p>Team member information coming soon.</p>";
                }
            }
        }

        // Events Content
        const upcomingEventsTimeline = document.getElementById('upcoming-events-timeline');
        if (upcomingEventsTimeline && typeof upcomingEvents !== 'undefined') {
            upcomingEvents.slice(0, 2).forEach(event => {
                const [day, month] = event.date.split(' ');
                upcomingEventsTimeline.innerHTML += `<div class="event"><div class="event-date"><span>${day}</span><span>${month}</span></div><div class="event-details"><h3>${event.title}</h3><p>${event.description}</p><a href="pages/events.html" class="learn-more">Learn More</a></div></div>`;
            });
        }
        const upcomingEventsContainer = document.getElementById('upcoming-events-container');
        if (upcomingEventsContainer && typeof upcomingEvents !== 'undefined') {
            upcomingEvents.forEach(event => {
                const [day, month] = event.date.split(' ');
                upcomingEventsContainer.innerHTML += `<div class="event-item"><div class="event-item-date"><span>${day}</span><span>${month}</span></div><div class="event-item-details"><h3>${event.title}</h3><p>${event.description}</p></div></div>`;
            });
        }
        const pastEventsContainer = document.getElementById('past-events-container');
        if (pastEventsContainer && typeof pastEvents !== 'undefined') {
            pastEvents.forEach(event => {
                const [day, month] = event.date.split(' ');
                pastEventsContainer.innerHTML += `<div class="event-item past"><div class="event-item-date"><span>${day}</span><span>${month}</span></div><div class="event-item-details"><h3>${event.title}</h3><p>${event.description}</p></div></div>`;
            });
        }

        // Updates Content
        const latestUpdatesGrid = document.getElementById('latest-updates-grid');
        if (latestUpdatesGrid && typeof latestUpdates !== 'undefined') {
            latestUpdates.slice(0, 3).forEach(update => {
                latestUpdatesGrid.innerHTML += `<article class="update-card"><img src="${update.imageUrl}" alt="Image for ${update.title}"><div class="update-card-content"><h4>${update.title}</h4><p>${update.excerpt}</p><a href="${update.link}">Read More</a></div></article>`;
            });
        }
        const updatesListContainer = document.getElementById('updates-list-container');
        if (updatesListContainer && typeof latestUpdates !== 'undefined') {
            latestUpdates.forEach(update => {
                updatesListContainer.innerHTML += `<article class="update-item"><img src="${update.imageUrl}" alt="Image for ${update.title}"><div class="update-item-content"><div class="update-item-date">${update.date}</div><h3>${update.title}</h3><p>${update.excerpt}</p><a href="${update.link}" class="learn-more">Read Full Article</a></div></article>`;
            });
        }

        // Scroll-to-Reveal Animation
        const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
        if (sectionsToAnimate.length > 0) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            sectionsToAnimate.forEach(section => observer.observe(section));
        }

    }).catch(error => console.error("Error loading partials or executing scripts:", error));
});
