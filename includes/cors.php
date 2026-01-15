<?php
/**
 * CORS Headers Helper
 *
 * Handles Cross-Origin Resource Sharing headers for API requests.
 * The tracking script runs on customer sites, so we need permissive CORS.
 */

declare(strict_types=1);

/**
 * Set CORS headers for the response
 *
 * Allows any origin since the tracking widget runs on customer domains.
 */
function setCorsHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

    // Allow the requesting origin (or * if no origin header)
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');

    // Allow specific headers
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Visitor-Token');

    // Allow specific methods
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

    // Cache preflight response for 1 hour
    header('Access-Control-Max-Age: 3600');
}

/**
 * Handle CORS preflight request
 *
 * Browsers send OPTIONS request before actual request to check permissions.
 */
function handleCorsPreFlight(): void
{
    setCorsHeaders();

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Initialize CORS handling
 *
 * Call this at the start of API endpoints.
 */
function initCors(): void
{
    handleCorsPreFlight();
}
