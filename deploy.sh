git pull
npm install --include dev
npm run build:ssr
pm2 restart coinsect_frontend
