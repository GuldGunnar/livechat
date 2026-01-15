<?php
/**
 * Database Connection Helper
 *
 * Provides a singleton PDO connection to MySQL database.
 * Configuration is loaded from external config file for security.
 */

declare(strict_types=1);

/**
 * Get PDO database connection (singleton pattern)
 *
 * @return PDO The database connection
 * @throws PDOException If connection fails
 */
function getDB(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        // Load credentials from external config (outside web root)
        require_once 'C:/api_keys/livechat_config.php';

        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_NAME
        );

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            throw new PDOException('Database connection failed');
        }
    }

    return $pdo;
}

/**
 * Execute a query and return all results
 *
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind
 * @return array Query results
 */
function dbQuery(string $sql, array $params = []): array
{
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Execute a query and return single row
 *
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind
 * @return array|null Single row or null
 */
function dbQueryOne(string $sql, array $params = []): ?array
{
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    $result = $stmt->fetch();
    return $result ?: null;
}

/**
 * Execute an INSERT/UPDATE/DELETE query
 *
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind
 * @return int Number of affected rows
 */
function dbExecute(string $sql, array $params = []): int
{
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
}

/**
 * Get the last inserted ID
 *
 * @return string Last insert ID
 */
function dbLastInsertId(): string
{
    return getDB()->lastInsertId();
}

/**
 * Begin a transaction
 */
function dbBeginTransaction(): void
{
    getDB()->beginTransaction();
}

/**
 * Commit a transaction
 */
function dbCommit(): void
{
    getDB()->commit();
}

/**
 * Rollback a transaction
 */
function dbRollback(): void
{
    getDB()->rollBack();
}
