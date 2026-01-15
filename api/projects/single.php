<?php
/**
 * Single Project Endpoint
 *
 * GET    /api/projects/{id} - Get project details
 * PUT    /api/projects/{id} - Update project
 * DELETE /api/projects/{id} - Delete project
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';

requireMethod(['GET', 'PUT', 'DELETE']);

$projectId = $_REQUEST['project_id'] ?? null;
if (!$projectId) {
    jsonError('Project ID required', 400);
}

$method = getMethod();

if ($method === 'GET') {
    $project = dbQueryOne(
        "SELECT * FROM projects WHERE id = ?",
        [$projectId]
    );

    if (!$project) {
        jsonError('Project not found', 404);
    }

    // Get active visitor count
    $stats = dbQueryOne(
        "SELECT
            COUNT(DISTINCT CASE WHEN is_active = 1 THEN visitor_id END) as active_visitors,
            COUNT(*) as total_visits
         FROM visits WHERE project_id = ?",
        [$projectId]
    );

    jsonResponse([
        'project' => $project,
        'stats' => $stats
    ]);

} elseif ($method === 'PUT') {
    $input = getJsonInput();

    // Build update query dynamically
    $updates = [];
    $params = [];

    $allowedFields = [
        'name', 'domain', 'enabled',
        'notification_browser', 'notification_ntfy', 'notification_sound',
        'ntfy_topic'
    ];

    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = $input[$field];
        }
    }

    if (empty($updates)) {
        jsonError('No fields to update', 400);
    }

    $params[] = $projectId;
    dbExecute(
        "UPDATE projects SET " . implode(', ', $updates) . " WHERE id = ?",
        $params
    );

    jsonSuccess('Project updated');

} elseif ($method === 'DELETE') {
    // Check if project exists
    $project = dbQueryOne(
        "SELECT id FROM projects WHERE id = ?",
        [$projectId]
    );

    if (!$project) {
        jsonError('Project not found', 404);
    }

    // Delete project (cascade will delete visits)
    dbExecute("DELETE FROM projects WHERE id = ?", [$projectId]);

    jsonSuccess('Project deleted');
}
