<?php
require __DIR__ . '/auth.php';
$list = array_reverse(rows($_GET['kind'] ?? null)); $keys = [];
foreach ($list as &$r) { $r['d'] = json_decode($r['data'], true) ?: []; foreach ($r['d'] as $k => $_) $keys[$k] = 1; } unset($r);
header('Content-Type: text/csv; charset=utf-8'); header('Content-Disposition: attachment; filename="tsd-prahova-inscrieri-' . date('Y-m-d') . '.csv"');
$o = fopen('php://output', 'w'); fwrite($o, "\xEF\xBB\xBF");
fputcsv($o, array_merge(['ID', 'Data', 'Tip', 'Sursa'], array_keys($keys)));
foreach ($list as $r) { $row = [$r['id'], ro($r['created_at']), $r['kind'], $r['source']]; foreach ($keys as $k => $_) $row[] = $r['d'][$k] ?? ''; fputcsv($o, $row); }
