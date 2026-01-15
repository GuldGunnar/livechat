<?php
/**
 * Single Visitor Endpoint
 *
 * GET /api/visitors/{id} - Get visitor details
 * PUT /api/visitors/{id} - Update visitor (set alias)
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';

requireMethod(['GET', 'PUT']);

$visitorId = $_REQUEST['visitor_id'] ?? null;
if (!$visitorId) {
    jsonError('Visitor ID required', 400);
}

$method = getMethod();

if ($method === 'GET') {
    // Get visitor with visit history
    $visitor = dbQueryOne(
        "SELECT * FROM visitors WHERE id = ?",
        [$visitorId]
    );

    if (!$visitor) {
        jsonError('Visitor not found', 404);
    }

    // Get recent visits
    $visits = dbQuery(
        "SELECT vi.*, p.name as project_name
         FROM visits vi
         INNER JOIN projects p ON p.id = vi.project_id
         WHERE vi.visitor_id = ?
         ORDER BY vi.entered_at DESC
         LIMIT 50",
        [$visitorId]
    );

    jsonResponse([
        'visitor' => $visitor,
        'visits' => $visits
    ]);

} elseif ($method === 'PUT') {
    // Update visitor alias
    $input = getJsonInput();
    $alias = $input['alias'] ?? null;

    dbExecute(
        "UPDATE visitors SET alias = ? WHERE id = ?",
        [$alias, $visitorId]
    );

    jsonSuccess('Visitor updated');
}
