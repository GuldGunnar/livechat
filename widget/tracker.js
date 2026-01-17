/**
 * Visitor Tracker Widget
 *
 * Embeddable tracking script for visitor detection.
 *
 * Usage:
 * <script src="https://livechat.nahe.se/widget/tracker.js"
 *         data-domain="example.com"></script>
 */
(function() {
    'use strict';

    // Configuration
    var API_URL = 'http://192.168.0.213:8088/api/track';
    var HEARTBEAT_INTERVAL = 30000; // 30 seconds
    var STORAGE_KEY = 'vt_visitor_token';

    // Get script configuration
    var script = document.currentScript;
    var domain = script ? script.getAttribute('data-domain') : null;

    if (!domain) {
        // Try to detect domain from current page
        domain = window.location.hostname;
    }

    /**
     * Generate a unique visitor token
     */
    function generateToken() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var token = '';
        for (var i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token + '_' + Date.now();
    }

    /**
     * Get or create visitor token
     */
    function getVisitorToken() {
        var token = null;

        // Try localStorage first
        try {
            token = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            // localStorage not available
        }

        // Try cookie as fallback
        if (!token) {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.indexOf(STORAGE_KEY + '=') === 0) {
                    token = cookie.substring(STORAGE_KEY.length + 1);
                    break;
                }
            }
        }

        // Generate new token if not found
        if (!token) {
            token = generateToken();
            saveVisitorToken(token);
        }

        return token;
    }

    /**
     * Save visitor token to storage
     */
    function saveVisitorToken(token) {
        // Save to localStorage
        try {
            localStorage.setItem(STORAGE_KEY, token);
        } catch (e) {
            // localStorage not available
        }

        // Also save to cookie (1 year expiry)
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = STORAGE_KEY + '=' + token + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
    }

    /**
     * Send tracking data to API
     */
    function sendTrack(action, callback) {
        var data = {
            domain: domain,
            page_url: window.location.href,
            page_title: document.title || '',
            visitor_token: getVisitorToken(),
            action: action
        };

        // Use sendBeacon for exit events (more reliable)
        if (action === 'exit' && navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(API_URL, blob);
            if (callback) callback();
            return;
        }

        // Use fetch for other events
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'omit' // Don't send cookies to API
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            if (callback) callback(null, result);
        })
        .catch(function(error) {
            console.warn('[Visitor Tracker] Error:', error);
            if (callback) callback(error);
        });
    }

    /**
     * Track page enter
     */
    function trackEnter() {
        sendTrack('enter');
    }

    /**
     * Track page exit
     */
    function trackExit() {
        sendTrack('exit');
    }

    /**
     * Send heartbeat to keep visit active
     */
    function sendHeartbeat() {
        sendTrack('heartbeat');
    }

    /**
     * Initialize tracker
     */
    function init() {
        // Track page enter
        trackEnter();

        // Set up heartbeat
        var heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        // Track page exit
        window.addEventListener('beforeunload', function() {
            clearInterval(heartbeatTimer);
            trackExit();
        });

        // Track visibility changes (tab switching)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                trackExit();
            } else {
                trackEnter();
            }
        });

        // Track SPA navigation (pushState)
        var originalPushState = history.pushState;
        history.pushState = function() {
            trackExit();
            originalPushState.apply(history, arguments);
            setTimeout(trackEnter, 100);
        };

        // Track popstate (back/forward)
        window.addEventListener('popstate', function() {
            trackExit();
            setTimeout(trackEnter, 100);
        });
    }

    // Start tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
