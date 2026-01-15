<?php
/**
 * Visitors List Endpoint
 *
 * GET /api/visitors - List active visitors across all projects
 *
 * Response:
 * {
 *   "visitors": [
 *     {
 *       "id": 1,
 *       "visitor_token": "abc123",
 *       "alias": "John Doe",
 *       "ip_address": "192.168.1.1",
 *       "current_page": {
 *         "url": "https://example.com/page",
 *         "title": "Page Title",
 *         "project": "Example Site"
 *       },
 *       "last_seen": "2026-01-15T12:00:00Z"
 *     }
 *   ]
 * }
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';

requireMethod('GET');

// Get active visitors with their current page
$visitors = dbQuery(
    "SELECT
        v.id,
        v.visitor_token,
        v.alias,
        v.ip_address,
        v.last_seen,
        vi.page_url,
        vi.page_title,
        vi.entered_at,
        p.name as project_name,
        p.domain as project_domain
     FROM visitors v
     INNER JOIN visits vi ON vi.visitor_id = v.id AND vi.is_active = 1
     INNER JOIN projects p ON p.id = vi.project_id
     ORDER BY vi.entered_at DESC"
);

// Format response
$result = [];
foreach ($visitors as $visitor) {
    $result[] = [
        'id' => (int) $visitor['id'],
        'visitor_token' => $visitor['visitor_token'],
        'alias' => $visitor['alias'],
        'ip_address' => $visitor['ip_address'],
        'last_seen' => $visitor['last_seen'],
        'current_page' => [
            'url' => $visitor['page_url'],
            'title' => $visitor['page_title'],
            'project' => $visitor['project_name'],
            'domain' => $visitor['project_domain'],
            'entered_at' => $visitor['entered_at']
        ]
    ];
}

jsonResponse(['visitors' => $result]);
