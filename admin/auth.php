<?php
require __DIR__ . '/../api/db.php';
$u = $_SERVER['PHP_AUTH_USER'] ?? ''; $p = $_SERVER['PHP_AUTH_PW'] ?? '';
if (!$u && !empty($_SERVER['HTTP_AUTHORIZATION']) && stripos($_SERVER['HTTP_AUTHORIZATION'], 'basic ') === 0) [$u, $p] = array_pad(explode(':', base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)), 2), 2, '');
if (!hash_equals($CFG['admin_user'], $u) || !hash_equals($CFG['admin_password'], $p) || $CFG['admin_password'] === 'SCHIMBA-ACEASTA-PAROLA') {
  header('WWW-Authenticate: Basic realm="TSD Prahova admin"'); http_response_code(401); exit('Autentificare necesară');
}
function rows($kind = null) { $q = $kind ? db()->prepare('SELECT * FROM submissions WHERE kind = ? ORDER BY id DESC') : db()->prepare('SELECT * FROM submissions ORDER BY id DESC'); $q->execute($kind ? [$kind] : []); return $q->fetchAll(); }
function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function ro($t) { $d = new DateTime($t, new DateTimeZone('UTC')); $d->setTimezone(new DateTimeZone('Europe/Bucharest')); return $d->format('d.m.Y H:i'); }
