<?php
/**
 * Visitor Tracker - Landing Page
 *
 * Redirects to dashboard or shows API status.
 */

// If requesting root, show simple status page
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visitor Tracker</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .subtitle { color: #64b5f6; margin-bottom: 2rem; }
        .status {
            background: rgba(255,255,255,0.1);
            padding: 1.5rem 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        .status-ok { color: #4caf50; }
        .links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .links a {
            background: #1976d2;
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            transition: background 0.2s;
        }
        .links a:hover { background: #1565c0; }
        .footer {
            position: fixed;
            bottom: 1rem;
            width: 100%;
            text-align: center;
            color: #666;
            font-size: 0.875rem;
        }
        .footer a { color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Visitor Tracker</h1>
        <p class="subtitle">Real-time visitor notifications</p>

        <div class="status">
            <p class="status-ok">&#10003; API Online</p>
        </div>

        <div class="links">
            <a href="/api/">API Status</a>
            <a href="/dashboard/">Dashboard</a>
            <a href="/api/visitors/">Aktiva besokare</a>
            <a href="/api/projects/">Projekt</a>
        </div>
    </div>

    <div class="footer">
        Design - Hosting - Copyright &copy; <?= date('Y') ?>
        <a href="https://www.nahe.se/" target="_blank">NAHE Consulting</a>
    </div>
</body>
</html>
