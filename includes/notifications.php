<?php
/**
 * Notification Helper
 *
 * Handles sending notifications via various channels:
 * - Browser Push (via Push API)
 * - ntfy.sh (mobile push)
 * - Dashboard events (SSE)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

/**
 * Send notification for new visitor
 *
 * @param int $projectId Project ID
 * @param array $visitor Visitor data
 * @param string $pageUrl Current page URL
 * @param string|null $pageTitle Current page title
 */
function notifyNewVisitor(int $projectId, array $visitor, string $pageUrl, ?string $pageTitle): void
{
    // Get project settings
    $project = dbQueryOne(
        "SELECT * FROM projects WHERE id = ?",
        [$projectId]
    );

    if (!$project || !$project['enabled']) {
        return;
    }

    // Build notification content
    $visitorName = $visitor['alias'] ?? 'Ny besökare';
    $title = "Besökare på {$project['name']}";
    $body = $pageTitle ?: $pageUrl;

    // Send ntfy.sh notification if enabled
    if ($project['notification_ntfy'] && !empty($project['ntfy_topic'])) {
        sendNtfyNotification(
            $project['ntfy_topic'],
            $title,
            $body,
            [
                'project' => $project['name'],
                'url' => $pageUrl,
                'visitor_id' => $visitor['id'] ?? null,
            ]
        );
    }
}

/**
 * Send notification via ntfy.sh
 *
 * @param string $topic ntfy topic
 * @param string $title Notification title
 * @param string $message Notification body
 * @param array $extras Additional data
 */
function sendNtfyNotification(string $topic, string $title, string $message, array $extras = []): void
{
    $url = "https://ntfy.sh/{$topic}";

    $headers = [
        'Title: ' . $title,
        'Priority: default',
        'Tags: eyes,bust_in_silhouette',
    ];

    // Add click action if URL provided
    if (!empty($extras['url'])) {
        $headers[] = 'Click: ' . $extras['url'];
    }

    // Add actions
    $headers[] = 'Actions: view, Öppna dashboard, https://qrplan.se/visitors/';

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $message,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
    ]);

    $result = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        error_log("ntfy notification failed: {$error}");
    }
}

/**
 * Get VAPID public key for browser push
 *
 * @return string|null VAPID public key
 */
function getVapidPublicKey(): ?string
{
    // Load from config if available
    if (defined('VAPID_PUBLIC_KEY')) {
        return VAPID_PUBLIC_KEY;
    }
    return null;
}
