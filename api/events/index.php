<?php
/**
 * Server-Sent Events Endpoint
 *
 * Provides real-time visitor updates to the dashboard.
 *
 * GET /api/events
 *
 * Sends events:
 * - visitor_enter: New visitor arrived
 * - visitor_exit: Visitor left
 * - visitor_update: Visitor changed page
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/cors.php';

// Set SSE headers
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no'); // Disable nginx buffering

// Handle CORS
setCorsHeaders();

// Disable output buffering
while (ob_get_level()) {
    ob_end_clean();
}

// Keep track of last known state
$lastVisitorCount = 0;
$lastVisitorIds = [];

// Send initial connection event
sendEvent('connected', ['status' => 'ok', 'timestamp' => date('c')]);

// Poll for changes every 2 seconds
$maxRuntime = 30; // Max 30 seconds per connection (client will reconnect)
$startTime = time();

while ((time() - $startTime) < $maxRuntime) {
    // Check for active visitors
    $visitors = dbQuery(
        "SELECT v.id, v.visitor_token, v.alias, vi.page_url, vi.page_title, p.name as project
         FROM visitors v
         INNER JOIN visits vi ON vi.visitor_id = v.id AND vi.is_active = 1
         INNER JOIN projects p ON p.id = vi.project_id
         ORDER BY vi.entered_at DESC"
    );

    $currentIds = array_column($visitors, 'id');
    $currentCount = count($visitors);

    // Check for new visitors
    $newVisitors = array_diff($currentIds, $lastVisitorIds);
    foreach ($newVisitors as $newId) {
        $visitor = array_filter($visitors, fn($v) => $v['id'] == $newId);
        $visitor = reset($visitor);
        if ($visitor) {
            sendEvent('visitor_enter', $visitor);
        }
    }

    // Check for visitors who left
    $leftVisitors = array_diff($lastVisitorIds, $currentIds);
    foreach ($leftVisitors as $leftId) {
        sendEvent('visitor_exit', ['id' => $leftId]);
    }

    // Update state
    $lastVisitorIds = $currentIds;
    $lastVisitorCount = $currentCount;

    // Send heartbeat
    sendEvent('heartbeat', ['count' => $currentCount, 'timestamp' => date('c')]);

    // Flush and sleep
    if (connection_aborted()) {
        break;
    }

    sleep(2);
}

// Send reconnect hint
sendEvent('reconnect', ['delay' => 1000]);

/**
 * Send an SSE event
 */
function sendEvent(string $event, array $data): void
{
    echo "event: {$event}\n";
    echo "data: " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n\n";
    flush();
}
