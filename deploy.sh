pm2 stop app
mysqldump -u root --databases cosmo > return.sql
git pull https://github.com/nakschadiii/chad-app.git master
mysql -u root cosmo < users.sql
pm2 start app