<?php
/**
 * JSON Response Helpers
 *
 * Provides consistent JSON response formatting for the API.
 */

declare(strict_types=1);

// Set up custom error handler to prevent PHP errors from corrupting JSON output
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    $logFile = __DIR__ . '/../logs/php_errors.log';
    $timestamp = date('Y-m-d H:i:s');
    $message = "[$timestamp] PHP Error [$errno]: $errstr in $errfile on line $errline\n";
    @file_put_contents($logFile, $message, FILE_APPEND | LOCK_EX);
    return true;
});

@ini_set('display_errors', '0');
@ini_set('display_startup_errors', '0');

/**
 * Send a JSON response and exit
 *
 * @param mixed $data Data to encode as JSON
 * @param int $code HTTP status code
 */
function jsonResponse($data, int $code = 200): void
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Send a JSON error response and exit
 *
 * @param string $message Error message
 * @param int $code HTTP status code
 * @param array $extra Additional data to include
 */
function jsonError(string $message, int $code = 400, array $extra = []): void
{
    $response = ['error' => $message];
    if (!empty($extra)) {
        $response = array_merge($response, $extra);
    }
    jsonResponse($response, $code);
}

/**
 * Send a JSON success response and exit
 *
 * @param string $message Success message
 * @param array $data Additional data to include
 */
function jsonSuccess(string $message = 'OK', array $data = []): void
{
    $response = ['success' => true, 'message' => $message];
    if (!empty($data)) {
        $response = array_merge($response, $data);
    }
    jsonResponse($response);
}

/**
 * Get JSON input from request body
 *
 * @return array Decoded JSON data
 */
function getJsonInput(): array
{
    $input = file_get_contents('php://input');
    if (empty($input)) {
        return [];
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonError('Invalid JSON input', 400);
    }

    return $data ?? [];
}

/**
 * Validate required fields in input
 *
 * @param array $input Input data
 * @param array $required Required field names
 * @return bool True if valid
 */
function validateRequired(array $input, array $required): bool
{
    $missing = [];
    foreach ($required as $field) {
        if (!isset($input[$field]) || $input[$field] === '') {
            $missing[] = $field;
        }
    }

    if (!empty($missing)) {
        jsonError('Missing required fields: ' . implode(', ', $missing), 400);
    }

    return true;
}

/**
 * Get request method
 *
 * @return string HTTP method (GET, POST, PUT, DELETE, etc.)
 */
function getMethod(): string
{
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

/**
 * Check if request method matches
 *
 * @param string|array $methods Allowed method(s)
 */
function requireMethod($methods): void
{
    $methods = (array) $methods;
    $current = getMethod();

    if (!in_array($current, $methods, true)) {
        jsonError('Method not allowed', 405);
    }
}
