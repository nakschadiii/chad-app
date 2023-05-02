pm2 stop app
git pull https://github.com/nakschadiii/chad-app.git master
mysql -u root
use database cosmo
source users.sql
pm2 start app