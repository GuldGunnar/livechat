<?php
/**
 * Track Endpoint
 *
 * Records visitor activity from the tracking widget.
 *
 * POST /api/track
 *
 * Request body:
 * {
 *   "domain": "example.com",
 *   "page_url": "https://example.com/page",
 *   "page_title": "Page Title",
 *   "visitor_token": "abc123...",
 *   "action": "enter" | "exit" | "heartbeat"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "visitor_id": 123,
 *   "visit_id": 456
 * }
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/visitor.php';

// Only POST allowed
requireMethod('POST');

// Get input
$input = getJsonInput();
validateRequired($input, ['domain', 'page_url', 'visitor_token']);

$domain = $input['domain'];
$pageUrl = $input['page_url'];
$pageTitle = $input['page_title'] ?? null;
$visitorToken = $input['visitor_token'];
$action = $input['action'] ?? 'enter';

// Find project by domain
$project = dbQueryOne(
    "SELECT id, enabled FROM projects WHERE domain = ? AND enabled = 1",
    [$domain]
);

if (!$project) {
    jsonError('Project not found or disabled', 404);
}

$projectId = (int) $project['id'];

// Find or create visitor using enhanced identification
$visitorId = findOrCreateVisitor($visitorToken)

// Handle action
switch ($action) {
    case 'enter':
        // Mark any existing active visits as exited
        dbExecute(
            "UPDATE visits SET is_active = 0, exited_at = NOW()
             WHERE visitor_id = ? AND project_id = ? AND is_active = 1",
            [$visitorId, $projectId]
        );

        // Create new visit
        dbExecute(
            "INSERT INTO visits (project_id, visitor_id, page_url, page_title, is_active)
             VALUES (?, ?, ?, ?, 1)",
            [$projectId, $visitorId, $pageUrl, $pageTitle]
        );
        $visitId = (int) dbLastInsertId();
        break;

    case 'exit':
        // Mark visit as exited
        dbExecute(
            "UPDATE visits SET is_active = 0, exited_at = NOW()
             WHERE visitor_id = ? AND project_id = ? AND is_active = 1",
            [$visitorId, $projectId]
        );
        $visitId = null;
        break;

    case 'heartbeat':
        // Just update last_seen, don't create new visit
        $existingVisit = dbQueryOne(
            "SELECT id FROM visits
             WHERE visitor_id = ? AND project_id = ? AND is_active = 1
             ORDER BY entered_at DESC LIMIT 1",
            [$visitorId, $projectId]
        );
        $visitId = $existingVisit ? (int) $existingVisit['id'] : null;
        break;

    default:
        jsonError('Invalid action', 400);
}

jsonSuccess('Tracked', [
    'visitor_id' => $visitorId,
    'visit_id' => $visitId
]);
