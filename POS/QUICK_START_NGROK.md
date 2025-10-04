# ⚡ Quick Start - Deploy with ngrok

## 🚀 5-Minute Setup

### **Step 1: Install ngrok (One-time)**

```bash
npm install -g ngrok
```

### **Step 2: Get ngrok Token (One-time)**

1. Sign up (free): https://dashboard.ngrok.com/signup
2. Copy your authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run this command with your token:

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### **Step 3: Start Everything**

**Option A - Use Batch Script (Easiest):**
```bash
# Double-click this file:
start-with-ngrok.bat
```

**Option B - Manual:**

Terminal 1 (Angular):
```bash
cd E:\Github\POS\POS
ng serve
```

Terminal 2 (ngrok):
```bash
ngrok http 4200
```

### **Step 4: Share Your Link!**

Look for this in the ngrok window:
```
Forwarding    https://abc123.ngrok.app -> http://localhost:4200
```

**Share:** `https://abc123.ngrok.app`

---

## 🎯 Login Credentials to Share

### **Admin Access:**
- Email: `admin@cxp.com`
- Password: `Admin123!`
- Access: Full dashboard, products, shops, all orders

### **Shop Access:**
- Email: `downtown@mithai.com`
- Password: `shop123`
- Access: Create orders, view own orders only

**Other shops:** `mall@mithai.com` or `suburb@mithai.com` (same password: `shop123`)

---

## 📱 Test on Mobile

1. Get your ngrok URL (e.g., `https://abc123.ngrok.app`)
2. Open on any phone browser
3. App is fully responsive!

---

## 🛑 Stop Everything

- Press `Ctrl+C` in both terminal windows
- Or close the terminal windows

---

## 💡 Tips

1. **Free plan:** URL changes each restart (2-hour sessions)
2. **Paid plan ($8/mo):** Keep same URL forever
3. **Web Interface:** Visit `http://127.0.0.1:4040` to see all requests
4. **Data:** Each device has its own localStorage (data not shared)

---

## ❓ Troubleshooting

**ngrok command not found?**
```bash
npx ngrok http 4200
```

**Port 4200 in use?**
```bash
# Kill existing process
taskkill /F /IM node.exe
# Or use different port
ng serve --port 4300
ngrok http 4300
```

**"ERR_NGROK_108" - Tunnel limit reached?**
- Free plan: Only 1 tunnel at a time
- Stop other ngrok instances
- Or upgrade to paid plan

---

That's it! Your POS app is now live and accessible worldwide! 🌍🎉

