# TSD Prahova — site + backend înscrieri (PHP/PDO)

## Mutare pe cPanel
1. Urcă tot conținutul repo-ului în `public_html` (fără `Dockerfile`).
2. În cPanel → MySQL Databases: creează baza și utilizatorul.
3. Editează `config.php`: `db_dsn` = `mysql:host=localhost;dbname=USER_tsd;charset=utf8mb4`, `db_user`, `db_pass`, `admin_password`.
4. Tabelul se creează automat la prima înscriere. Admin: `/admin/` (export CSV: `/admin/export.php`).
5. În `config.js` lasă `api:""` (backend pe același domeniu) și completează datele de contact.

Fără MySQL, merge și cu SQLite (implicit, fișier în `data/`, protejat prin `.htaccess`).
