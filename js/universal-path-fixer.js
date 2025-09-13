// Enhanced Universal Path Fixer with Navbar Loading for STC IISER TVM Website
// Handles GitHub Pages, STC domain (students.iisertvm.ac.in/stc/), and other deployments

(function() {
    'use strict';
    
    console.log('🔧 Enhanced Universal Path Fixer with Navbar Loading started');
    
    // Detect current deployment context
    const currentPath = window.location.pathname;
    const currentHost = window.location.host;
    const currentURL = window.location.href;
    
    // Specific detection for different deployments
    const isSTCDomain = currentHost === "students.iisertvm.ac.in" && currentPath.startsWith("/stc/");
    const isGitHubPages = currentHost.includes("github.io");
    const isLocalDev = currentHost === "localhost" || currentHost === "127.0.0.1";
    const isSubdirectoryDeployment = currentPath.includes("/STC_IISERTVM/");
    
    // Determine the base path based on deployment
    let siteBasePath = "/";
    if (isSTCDomain) {
        siteBasePath = "/stc/";
    } else if (isSubdirectoryDeployment) {
        siteBasePath = "/STC_IISERTVM/";
    }
    
    console.log('Deployment detection:', {
        host: currentHost,
        path: currentPath,
        isSTCDomain,
        isGitHubPages,
        isLocalDev,
        isSubdirectoryDeployment,
        siteBasePath
    });
    
    // Enhanced path fixing function
    function fixPath(originalPath) {
        if (!originalPath || originalPath.startsWith('http://') || originalPath.startsWith('https://') || originalPath.startsWith('//')) {
            return originalPath; // Already absolute or protocol-relative
        }
        
        // Handle different path types
        if (originalPath.startsWith('../')) {
            // Relative path going up from pages directory
            if (isSTCDomain || isSubdirectoryDeployment) {
                const relativePath = originalPath.substring(3); // Remove '../'
                return siteBasePath + relativePath;
            } else {
                return originalPath; // Keep as-is for GitHub Pages root deployment
            }
        } else if (originalPath.startsWith('./') || (!originalPath.startsWith('/') && !originalPath.includes(':'))) {
            // Relative path in current directory (pages/)
            if (isSTCDomain || isSubdirectoryDeployment) {
                const cleanPath = originalPath.replace('./', '');
                return siteBasePath + 'pages/' + cleanPath;
            } else {
                return originalPath; // Keep as-is for GitHub Pages root deployment
            }
        }
        
        return originalPath;
    }
    
    // Navbar loading function with path fixing
    function loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container') || document.getElementById('navbar');
        if (!navbarContainer) {
            console.log('No navbar container found (looking for #navbar-container or #navbar)');
            return;
        }
        
        // Determine navbar path based on current location
        let navbarPath = 'navbar.html'; // Default for pages directory
        const currentPath = window.location.pathname;
        
        // If we're in root (index.html), navbar is in pages/
        if (!currentPath.includes('/pages/')) {
            navbarPath = 'pages/navbar.html';
        }
        
        // Apply path fixing
        const fixedNavbarPath = fixPath(navbarPath);
        
        console.log('Loading navbar:', {
            original: navbarPath,
            fixed: fixedNavbarPath,
            currentPath: currentPath
        });
        
        fetch(fixedNavbarPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                console.log('Navbar HTML loaded successfully');
                navbarContainer.innerHTML = html;
                
                // Fix navbar links after loading
                fixNavbarPaths();
                
                // Re-initialize navbar functionality
                initializeNavbar();
            })
            .catch(error => {
                console.error('Failed to load navbar:', error);
                console.log('Attempted to load from:', fixedNavbarPath);
            });
    }
    
    // Fix navbar paths after loading
    function fixNavbarPaths() {
        const navbarContainer = document.getElementById('navbar-container') || document.getElementById('navbar');
        if (!navbarContainer) return;
        
        // Fix navbar links
        const navbarLinks = navbarContainer.querySelectorAll('a[data-navbar-link]');
        navbarLinks.forEach(link => {
            const originalHref = link.getAttribute('data-navbar-link');
            if (originalHref && !originalHref.startsWith('http')) {
                const newHref = fixPath(originalHref);
                link.setAttribute('href', newHref);
                console.log(`✅ Fixed navbar link: ${originalHref} -> ${newHref}`);
            }
        });
        
        // Fix navbar images
        const navbarImages = navbarContainer.querySelectorAll('img[data-navbar-img]');
        navbarImages.forEach(img => {
            const originalSrc = img.getAttribute('data-navbar-img');
            if (originalSrc && !originalSrc.startsWith('http')) {
                const newSrc = fixPath(originalSrc);
                img.setAttribute('src', newSrc);
                console.log(`✅ Fixed navbar image: ${originalSrc} -> ${newSrc}`);
            }
        });
    }
    
    // Initialize navbar functionality (hamburger menu, dropdowns)
    function initializeNavbar() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Hamburger menu functionality
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }
        
        // Dropdown functionality for mobile
        dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.querySelector('.dropbtn');
            if (dropbtn) {
                dropbtn.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
        
        console.log('✅ Navbar functionality initialized');
    }
    
    // Dynamic CSS loader
    window.writeFixedCSS = function(originalPath) {
        const newPath = fixPath(originalPath);
        document.write('<link rel="stylesheet" href="' + newPath + '">');
        console.log('✅ CSS:', originalPath, '->', newPath);
    };
    
    // Dynamic JS loader
    window.writeFixedJS = function(originalPath) {
        const newPath = fixPath(originalPath);
        document.write('<script src="' + newPath + '"><\/script>');
        console.log('✅ JS:', originalPath, '->', newPath);
    };
    
    // Fix existing paths function
    function fixExistingPaths() {
        // Fix CSS links
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href^="../"]');
        cssLinks.forEach(link => {
            const originalHref = link.getAttribute('href');
            const newHref = fixPath(originalHref);
            if (newHref !== originalHref) {
                link.setAttribute('href', newHref);
                console.log(`✅ Fixed CSS: ${originalHref} -> ${newHref}`);
            }
        });
        
        // Fix script sources
        const scripts = document.querySelectorAll('script[src^="../"]');
        scripts.forEach(script => {
            const originalSrc = script.getAttribute('src');
            const newSrc = fixPath(originalSrc);
            if (newSrc !== originalSrc) {
                script.setAttribute('src', newSrc);
                console.log(`✅ Fixed JS: ${originalSrc} -> ${newSrc}`);
            }
        });
        
        // Fix image sources
        const images = document.querySelectorAll('img[src^="../"]');
        images.forEach(img => {
            const originalSrc = img.getAttribute('src');
            const newSrc = fixPath(originalSrc);
            if (newSrc !== originalSrc) {
                img.setAttribute('src', newSrc);
                console.log(`✅ Fixed IMG: ${originalSrc} -> ${newSrc}`);
            }
        });
        
        // Fix footer links if present
        const footerLinks = document.querySelectorAll('footer a[href^="../"], footer a[href^="pages/"], footer a[data-footer-link]');
        footerLinks.forEach(link => {
            let originalHref = link.getAttribute('href');
            const dataHref = link.getAttribute('data-footer-link');
            
            // Use data-footer-link if available, otherwise use href
            if (dataHref) {
                originalHref = dataHref;
            }
            
            if (originalHref) {
                const newHref = fixPath(originalHref);
                if (newHref !== originalHref) {
                    link.setAttribute('href', newHref);
                    console.log(`✅ Fixed footer link: ${originalHref} -> ${newHref}`);
                }
            }
        });
    }
    
    // Dynamic content fixer for loaded content
    window.fixDynamicContent = function() {
        fixExistingPaths();
        fixNavbarPaths();
    };
    
    // Export the fixPath function globally for other scripts to use
    window.fixPath = fixPath;
    window.loadNavbar = loadNavbar;
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            fixExistingPaths();
            loadNavbar();
        });
    } else {
        fixExistingPaths();
        loadNavbar();
    }
    
    console.log('🔧 Enhanced Path fixer configured for deployment:', 
        isSTCDomain ? 'STC Domain' : 
        isGitHubPages ? 'GitHub Pages' : 
        isSubdirectoryDeployment ? 'Subdirectory' : 'Root');
    
})();