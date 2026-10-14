<?php
// TSD Prahova — configurare backend (singurul fișier de editat la mutarea pe cPanel).
// Valorile din variabilele de mediu au prioritate (folosite pe Render).
return [
  // MySQL pe cPanel, de ex.: 'mysql:host=localhost;dbname=cpaneluser_tsd;charset=utf8mb4'
  // Implicit: SQLite într-un fișier din folderul data/ (protejat prin .htaccess)
  'db_dsn'  => getenv('DB_DSN') ?: 'sqlite:' . __DIR__ . '/data/tsd.sqlite',
  'db_user' => getenv('DB_USER') ?: '',
  'db_pass' => getenv('DB_PASS') ?: '',
  'admin_user' => getenv('ADMIN_USER') ?: 'admin',
  'admin_password' => getenv('ADMIN_PASSWORD') ?: 'SCHIMBA-ACEASTA-PAROLA',
  'allowed_origin' => getenv('ALLOWED_ORIGIN') ?: '*',
];
