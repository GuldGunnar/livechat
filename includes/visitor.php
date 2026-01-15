<?php
/**
 * Visitor Identification Helper
 *
 * Handles visitor recognition via multiple methods:
 * 1. Visitor token (primary - from localStorage/cookie)
 * 2. IP address (fallback)
 * 3. User agent fingerprint (additional signal)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

/**
 * Get client IP address
 *
 * Handles proxies and load balancers.
 *
 * @return string|null IP address
 */
function getClientIP(): ?string
{
    $headers = [
        'HTTP_CF_CONNECTING_IP',     // Cloudflare
        'HTTP_X_FORWARDED_FOR',      // Standard proxy
        'HTTP_X_REAL_IP',            // Nginx proxy
        'HTTP_CLIENT_IP',            // Some proxies
        'REMOTE_ADDR'                // Direct connection
    ];

    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // X-Forwarded-For may contain multiple IPs - take the first
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            // Validate IP format
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }

    return null;
}

/**
 * Get user agent string
 *
 * @return string|null User agent
 */
function getUserAgent(): ?string
{
    return $_SERVER['HTTP_USER_AGENT'] ?? null;
}

/**
 * Generate a simple browser fingerprint
 *
 * Not unique, but adds an additional signal for identification.
 *
 * @return string Fingerprint hash
 */
function generateFingerprint(): string
{
    $components = [
        $_SERVER['HTTP_USER_AGENT'] ?? '',
        $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
        $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '',
    ];

    return md5(implode('|', $components));
}

/**
 * Find or create a visitor
 *
 * Identification priority:
 * 1. Exact token match
 * 2. IP + fingerprint match (merge tokens)
 * 3. Create new visitor
 *
 * @param string $token Visitor token from client
 * @param string|null $ip Client IP address
 * @param string|null $userAgent User agent string
 * @return int Visitor ID
 */
function findOrCreateVisitor(string $token, ?string $ip = null, ?string $userAgent = null): int
{
    $ip = $ip ?? getClientIP();
    $userAgent = $userAgent ?? getUserAgent();
    $fingerprint = generateFingerprint();

    // 1. Try exact token match
    $visitor = dbQueryOne(
        "SELECT id FROM visitors WHERE visitor_token = ?",
        [$token]
    );

    if ($visitor) {
        // Update last seen and current IP
        dbExecute(
            "UPDATE visitors SET last_seen = NOW(), ip_address = ? WHERE id = ?",
            [$ip, $visitor['id']]
        );
        return (int) $visitor['id'];
    }

    // 2. Check for IP match within last 24 hours (possible returning visitor)
    if ($ip) {
        $recentVisitor = dbQueryOne(
            "SELECT id, visitor_token FROM visitors
             WHERE ip_address = ? AND last_seen > DATE_SUB(NOW(), INTERVAL 24 HOUR)
             ORDER BY last_seen DESC LIMIT 1",
            [$ip]
        );

        // If found and user agent is similar, this might be the same person
        // with cleared cookies - update their token
        if ($recentVisitor && $userAgent) {
            $existingUA = dbQueryOne(
                "SELECT user_agent FROM visitors WHERE id = ?",
                [$recentVisitor['id']]
            );

            // Simple UA similarity check (same browser family)
            if ($existingUA && isSimilarUserAgent($existingUA['user_agent'], $userAgent)) {
                // Update token to new one (user cleared cookies)
                dbExecute(
                    "UPDATE visitors SET visitor_token = ?, last_seen = NOW() WHERE id = ?",
                    [$token, $recentVisitor['id']]
                );
                return (int) $recentVisitor['id'];
            }
        }
    }

    // 3. Create new visitor
    dbExecute(
        "INSERT INTO visitors (visitor_token, ip_address, user_agent, first_seen, last_seen)
         VALUES (?, ?, ?, NOW(), NOW())",
        [$token, $ip, $userAgent]
    );

    return (int) dbLastInsertId();
}

/**
 * Check if two user agents are similar (same browser)
 *
 * @param string|null $ua1 First user agent
 * @param string|null $ua2 Second user agent
 * @return bool True if similar
 */
function isSimilarUserAgent(?string $ua1, ?string $ua2): bool
{
    if (!$ua1 || !$ua2) {
        return false;
    }

    // Extract browser identifiers
    $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];

    $browser1 = null;
    $browser2 = null;

    foreach ($browsers as $browser) {
        if (stripos($ua1, $browser) !== false) {
            $browser1 = $browser;
        }
        if (stripos($ua2, $browser) !== false) {
            $browser2 = $browser;
        }
    }

    // Same browser = similar
    return $browser1 && $browser2 && $browser1 === $browser2;
}

/**
 * Get visitor display name
 *
 * Returns alias if set, otherwise a formatted identifier.
 *
 * @param array $visitor Visitor record
 * @return string Display name
 */
function getVisitorDisplayName(array $visitor): string
{
    if (!empty($visitor['alias'])) {
        return $visitor['alias'];
    }

    // Use IP-based identifier
    if (!empty($visitor['ip_address'])) {
        $ip = $visitor['ip_address'];
        // Show last octet for IPv4, or abbreviated for IPv6
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $parts = explode('.', $ip);
            return 'Besökare #' . end($parts);
        }
        return 'Besökare #' . substr(md5($ip), 0, 4);
    }

    return 'Anonym besökare';
}

/**
 * Check if visitor is currently active
 *
 * @param int $visitorId Visitor ID
 * @return bool True if has active visit
 */
function isVisitorActive(int $visitorId): bool
{
    $result = dbQueryOne(
        "SELECT COUNT(*) as count FROM visits WHERE visitor_id = ? AND is_active = 1",
        [$visitorId]
    );

    return $result && $result['count'] > 0;
}
