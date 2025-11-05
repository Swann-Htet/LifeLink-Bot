# 🚀 LifeLink Quick Reference Card

## For YOU (The Host)

### 1️⃣ Initial Setup (One Time)

```bash
# Deploy to Ubuntu Droplet
ssh root@your-server-ip
cd /var/www/lifelink
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py  # Test it works

# Configure Nginx + Gunicorn + SSL
# See DEPLOYMENT_GUIDE.md for full instructions
```

### 2️⃣ Your URLs After Deployment

| URL | Purpose |
|-----|---------|
| `https://your-domain.com` | Main chatbot interface |
| `https://your-domain.com/configurator` | Configuration dashboard |
| `https://your-domain.com/widget.js` | Embeddable widget file |
| `https://your-domain.com/chat` | API endpoint for chat |
| `https://your-domain.com/health` | Health check |

### 3️⃣ Share With Website Owners

**Give them these two links:**

1. **Configurator:** `https://your-domain.com/configurator`
   - They customize colors, position, size, branding
   - They get auto-generated embed code

2. **Documentation:** `https://your-domain.com` or GitHub README
   - Installation instructions
   - Customization options
   - Examples

---

## For Website Owners (Your Users)

### 📥 How to Embed (2 Minutes)

#### Step 1: Visit Configurator
```
https://chatbot.yourdomain.com/configurator
```

#### Step 2: Customize Widget
- Pick your brand colors
- Choose position (bottom-right or bottom-left)
- Set button size
- Enter your company name

#### Step 3: Copy Generated Code
```html
<script>
  window.LifeLinkConfig = {
    apiUrl: 'https://chatbot.yourdomain.com',
    primaryColor: '#ff4757',
    buttonColor: '#ffa7c4',
    position: 'bottom-right',
    buttonSize: 56,
    windowWidth: 400,
    windowHeight: 600,
    brandName: 'MyCompany'
  };
</script>
<script src="https://chatbot.yourdomain.com/widget.js"></script>
```

#### Step 4: Paste Before `</body>` Tag
- Open your HTML file
- Find the closing `</body>` tag
- Paste the code just before it
- Save and refresh!

#### Step 5: Done! ✅
The chatbot appears on your website. No backend setup needed!

---

## 🎨 Customization Examples

### Red & White Theme
```javascript
window.LifeLinkConfig = {
  apiUrl: 'https://chatbot.yourdomain.com',
  primaryColor: '#ff0000',
  buttonColor: '#ffcccc',
  brandName: 'RedAlert'
};
```

### Blue Corporate Theme
```javascript
window.LifeLinkConfig = {
  apiUrl: 'https://chatbot.yourdomain.com',
  primaryColor: '#0066cc',
  buttonColor: '#6699ff',
  brandName: 'CorpBlue'
};
```

### Green Safety Theme
```javascript
window.LifeLinkConfig = {
  apiUrl: 'https://chatbot.yourdomain.com',
  primaryColor: '#28a745',
  buttonColor: '#90ee90',
  brandName: 'SafetyFirst'
};
```

### Purple Modern Theme
```javascript
window.LifeLinkConfig = {
  apiUrl: 'https://chatbot.yourdomain.com',
  primaryColor: '#764ba2',
  buttonColor: '#c17eeb',
  brandName: 'ModernCo'
};
```

---

## 🔧 Configuration Options Reference

| Parameter | Type | Default | Range/Options | Description |
|-----------|------|---------|---------------|-------------|
| `apiUrl` | string | *required* | Any URL | Your hosted API server URL |
| `primaryColor` | string | `#ff4757` | Any hex color | Header, buttons, accents |
| `buttonColor` | string | `#ffa7c4` | Any hex color | Floating button color |
| `textColor` | string | `#ffffff` | Any hex color | Text on colored backgrounds |
| `position` | string | `bottom-right` | `bottom-right`, `bottom-left` | Widget position |
| `buttonSize` | number | `56` | 40-80 | Button diameter in pixels |
| `windowWidth` | number | `400` | 300-600 | Chat window width in pixels |
| `windowHeight` | number | `600` | 400-800 | Chat window height in pixels |
| `fontFamily` | string | `Poppins, sans-serif` | Any font | Font family for text |
| `brandName` | string | `SkillFusion` | Any text | Your company/brand name |

---

## 📊 Example Use Cases

### Government Website
```html
<script>
  window.LifeLinkConfig = {
    apiUrl: 'https://chatbot.yourdomain.com',
    primaryColor: '#003366',
    buttonColor: '#5588cc',
    brandName: 'City Emergency Services'
  };
</script>
<script src="https://chatbot.yourdomain.com/widget.js"></script>
```

### News Website
```html
<script>
  window.LifeLinkConfig = {
    apiUrl: 'https://chatbot.yourdomain.com',
    primaryColor: '#c41e3a',
    buttonColor: '#ff6b7a',
    brandName: 'News Network'
  };
</script>
<script src="https://chatbot.yourdomain.com/widget.js"></script>
```

### Healthcare Portal
```html
<script>
  window.LifeLinkConfig = {
    apiUrl: 'https://chatbot.yourdomain.com',
    primaryColor: '#00a86b',
    buttonColor: '#66d9a6',
    brandName: 'Healthcare Hub'
  };
</script>
<script src="https://chatbot.yourdomain.com/widget.js"></script>
```

---

## 🆘 Quick Troubleshooting

### Widget Doesn't Appear
- ✅ Check browser console for errors
- ✅ Verify `apiUrl` is correct
- ✅ Ensure server is running (check `/health` endpoint)
- ✅ Check for CORS errors (Nginx must allow CORS)

### Widget Shows But Doesn't Respond
- ✅ Test `/chat` endpoint directly
- ✅ Check server logs: `journalctl -u lifelink -f`
- ✅ Verify Gemini API key in `.env` file
- ✅ Check network tab in browser DevTools

### Colors Not Working
- ✅ Use valid hex colors (e.g., `#ff4757`)
- ✅ Include the `#` symbol
- ✅ Clear browser cache and refresh

### Button Position Wrong
- ✅ Check CSS conflicts with your website
- ✅ Ensure no `z-index` conflicts
- ✅ Try different position: `bottom-left` or `bottom-right`

---

## 📞 Support & Resources

- 📖 **Full Documentation:** [README.md](README.md)
- 🚀 **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- 💻 **Example Code:** `example_website_with_widget.html`
- 🧪 **Test Page:** `test_embed.html`
- 🌐 **Live Demo:** Open the test files in your browser

---

## 🎯 The Model in a Nutshell

```
┌─────────────────────────────────┐
│  YOU                            │
│  ├── Host on Ubuntu (once)      │
│  ├── Serve widget.js            │
│  └── Provide configurator       │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  Website Owner                  │
│  ├── Visit /configurator        │
│  ├── Customize colors           │
│  ├── Copy embed code            │
│  └── Paste in their website    │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  End User (Visitor)             │
│  ├── Sees chatbot on website    │
│  ├── Clicks floating button     │
│  ├── Gets disaster help         │
│  └── All processing on YOUR API │
└─────────────────────────────────┘
```

**Key Insight:** 
- **You host once** → **Thousands use it** → **Everyone benefits!** 🎉

---

## ✅ Checklist for Going Live

### Before Deployment
- [ ] Ubuntu droplet ready (2GB RAM minimum)
- [ ] Domain name configured (DNS A record)
- [ ] SSH access working
- [ ] `.env` file with Gemini API key ready
- [ ] Files uploaded to server

### During Deployment
- [ ] Python virtual environment created
- [ ] Dependencies installed
- [ ] Gunicorn configured
- [ ] Nginx configured with CORS headers
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Systemd service created
- [ ] Firewall configured (ports 80, 443 open)

### After Deployment
- [ ] Test main interface: `https://your-domain.com`
- [ ] Test configurator: `https://your-domain.com/configurator`
- [ ] Test widget.js: `https://your-domain.com/widget.js`
- [ ] Test health endpoint: `https://your-domain.com/health`
- [ ] Test embedding on example website
- [ ] Share configurator link with users
- [ ] Monitor server logs

---

## 🎉 Success!

Once deployed, your LifeLink chatbot is:
- ✅ **Live** and accessible worldwide
- ✅ **Embeddable** on any website
- ✅ **Customizable** for each website's brand
- ✅ **Centrally managed** by you
- ✅ **Helping people** during disasters

**Share your hosted link and make a difference! 🌍❤️**

---

© 2025 SkillFusion | Made with ❤️ for disaster preparedness
