# Setup Guide - Employee Attendance System

## 🎯 Complete Installation & Setup Instructions

### Step 1: Prerequisites Installation

#### Windows Users
1. Download and install Node.js from https://nodejs.org/ (LTS version)
2. Download and install MongoDB Community Edition from https://www.mongodb.com/try/download/community
3. Verify installations:
```powershell
node --version
npm --version
mongod --version
```

#### Mac Users
```bash
# Using Homebrew
brew install node
brew install mongodb-community

# Verify
node --version
npm --version
```

#### Linux Users
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
```

### Step 2: MongoDB Setup

#### Local MongoDB Setup
1. Start MongoDB service:
   - **Windows**: MongoDB should run as a service automatically
   - **Mac/Linux**: Run `mongod` in terminal
2. Verify MongoDB is running on `mongodb://localhost:27017`

#### MongoDB Atlas (Cloud Alternative)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Use in `.env` file: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_system`

### Step 3: Backend Setup

1. **Clone or navigate to project**
```powershell
cd "c:\Users\korra\OneDrive\Desktop\a\attendance-system\backend"
```

2. **Install dependencies**
```powershell
npm install
```

3. **Create .env file**
```powershell
Copy-Item .env.example .env
# Edit .env with your text editor (VS Code recommended)
```

4. **Update .env file with:**
```env
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123!@#$%^&*()
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. **Seed database with sample data**
```powershell
npm run seed
```

Expected output:
```
MongoDB Connected: localhost
Cleared existing data
Created 6 users
Created X attendance records
Database seeded successfully!
```

6. **Start backend server**
```powershell
npm run dev
```

Expected output:
```
Server running on port 5000
Environment: development
```

### Step 4: Frontend Setup

1. **In new terminal, navigate to frontend**
```powershell
cd "c:\Users\korra\OneDrive\Desktop\a\attendance-system\frontend"
```

2. **Install dependencies**
```powershell
npm install
```

3. **Create .env file**
```powershell
Copy-Item .env.example .env
```

4. **Frontend .env file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Start frontend development server**
```powershell
npm start
```

Expected output:
```
Compiled successfully!
You can now view attendance-system-frontend in the browser.
Local:            http://localhost:3000
```

## 🧪 Testing the Application

### Test Accounts

**Manager Account:**
- Email: `manager@company.com`
- Password: `password123`
- Access: Manager Dashboard, View all employees, Generate reports

**Employee Accounts:**
- Email: `alice@company.com` / Password: `password123`
- Email: `bob@company.com` / Password: `password123`
- Email: `carol@company.com` / Password: `password123`
- Email: `david@company.com` / Password: `password123`
- Email: `eva@company.com` / Password: `password123`

### Quick Test Workflow

1. **Employee Workflow:**
   - Login with alice@company.com
   - Click "Mark Attendance" → "Check In"
   - Click "Check Out" after some time
   - View "Attendance History" to see calendar
   - Go to "Dashboard" to see stats

2. **Manager Workflow:**
   - Login with manager@company.com
   - View "Dashboard" for team overview
   - Check "All Employees" to see everyone's status
   - Generate "Reports" with date range
   - Export to CSV

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: Error connecting to mongodb
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify MongoDB is on port 27017

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port in .env
PORT=5001
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure FRONTEND_URL in backend .env is correct
- Both frontend and backend are running
- Clear browser cache (Ctrl+Shift+Delete)

### Dependencies Installation Issues
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -r node_modules

# Reinstall
npm install
```

## 📱 Browser Access

### Local Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📊 Available Pages

### Employee Pages
- `/employee-dashboard` - Main dashboard with stats
- `/mark-attendance` - Check in/out interface
- `/attendance-history` - Calendar and history view
- `/profile` - User profile (optional feature)

### Manager Pages
- `/manager-dashboard` - Team overview and analytics
- `/all-employees` - View all employees attendance
- `/reports` - Generate attendance reports

## 💾 Database Management

### View MongoDB Data
```powershell
# Connect to MongoDB
mongosh

# Select database
use attendance_system

# View collections
show collections

# View users
db.users.find()

# View attendance
db.attendances.find()
```

### Reset Database
```powershell
# Connect to MongoDB
mongosh

# Delete database
use attendance_system
db.dropDatabase()
```

Then re-run seed script:
```powershell
npm run seed
```

## 🚀 Deployment Preparation

### Backend Deployment (No Docker)

Below are common production deployment approaches that do not use Docker. Choose the one that fits your environment.

Option A — Linux server (systemd + PM2 + Nginx reverse proxy):

1. SSH into your server and install Node.js and NPM.
2. Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd attendance-system/backend
npm ci --production
```

3. Create and edit the production environment file:

```bash
cp .env.example .env
# Edit .env and set:
# NODE_ENV=production
# MONGODB_URI=<your_production_mongo_uri>
# JWT_SECRET=<your_strong_random_secret>
# PORT=5000
# FRONTEND_URL=<your_frontend_url>
```

4. Install PM2 to keep the process running (global install):

```bash
npm install -g pm2
pm2 start server.js --name attendance-backend
pm2 save
```

5. (Optional) Configure Nginx as a reverse proxy to serve HTTPS and forward requests to the Node.js app on `localhost:5000`.

Example `nginx` site config (Ubuntu `/etc/nginx/sites-available/attendance`):

```nginx
server {
   listen 80;
   server_name your-domain.com;

   location / {
      proxy_pass http://127.0.0.1:5000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
   }
}
```

Then enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/attendance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Option B — Windows Server (PM2 / IIS reverse proxy):

1. Install Node.js on Windows, clone repo and run `npm install` in `backend`.
2. Install `pm2-windows-service` or use `pm2` with Windows support to run as a service.
3. Configure IIS as a reverse proxy or use a cloud load balancer to forward traffic to the app port.

Option C — Platform-as-a-Service (no container required):

- Heroku, Render, Railway: these platforms build and run Node apps without Docker by default. Create the app and push your repository. Set environment variables via the platform UI.

### Frontend Deployment (No Docker)

Option A — Static hosting (recommended):

1. Build the production bundle locally:

```powershell
cd frontend
npm ci
npm run build
```

2. Upload the `frontend/build` folder to a static host (Netlify, Vercel, S3+CloudFront, or any static hosting).

3. Ensure the hosted frontend uses the production API URL (set `REACT_APP_API_URL` in the frontend build environment or adjust code/config accordingly).

Option B — Serve via web server on your own server (e.g., Nginx):

1. Build the frontend as above.
2. Copy the `build` folder to your server, e.g. `/var/www/attendance-frontend`.
3. Create an Nginx configuration to serve the static files and optionally proxy API requests to the backend.

Example Nginx static site block (serve static files and proxy `/api`):

```nginx
server {
   listen 80;
   server_name frontend.your-domain.com;

   root /var/www/attendance-frontend;
   index index.html;

   location /api/ {
      proxy_pass http://backend.your-domain.com/;
   }

   location / {
      try_files $uri /index.html;
   }
}
```

Notes:

- Always set `NODE_ENV=production` for the backend and use a strong `JWT_SECRET` in `backend/.env` (do not commit it).
- If you use a managed hosting provider (Vercel/Netlify) for the frontend and a managed MongoDB (Atlas) for the DB, typically you won't need to run your own web server.
- Use Let's Encrypt (Certbot) to obtain TLS certificates for Nginx and keep them renewed automatically.


## 📝 Common Commands

### Backend Commands
```powershell
npm install          # Install dependencies
npm run dev         # Start development server
npm run seed        # Seed database
npm start           # Start production server
```

### Frontend Commands
```powershell
npm install         # Install dependencies
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## 🆘 Getting Help

1. Check the main README.md for detailed information
2. Review backend error logs in terminal
3. Check browser console for frontend errors (F12)
4. Verify .env files are properly configured
5. Ensure all services (MongoDB, Node) are running

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] .env files created and configured in both folders
- [ ] Database seeded successfully (`npm run seed`)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with test credentials
- [ ] Can perform check in/out
- [ ] Can view attendance history
- [ ] Manager can view all employees

## 🎉 Next Steps

1. Customize branding and colors in CSS files
2. Add more fields to user model if needed
3. Implement email notifications
4. Add biometric authentication
5. Deploy to production
6. Monitor application performance

---

**Setup completed! Happy tracking! 🎊**
