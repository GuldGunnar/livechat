<?php
/**
 * Projects List Endpoint
 *
 * GET  /api/projects - List all projects
 * POST /api/projects - Create new project
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';

requireMethod(['GET', 'POST']);

$method = getMethod();

if ($method === 'GET') {
    // List all projects with visitor count
    $projects = dbQuery(
        "SELECT
            p.*,
            COUNT(DISTINCT CASE WHEN vi.is_active = 1 THEN vi.visitor_id END) as active_visitors
         FROM projects p
         LEFT JOIN visits vi ON vi.project_id = p.id
         GROUP BY p.id
         ORDER BY p.name"
    );

    jsonResponse(['projects' => $projects]);

} elseif ($method === 'POST') {
    // Create new project
    $input = getJsonInput();
    validateRequired($input, ['name', 'domain']);

    $name = $input['name'];
    $domain = $input['domain'];
    $notificationBrowser = $input['notification_browser'] ?? 1;
    $notificationNtfy = $input['notification_ntfy'] ?? 0;
    $notificationSound = $input['notification_sound'] ?? 1;
    $ntfyTopic = $input['ntfy_topic'] ?? null;

    // Check if domain already exists
    $existing = dbQueryOne(
        "SELECT id FROM projects WHERE domain = ?",
        [$domain]
    );

    if ($existing) {
        jsonError('Project with this domain already exists', 409);
    }

    dbExecute(
        "INSERT INTO projects (name, domain, notification_browser, notification_ntfy, notification_sound, ntfy_topic)
         VALUES (?, ?, ?, ?, ?, ?)",
        [$name, $domain, $notificationBrowser, $notificationNtfy, $notificationSound, $ntfyTopic]
    );

    $projectId = dbLastInsertId();

    jsonSuccess('Project created', ['id' => (int) $projectId]);
}
