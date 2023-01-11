#  api server
local deployment instance required 
nodejs version 16.17.1
mysql version 10.1.40-MariaDB


Step 01
====================================
clone source code from github
git clone https://github.com/BengalSolutions/backend_api.git

Step 02
====================================
rename the .env.example to .env

Step 03
====================================
configure env variable for local environment like
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=

Step 04
====================================
open congfig_development.json from config directory for local deployment
open congfig_production.json from config directory for prodcution deployment

Step 05
====================================
Open terminal in this project directory
run this command below

npm install <br />
npm run migrate <br />
npm start <br />







