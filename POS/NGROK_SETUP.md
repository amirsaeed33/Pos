# 🌐 Deploy POS with ngrok

## What is ngrok?
ngrok creates a secure tunnel from the internet to your local machine, allowing you to share your Angular app with anyone online.

---

## 📋 Prerequisites

1. **Node.js and Angular** (already installed ✅)
2. **ngrok account** (free) - Sign up at https://ngrok.com

---

## 🚀 Step-by-Step Setup

### **Step 1: Install ngrok**

#### Option A: Download ngrok manually
1. Go to https://ngrok.com/download
2. Download for Windows
3. Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
4. Add to PATH or use full path

#### Option B: Install via npm (Recommended)
```bash
npm install -g ngrok
```

---

### **Step 2: Sign up for ngrok Account**

1. Go to https://dashboard.ngrok.com/signup
2. Create a free account
3. After login, go to https://dashboard.ngrok.com/get-started/your-authtoken
4. Copy your authtoken

---

### **Step 3: Configure ngrok with your authtoken**

Run this command (replace `YOUR_AUTH_TOKEN` with your actual token):

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

---

### **Step 4: Start Your Angular App**

```bash
cd E:\Github\POS\POS
ng serve
```

Wait for it to compile. It should be running at `http://localhost:4200`

---

### **Step 5: Start ngrok Tunnel**

Open a **NEW** terminal/PowerShell window and run:

```bash
ngrok http 4200
```

---

## ✅ You're Live!

ngrok will show you something like:

```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok.app -> http://localhost:4200
Web Interface                 http://127.0.0.1:4040

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Your public URL:** `https://abc123.ngrok.app`

Share this URL with anyone - they can access your POS app!

---

## 🎯 Quick Commands

### Start Everything:

**Terminal 1 - Angular:**
```bash
cd E:\Github\POS\POS
ng serve
```

**Terminal 2 - ngrok:**
```bash
ngrok http 4200
```

---

## 🔒 Security Tips

### **1. Add Basic Authentication (Optional)**

If using ngrok paid plan, you can add password protection:

```bash
ngrok http 4200 --basic-auth "username:password"
```

### **2. Custom Domain (Paid Plan)**

```bash
ngrok http 4200 --domain=your-custom-domain.ngrok.app
```

### **3. View Traffic**

ngrok provides a web interface at `http://127.0.0.1:4040` to inspect all requests.

---

## 📱 Access from Mobile

1. Start ngrok as shown above
2. Copy the `https://` URL
3. Open on any mobile browser
4. Your POS app is fully responsive!

---

## ⚙️ Advanced: Run in Background

### Windows:

**Create a script `start-ngrok.bat`:**
```batch
@echo off
start "Angular Server" cmd /k "cd /d E:\Github\POS\POS && ng serve"
timeout /t 10
start "ngrok Tunnel" cmd /k "ngrok http 4200"
```

Double-click this batch file to start both servers.

---

## 🛠️ Troubleshooting

### **Issue 1: ngrok not found**
```bash
# Install globally
npm install -g ngrok

# Or use npx
npx ngrok http 4200
```

### **Issue 2: Port already in use**
```bash
# Kill the process on port 4200
netstat -ano | findstr :4200
taskkill /PID <PID_NUMBER> /F

# Or use a different port
ng serve --port 4300
ngrok http 4300
```

### **Issue 3: Authentication required**
Make sure you've added your authtoken:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### **Issue 4: Tunnel expired (Free Plan)**
Free ngrok tunnels expire after 2 hours. Just restart:
```bash
# Stop ngrok (Ctrl+C)
# Start again
ngrok http 4200
```

---

## 📊 ngrok Dashboard Features

Visit `http://127.0.0.1:4040` while ngrok is running to see:

- **Requests:** All HTTP requests and responses
- **Replay:** Replay any request
- **Status:** Connection status and metrics
- **Logs:** Detailed request/response logs

---

## 🎁 Free vs Paid Plans

### **Free Plan:**
- ✅ Random URLs (e.g., `abc123.ngrok.app`)
- ✅ HTTP & HTTPS
- ✅ 1 online tunnel
- ✅ 40 connections/minute
- ⏰ 2-hour session limit

### **Paid Plans ($8-25/month):**
- ✅ Custom domains
- ✅ Reserved domains
- ✅ No session limits
- ✅ More simultaneous tunnels
- ✅ Basic auth protection

---

## 🌍 Share Your App Worldwide!

Once ngrok is running, anyone can access your POS system:

1. **Share the URL:** `https://abc123.ngrok.app`
2. **Login credentials:**
   - **Admin:** `admin@cxp.com` / `Admin123!`
   - **Shop:** `downtown@mithai.com` / `shop123`

---

## 🔄 Persistent Setup (Optional)

To keep the same URL across sessions (requires paid plan):

```bash
ngrok http 4200 --domain=mypos.ngrok.app
```

---

## 📝 Example Session

```powershell
# Terminal 1 (PowerShell)
PS E:\Github\POS\POS> ng serve
** Angular Live Development Server is listening on localhost:4200 **

# Terminal 2 (PowerShell)
PS C:\Users\YourName> ngrok http 4200

ngrok                                                                   
                                                                        
Session Status                online                                   
Account                       yourname@email.com                       
Version                       3.5.0                                    
Region                        United States (us)                       
Latency                       45ms                                     
Web Interface                 http://127.0.0.1:4040                   
Forwarding                    https://1234-abc-def.ngrok.app -> http://localhost:4200
                                                                        
Connections                   ttl     opn     rt1     rt5     p50     p90
                              5       1       0.01    0.02    24.25   28.50
```

**Your live URL:** `https://1234-abc-def.ngrok.app`

---

## 🎉 Benefits

✅ **Instant Sharing:** No deployment needed  
✅ **HTTPS by Default:** Secure connection  
✅ **Real-time Updates:** Changes reflect immediately  
✅ **Mobile Testing:** Test on real devices  
✅ **Client Demos:** Show work to clients  
✅ **Webhook Testing:** Receive webhooks locally  

---

## 🚨 Important Notes

1. **LocalStorage persists per device** - Each user has their own data
2. **No shared database** - Data changes are device-specific
3. **For production:** Deploy to Vercel, Netlify, or Firebase
4. **ngrok is for development/demo** - Not for permanent hosting

---

## 📞 Support

- ngrok Docs: https://ngrok.com/docs
- ngrok Dashboard: https://dashboard.ngrok.com
- Community: https://github.com/inconshreveable/ngrok

---

Enjoy sharing your POS application! 🚀

