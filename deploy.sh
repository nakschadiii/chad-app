pm2 stop app
mysqldump -u root -p --databases cosmo > return.sql
git pull https://github.com/nakschadiii/chad-app.git master
mysql -u root -p cosmo < users.sql
pm2 start app