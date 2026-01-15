-- Visitor Tracker Database Schema
-- Version: 1.0.0
-- Created: 2026-01-15

CREATE DATABASE IF NOT EXISTS livechat
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE livechat;

-- ============================================================================
-- Projects - Sites being tracked
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    enabled TINYINT(1) DEFAULT 1,

    -- Notification settings
    notification_browser TINYINT(1) DEFAULT 1,
    notification_ntfy TINYINT(1) DEFAULT 0,
    notification_sound TINYINT(1) DEFAULT 1,
    ntfy_topic VARCHAR(255) DEFAULT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_domain (domain),
    INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Visitors - Identified users (via cookie/IP)
-- ============================================================================
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_token VARCHAR(64) NOT NULL UNIQUE,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    alias VARCHAR(255) DEFAULT NULL,

    -- Timestamps
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_visitor_token (visitor_token),
    INDEX idx_ip (ip_address),
    INDEX idx_last_seen (last_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Visits - Page view tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    visitor_id INT NOT NULL,
    page_url VARCHAR(2048) NOT NULL,
    page_title VARCHAR(512) DEFAULT NULL,

    -- Timing
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exited_at TIMESTAMP DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,

    -- Foreign keys
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,

    -- Indexes for real-time queries
    INDEX idx_project_active (project_id, is_active),
    INDEX idx_visitor_active (visitor_id, is_active),
    INDEX idx_entered (entered_at),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Sample data for testing
-- ============================================================================
INSERT INTO projects (name, domain, enabled, notification_browser, notification_ntfy, notification_sound)
VALUES
    ('QRPlan', 'qrplan.eu', 1, 1, 0, 1),
    ('Swedtrac WC', 'wc.swedtrac.se', 1, 1, 1, 1);
