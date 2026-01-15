<?php
/**
 * Project Notification Settings Endpoint
 *
 * GET  /api/projects/{id}/notifications - Get notification settings
 * PUT  /api/projects/{id}/notifications - Update notification settings
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';

requireMethod(['GET', 'PUT']);

$projectId = $_REQUEST['project_id'] ?? null;
if (!$projectId) {
    jsonError('Project ID required', 400);
}

$method = getMethod();

if ($method === 'GET') {
    $project = dbQueryOne(
        "SELECT
            notification_browser,
            notification_ntfy,
            notification_sound,
            ntfy_topic
         FROM projects WHERE id = ?",
        [$projectId]
    );

    if (!$project) {
        jsonError('Project not found', 404);
    }

    jsonResponse(['settings' => $project]);

} elseif ($method === 'PUT') {
    $input = getJsonInput();

    // Validate and update notification settings
    $updates = [];
    $params = [];

    $boolFields = ['notification_browser', 'notification_ntfy', 'notification_sound'];
    foreach ($boolFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = $input[$field] ? 1 : 0;
        }
    }

    if (isset($input['ntfy_topic'])) {
        $updates[] = "ntfy_topic = ?";
        $params[] = $input['ntfy_topic'] ?: null;
    }

    if (empty($updates)) {
        jsonError('No settings to update', 400);
    }

    $params[] = $projectId;
    dbExecute(
        "UPDATE projects SET " . implode(', ', $updates) . " WHERE id = ?",
        $params
    );

    jsonSuccess('Notification settings updated');
}
