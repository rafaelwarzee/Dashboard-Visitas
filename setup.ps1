mkdir backend
cd backend
npm init -y
npm install express cors axios papaparse dotenv
npm install --save-dev nodemon
New-Item -ItemType File -Name "package.json.new" -Force
mkdir src
New-Item -ItemType File -Name "src\index.js" -Force
cd ..

npx -y create-vite@latest frontend --template react
cd frontend
npm install
npm install recharts axios
cd ..
