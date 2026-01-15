<?php
/**
 * Visitor Tracker API Router
 *
 * Central entry point for all API requests.
 * Routes requests to appropriate handlers based on URL path.
 *
 * URL format: /api/{resource}/{id?}/{action?}
 * Examples:
 *   POST /api/track              - Record a visit
 *   GET  /api/visitors           - List active visitors
 *   GET  /api/projects           - List projects
 *   POST /api/projects           - Create project
 */

declare(strict_types=1);

// Load utilities
require_once __DIR__ . '/../includes/cors.php';
require_once __DIR__ . '/../includes/response.php';

// Handle CORS (must be first - tracking script is cross-origin)
initCors();

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Remove query string and /api prefix
$path = parse_url($uri, PHP_URL_PATH);

// Handle both /livechat/api/ and /api/ paths
$path = preg_replace('#^/livechat/api/?#', '', $path);
$path = preg_replace('#^/api/?#', '', $path);
$path = trim($path, '/');

// Split path into segments
$segments = $path ? explode('/', $path) : [];
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$action = $segments[2] ?? null;

// Route to appropriate handler
try {
    switch ($resource) {
        case 'track':
            routeTrack($method);
            break;

        case 'visitors':
            routeVisitors($id, $method);
            break;

        case 'projects':
            routeProjects($id, $method);
            break;

        case 'events':
            // SSE endpoint for real-time updates
            require __DIR__ . '/events/index.php';
            break;

        case '':
            // API root - return info
            jsonResponse([
                'name' => 'Visitor Tracker API',
                'version' => '1.0.0',
                'status' => 'ok'
            ]);
            break;

        default:
            jsonError('Resource not found', 404);
    }
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    jsonError('Database error', 500);
} catch (Exception $e) {
    error_log('API error: ' . $e->getMessage());
    jsonError('Server error', 500);
}

/**
 * Route tracking requests
 */
function routeTrack(string $method): void
{
    if ($method !== 'POST') {
        jsonError('Method not allowed', 405);
    }
    require __DIR__ . '/track/index.php';
}

/**
 * Route visitors requests
 */
function routeVisitors(?string $id, string $method): void
{
    if ($id === null) {
        // GET /api/visitors - List active visitors
        require __DIR__ . '/visitors/index.php';
    } elseif (is_numeric($id)) {
        // GET /api/visitors/{id} - Single visitor
        $_REQUEST['visitor_id'] = (int) $id;
        require __DIR__ . '/visitors/single.php';
    } else {
        jsonError('Invalid visitor ID', 400);
    }
}

/**
 * Route projects requests
 */
function routeProjects(?string $id, string $method): void
{
    if ($id === null) {
        // GET/POST /api/projects - List or create
        require __DIR__ . '/projects/index.php';
    } elseif (is_numeric($id)) {
        // GET/PUT/DELETE /api/projects/{id} - Single project
        $_REQUEST['project_id'] = (int) $id;
        require __DIR__ . '/projects/single.php';
    } else {
        jsonError('Invalid project ID', 400);
    }
}
