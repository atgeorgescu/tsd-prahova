FROM php:8.3-apache
RUN docker-php-ext-install pdo_mysql && a2enmod rewrite headers && sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf
COPY . /var/www/html/
RUN rm -f /var/www/html/Dockerfile && mkdir -p /var/www/html/data && chown -R www-data:www-data /var/www/html/data
CMD sed -i "s/Listen 80/Listen ${PORT:-10000}/" /etc/apache2/ports.conf && sed -i "s/:80>/:${PORT:-10000}>/" /etc/apache2/sites-available/000-default.conf && apache2-foreground
