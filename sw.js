// Service Worker for STC IISER TVM PWA
const CACHE_NAME = 'stc-pwa-v1';
const STATIC_CACHE_NAME = 'stc-static-v1';
const DYNAMIC_CACHE_NAME = 'stc-dynamic-v1';
const IMAGE_CACHE_NAME = 'stc-images-v1';

// Detect base path for GitHub Pages and reverse proxy compatibility
function getBasePath() {
    // Get the current service worker URL to determine base path
    const swUrl = self.location.href;
    const swUrlObj = new URL(swUrl);
    let basePath = swUrlObj.pathname;
    
    // Remove /sw.js from the end to get the base directory
    if (basePath.endsWith('/sw.js')) {
        basePath = basePath.slice(0, -6); // Remove '/sw.js'
    }
    
    // Ensure it ends with /
    if (!basePath.endsWith('/')) {
        basePath += '/';
    }
    
    return basePath;
}

// Get path with base path
function getPath(relativePath) {
    const basePath = getBasePath();
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    
    // If basePath is just '/', return as absolute path
    if (basePath === '/') {
        return `/${cleanPath}`;
    }
    
    // Otherwise combine base path with relative path
    return `${basePath}${cleanPath}`;
}

// Core assets to cache immediately (now using relative paths)
const CORE_ASSETS = [
    getPath(''),
    getPath('index.html'),
    getPath('offline.html'),
    getPath('css/style.css'),
    getPath('css/home.css'),
    getPath('css/main.css'),
    getPath('css/mobile.css'),
    getPath('pages/navbar.css'),
    getPath('js/script.js'),
    getPath('js/home.js'),
    getPath('js/main.js'),
    getPath('js/mobile-enhancements.js'),
    getPath('js/pwa-installer.js'),
    getPath('js/pwa-config.js'),
    getPath('js/smart-sync.js'),
    getPath('pages/navbar.html'),
    getPath('header.html'),
    getPath('footer.html'),
    getPath('android-chrome-192x192.png'),
    getPath('android-chrome-512x512.png'),
    getPath('apple-touch-icon.png'),
    getPath('favicon-32x32.png'),
    getPath('favicon-16x16.png'),
    getPath('site.webmanifest')
];

// Assets to cache on demand
const PAGES_TO_CACHE = [
    getPath('pages/about.html'),
    getPath('pages/clubs.html'),
    getPath('pages/events.html'),
    getPath('pages/gallery.html'),
    getPath('pages/contact.html'),
    getPath('pages/leadership.html'),
    getPath('pages/credits.html'),
    getPath('pages/faq.html'),
    getPath('pages/anvesha.html')
];

// Install event - cache core assets
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');
    
    event.waitUntil(
        Promise.all([
            // Cache core assets with error handling
            caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                    console.log('[SW] Caching core assets');
                    // Cache assets individually to avoid complete failure
                    return Promise.allSettled(
                        CORE_ASSETS.map(asset => {
                            return fetch(asset).then(response => {
                                if (response.ok) {
                                    return cache.put(asset, response);
                                }
                                console.warn(`[SW] Failed to fetch ${asset}: ${response.status}`);
                            }).catch(error => {
                                console.warn(`[SW] Error caching ${asset}:`, error);
                            });
                        })
                    );
                }),
            // Pre-cache important pages with error handling
            caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                    console.log('[SW] Pre-caching important pages');
                    return Promise.allSettled(
                        PAGES_TO_CACHE.slice(0, 3).map(page => {
                            return fetch(page).then(response => {
                                if (response.ok) {
                                    return cache.put(page, response);
                                }
                                console.warn(`[SW] Failed to fetch ${page}: ${response.status}`);
                            }).catch(error => {
                                console.warn(`[SW] Error caching ${page}:`, error);
                            });
                        })
                    );
                })
        ])
        .then(() => {
            console.log('[SW] Core assets cached successfully');
            return self.skipWaiting();
        })
        .catch(error => {
            console.error('[SW] Failed to cache core assets:', error);
            // Don't prevent installation, just log the error
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME && 
                            cacheName !== IMAGE_CACHE_NAME &&
                            cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
        .then(() => {
            console.log('[SW] Service Worker activated and ready');
        })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (except for fonts and essential CDN resources)
    if (url.origin !== location.origin && !isAllowedExternalResource(url)) {
        return;
    }
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Service Worker timeout')), 10000);
    });
    
    event.respondWith(
        Promise.race([
            handleFetch(request),
            timeoutPromise
        ]).catch(error => {
            console.error('[SW] Request failed:', error);
            
            // Emergency fallback - let the request go through normally
            if (isHTMLPage(url.pathname) || request.headers.get('accept')?.includes('text/html')) {
                // For HTML requests, try to serve something useful
                return caches.match(getPath('')) || caches.match(getPath('index.html')) || fetch(request);
            }
            
            // For other requests, let them fail naturally
            return fetch(request);
        })
    );
});

function isAllowedExternalResource(url) {
    const allowedDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdnjs.cloudflare.com'
    ];
    return allowedDomains.some(domain => url.hostname.includes(domain));
}

async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static assets
        if (isStaticAsset(url.pathname)) {
            return await cacheFirst(request, STATIC_CACHE_NAME);
        }
        
        // Strategy 2: Stale While Revalidate for images
        if (isImage(url.pathname)) {
            return await staleWhileRevalidate(request, IMAGE_CACHE_NAME);
        }
        
        // Strategy 3: Network First for HTML pages
        if (isHTMLPage(url.pathname)) {
            return await networkFirst(request, DYNAMIC_CACHE_NAME);
        }
        
        // Strategy 4: Network First for API calls and dynamic content
        return await networkFirst(request, DYNAMIC_CACHE_NAME);
        
    } catch (error) {
        console.error('[SW] Fetch error:', error);
        
        // Enhanced fallback logic for HTML pages
        if (isHTMLPage(url.pathname) || request.headers.get('accept')?.includes('text/html')) {
            // Try to serve the requested page from cache first
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            const cachedPage = await cache.match(request);
            if (cachedPage) {
                console.log('[SW] Serving cached page:', url.pathname);
                return cachedPage;
            }
            
            // Try to serve homepage from cache
            const cachedHome = await cache.match(getPath('')) || await cache.match(getPath('index.html'));
            if (cachedHome) {
                console.log('[SW] Serving cached homepage as fallback');
                return cachedHome;
            }
            
            // Try static cache for homepage
            const staticCache = await caches.open(STATIC_CACHE_NAME);
            const staticHome = await staticCache.match(getPath('')) || await staticCache.match(getPath('index.html'));
            if (staticHome) {
                console.log('[SW] Serving static cached homepage');
                return staticHome;
            }
            
            // Finally, try to serve offline page
            const offlinePage = await staticCache.match(getPath('offline.html'));
            if (offlinePage) {
                console.log('[SW] Serving offline page');
                return new Response(await offlinePage.text(), {
                    status: 200,
                    statusText: 'OK',
                    headers: { 
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache'
                    }
                });
            }
            
            // Last resort: return a basic offline message
            return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Offline - STC IISER TVM</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                        }
                        .offline-message { max-width: 400px; }
                        .retry-btn {
                            background: rgba(255,255,255,0.2);
                            border: 2px solid rgba(255,255,255,0.3);
                            color: white;
                            padding: 12px 24px;
                            border-radius: 25px;
                            cursor: pointer;
                            margin-top: 20px;
                        }
                        .retry-btn:hover { background: rgba(255,255,255,0.3); }
                    </style>
                </head>
                <body>
                    <div class="offline-message">
                        <h1>📱 STC IISER TVM</h1>
                        <h2>You're Offline</h2>
                        <p>No internet connection detected. Please check your connection and try again.</p>
                        <button class="retry-btn" onclick="window.location.reload()">Retry</button>
                        <button class="retry-btn" onclick="window.location.href='./'">Go Home</button>
                    </div>
                </body>
                </html>
            `, {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        // For non-HTML requests, return a simple error response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(request);
        
        if (cached) {
            // Update cache in background if online
            if (navigator.onLine) {
                fetch(request).then(response => {
                    if (response.ok) {
                        cache.put(request, response.clone());
                    }
                }).catch(() => {
                    // Silently fail background update
                });
            }
            return cached;
        }
        
        // Not in cache, try network
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
        
    } catch (error) {
        console.error('[SW] Cache First error:', error);
        // Try network as last resort
        return fetch(request);
    }
}

// Network First strategy
async function networkFirst(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        
        try {
            const response = await fetch(request);
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        } catch (networkError) {
            console.log('[SW] Network failed, trying cache for:', request.url);
            const cached = await cache.match(request);
            if (cached) {
                return cached;
            }
            
            // If it's an HTML request and we have no cache, try to serve homepage
            if (isHTMLPage(new URL(request.url).pathname)) {
                const homepage = await cache.match(getPath('')) || await cache.match(getPath('index.html'));
                if (homepage) {
                    return homepage;
                }
            }
            
            throw networkError;
        }
    } catch (error) {
        console.error('[SW] Network First error:', error);
        throw error;
    }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(request);
        
        const fetchPromise = fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        }).catch(error => {
            console.warn('[SW] Background fetch failed for:', request.url, error);
            return null;
        });
        
        // Return cached version immediately if available, otherwise wait for network
        return cached || await fetchPromise;
        
    } catch (error) {
        console.error('[SW] Stale While Revalidate error:', error);
        // Fallback to network
        return fetch(request);
    }
}

// Helper functions
function isStaticAsset(pathname) {
    return pathname.match(/\.(css|js|woff|woff2|ttf|otf|ico|png|jpg|jpeg|gif|svg|webp)$/) ||
           pathname === '/site.webmanifest';
}

function isImage(pathname) {
    return pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/);
}

function isHTMLPage(pathname) {
    return pathname.endsWith('.html') || 
           pathname === '/' || 
           (!pathname.includes('.') && pathname.endsWith('/'));
}

// Handle background sync for form submissions (if needed)
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    // Implementation for offline form submission sync
    console.log('[SW] Syncing contact form data...');
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/android-chrome-192x192.png',
            badge: '/favicon-32x32.png',
            data: data.url
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

// Log service worker events for debugging
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data && event.data.type === 'SYNC_CACHE') {
        console.log('[SW] Cache sync requested from offline page');
        event.waitUntil(syncCacheFromOfflinePage());
    }
});

// Handle cache sync requests from offline page
async function syncCacheFromOfflinePage() {
    try {
        console.log('[SW] Starting cache sync...');
        
        // Update critical pages
        const criticalPages = [
            '/',
            '/index.html',
            '/pages/about.html',
            '/pages/clubs.html',
            '/pages/events.html',
            '/pages/gallery.html'
        ];
        
        const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
        
        for (const page of criticalPages) {
            try {
                const response = await fetch(page, { cache: 'reload' });
                if (response.ok) {
                    await dynamicCache.put(page, response);
                    console.log(`[SW] Updated cache for: ${page}`);
                }
            } catch (error) {
                console.warn(`[SW] Failed to update cache for ${page}:`, error);
            }
        }
        
        // Update static resources
        const staticResources = [
            '/css/style.css',
            '/js/script.js',
            '/js/pwa-installer.js'
        ];
        
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        
        for (const resource of staticResources) {
            try {
                const response = await fetch(resource, { cache: 'reload' });
                if (response.ok) {
                    await staticCache.put(resource, response);
                    console.log(`[SW] Updated cache for resource: ${resource}`);
                }
            } catch (error) {
                console.warn(`[SW] Failed to update cache for resource ${resource}:`, error);
            }
        }
        
        console.log('[SW] Cache sync completed');
        
        // Notify all clients about the update
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                timestamp: Date.now()
            });
        });
        
    } catch (error) {
        console.error('[SW] Cache sync failed:', error);
    }
}

console.log('[SW] Service Worker script loaded');
