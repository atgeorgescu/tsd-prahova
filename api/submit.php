<?php
require __DIR__ . '/db.php';
header('Access-Control-Allow-Origin: ' . $CFG['allowed_origin']);
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
function out($c, $a) { http_response_code($c); echo json_encode($a, JSON_UNESCAPED_UNICODE); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false, 'error' => 'Metodă nepermisă']);
$in = json_decode(file_get_contents('php://input', false, null, 0, 60000), true);
if (!is_array($in)) out(400, ['ok' => false, 'error' => 'JSON invalid']);
if (!empty($in['website'])) out(200, ['ok' => true]); // honeypot
$kind = mb_substr(trim((string)($in['kind'] ?? '')), 0, 60);
$data = $in['data'] ?? null;
if ($kind === '' || !is_array($data)) out(400, ['ok' => false, 'error' => 'Date lipsă']);
$clean = [];
foreach (array_slice($data, 0, 40, true) as $k => $v) $clean[mb_substr((string)$k, 0, 80)] = mb_substr(is_scalar($v) ? (string)$v : '', 0, 3000);
if ($kind === 'Adeziune') {
  if (empty($clean['Nume']) || !filter_var($clean['E-mail'] ?? '', FILTER_VALIDATE_EMAIL)) out(400, ['ok' => false, 'error' => 'Nume sau e-mail invalid']);
  if (empty($clean['Acord GDPR'])) out(400, ['ok' => false, 'error' => 'Lipsește acordul GDPR']);
}
$ip = hash('sha256', ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '') . 'tsd');
try {
  $db = db();
  $since = gmdate('Y-m-d\TH:i:s', time() - 3600);
  $st = $db->prepare('SELECT COUNT(*) FROM submissions WHERE ip_hash = ? AND created_at > ?'); $st->execute([$ip, $since]);
  if ($st->fetchColumn() >= 20) out(429, ['ok' => false, 'error' => 'Prea multe trimiteri. Încearcă mai târziu.']);
  $st = $db->prepare('INSERT INTO submissions (created_at, kind, source, ip_hash, data) VALUES (?,?,?,?,?)');
  $st->execute([gmdate('Y-m-d\TH:i:s'), $kind, mb_substr((string)($in['source'] ?? ''), 0, 80), $ip, json_encode($clean, JSON_UNESCAPED_UNICODE)]);
  out(200, ['ok' => true, 'id' => (int)$db->lastInsertId()]);
} catch (Throwable $e) { error_log($e->getMessage()); out(500, ['ok' => false, 'error' => 'Eroare server']); }
