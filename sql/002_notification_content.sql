-- Notification Content Configuration
-- Version: 1.0.1
-- Migration: 002

USE livechat;

-- Add notification content fields to projects table
ALTER TABLE projects
    ADD COLUMN notify_include_url TINYINT(1) DEFAULT 1 AFTER ntfy_topic,
    ADD COLUMN notify_include_title TINYINT(1) DEFAULT 1 AFTER notify_include_url,
    ADD COLUMN notify_include_ip TINYINT(1) DEFAULT 0 AFTER notify_include_title,
    ADD COLUMN notify_include_visitor_id TINYINT(1) DEFAULT 0 AFTER notify_include_ip;

-- Update sample projects with defaults
UPDATE projects SET
    notify_include_url = 1,
    notify_include_title = 1,
    notify_include_ip = 0,
    notify_include_visitor_id = 0;
