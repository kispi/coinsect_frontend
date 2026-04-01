git pull
npm install --include dev
nvm use 20.11.0 # 최신 버전에서는 localstorage 어쩌고로 빌드가 안 되어서, 깔린 것 중 20.11.0으로 빌드
npm run build:ssr
pm2 restart coinsect_frontend
