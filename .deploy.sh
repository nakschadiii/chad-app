clear
cd /var/www/85.90.245.34/
mysqldump -u root --databases cosmo > return.sql
git pull https://github.com/nakschadiii/chad-app.git master
mysql -u root cosmo < users.sql
pm2 restart app
ls -lr