<?php
require __DIR__ . '/auth.php';
session_start(); if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['del']) && hash_equals($_SESSION['csrf'], $_POST['csrf'] ?? '')) { db()->prepare('DELETE FROM submissions WHERE id = ?')->execute([(int)$_POST['del']]); header('Location: ./' . (isset($_GET['kind']) ? '?kind=' . urlencode($_GET['kind']) : '')); exit; }
$kind = $_GET['kind'] ?? null; $list = rows($kind);
$kinds = db()->query('SELECT kind, COUNT(*) n FROM submissions GROUP BY kind ORDER BY kind')->fetchAll(); $tot = array_sum(array_column($kinds, 'n'));
?><!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Admin — TSD Prahova</title>
<style>body{font-family:system-ui,sans-serif;margin:0;color:#111}header{background:#0a0a0a;color:#fff;padding:18px 24px;border-bottom:4px solid #e30613}main{padding:24px}a{color:#e30613}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-bottom:1px solid #e5e5e5;padding:10px 8px;text-align:left;vertical-align:top}th{font-size:12px;text-transform:uppercase;color:#666}.f a{margin-right:12px}.btn{background:#e30613;color:#fff;padding:8px 14px;text-decoration:none;display:inline-block}button{background:none;border:1px solid #ccc;cursor:pointer}</style>
<header><b>TSD Prahova</b> · Înscrieri și mesaje</header><main>
<p class="f"><a href="./">Toate (<?= $tot ?>)</a><?php foreach ($kinds as $k): ?><a href="?kind=<?= urlencode($k['kind']) ?>"><?= e($k['kind']) ?> (<?= $k['n'] ?>)</a><?php endforeach ?>
<a class="btn" href="export.php<?= $kind ? '?kind=' . urlencode($kind) : '' ?>">Export CSV</a></p>
<table><tr><th>#</th><th>Data</th><th>Tip</th><th>Sursă</th><th>Date</th><th></th></tr>
<?php foreach ($list as $r): $d = json_decode($r['data'], true) ?: []; ?><tr><td><?= $r['id'] ?></td><td><?= ro($r['created_at']) ?></td><td><?= e($r['kind']) ?></td><td><?= e($r['source']) ?></td><td><?php foreach ($d as $k => $v) if ($v !== '') echo '<b>' . e($k) . ':</b> ' . e($v) . '<br>'; ?></td>
<td><form method="post" onsubmit="return confirm('Ștergi înregistrarea #<?= $r['id'] ?>?')"><input type="hidden" name="csrf" value="<?= $_SESSION['csrf'] ?>"><button name="del" value="<?= $r['id'] ?>">Șterge</button></form></td></tr><?php endforeach ?>
<?php if (!$list): ?><tr><td colspan="6">Nicio înregistrare încă.</td></tr><?php endif ?></table></main></html>
