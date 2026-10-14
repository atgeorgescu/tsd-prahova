<?php
$CFG = require __DIR__ . '/../config.php';
function db() {
  global $CFG; static $pdo;
  if ($pdo) return $pdo;
  if (str_starts_with($CFG['db_dsn'], 'sqlite:')) { $d = dirname(substr($CFG['db_dsn'], 7)); if (!is_dir($d)) mkdir($d, 0775, true); }
  $pdo = new PDO($CFG['db_dsn'], $CFG['db_user'], $CFG['db_pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  $drv = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
  $id = $drv === 'mysql' ? 'INT AUTO_INCREMENT PRIMARY KEY' : ($drv === 'pgsql' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT');
  $pdo->exec("CREATE TABLE IF NOT EXISTS submissions (id $id, created_at VARCHAR(25) NOT NULL, kind VARCHAR(60) NOT NULL, source VARCHAR(80), ip_hash VARCHAR(64), data TEXT NOT NULL)" . ($drv === 'mysql' ? ' DEFAULT CHARSET=utf8mb4' : ''));
  return $pdo;
}
