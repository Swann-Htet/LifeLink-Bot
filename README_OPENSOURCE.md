# 🚨 LifeLink - AI-Powered Disaster Response Chatbot Widget

[![Open Source](https://img.shields.io/badge/Open%20Source-Free%20Forever-green)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini%202.0-orange)](https://ai.google.dev)

**LifeLink** is a free, open-source, embeddable chatbot widget that provides instant AI-powered disaster response guidance. Built with Google Gemini 2.0 Flash AI and designed to save lives during emergencies.

---

## ✨ Features

- 🤖 **AI-Powered Responses** - Google Gemini 2.0 Flash for intelligent disaster guidance
- 🎨 **Fully Customizable** - Colors, position, and branding to match your website
- 🔧 **Easy Integration** - Just 2 lines of code to add to your website
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌐 **Zero Backend Required** - Hosted widget, no server setup needed
- 🆓 **Completely Free** - Open source and free forever
- ⚡ **Fast & Lightweight** - Loads instantly, minimal impact on your site
- 🔒 **Secure HTTPS** - Trusted SSL certificate from Let's Encrypt
- 🌍 **Works Everywhere** - Embed on any website, any domain

---

## 🚀 Quick Start (2 Minutes)

### Step 1: Get Your Embed Code

Visit the **Widget Configurator**: https://eng.skillfusion.tech/configurator

1. Choose your colors (Primary & Button)
2. Select button position (bottom-right or bottom-left)
3. Click "Load Live Demo" to preview
4. Copy the generated embed code

### Step 2: Add to Your Website

Paste this code **before the closing `</body>` tag** in your HTML:

```html
<!-- LifeLink Disaster Response Chatbot -->
<script>
  window.LifeLinkConfig = {
    primaryColor: '#331013',
    buttonColor: '#9b224a',
    position: 'bottom-right'
  };
</script>
<script src="https://eng.skillfusion.tech/widget.js?v=2.0"></script>
```

### Step 3: Done! 🎉

The chatbot widget will appear on your website immediately.

---

## 📝 Configuration Options

### Basic Configuration

```javascript
window.LifeLinkConfig = {
  primaryColor: '#331013',   // Header & message bubble color
  buttonColor: '#9b224a',    // Floating button color
  position: 'bottom-right'   // 'bottom-right' or 'bottom-left'
};
```

### All Available Options

```javascript
window.LifeLinkConfig = {
  primaryColor: '#331013',      // Header background and user message bubbles
  buttonColor: '#9b224a',       // Floating chat button color
  textColor: '#ffffff',         // Text color (default: white)
  position: 'bottom-right',     // Button position: 'bottom-right' or 'bottom-left'
  buttonSize: 56,               // Button size in pixels (default: 56)
  windowWidth: 400,             // Chat window width in pixels (default: 400)
  windowHeight: 600             // Chat window height in pixels (default: 600)
};
```

**Note:** `apiUrl` is automatically detected from the widget source. You don't need to specify it!

---

## 🎨 Customization Examples

### Example 1: Red Theme (Emergency)
```javascript
window.LifeLinkConfig = {
  primaryColor: '#dc3545',
  buttonColor: '#c82333',
  position: 'bottom-right'
};
```

### Example 2: Blue Theme (Professional)
```javascript
window.LifeLinkConfig = {
  primaryColor: '#007bff',
  buttonColor: '#0056b3',
  position: 'bottom-left'
};
```

### Example 3: Green Theme (Safety)
```javascript
window.LifeLinkConfig = {
  primaryColor: '#28a745',
  buttonColor: '#218838',
  position: 'bottom-right'
};
```

---

## 🌟 Live Examples

- **Configurator:** https://eng.skillfusion.tech/configurator
- **Full Demo:** https://eng.skillfusion.tech/example_website_with_widget.html
- **Debug Tool:** https://eng.skillfusion.tech/debug_widget.html
- **Main Chatbot:** https://eng.skillfusion.tech

---

## 🏗️ Self-Hosting (Advanced)

Want to host the widget on your own server? Follow these steps:

### Prerequisites
- Ubuntu Server 22.04+
- Python 3.10+
- NGINX
- SSL Certificate (Let's Encrypt recommended)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/lifelink-chatbot.git
cd lifelink-chatbot
```

2. **Install dependencies:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
export GEMINI_API_KEY="your-google-gemini-api-key"
```

4. **Run the application:**
```bash
gunicorn --workers 2 --bind 0.0.0.0:5000 app:app
```

5. **Configure NGINX:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /widget.js {
        proxy_pass http://localhost:5000/widget.js;
        add_header Access-Control-Allow-Origin *;
    }
}
```

6. **Install SSL with Certbot:**
```bash
sudo certbot --nginx -d your-domain.com
```

### Update Widget URL

After self-hosting, update the embed code to use your domain:

```html
<script src="https://your-domain.com/widget.js?v=2.0"></script>
```

---

## 🛠️ Development

### Project Structure

```
lifelink-chatbot/
├── app.py                          # Flask application
├── chatbot.py                      # AI chatbot logic
├── widget.js                       # Embeddable widget (client-side)
├── requirements.txt                # Python dependencies
├── disaster_knowledge_extended.json # Disaster response knowledge base
├── templates/
│   ├── index.html                  # Main chatbot interface
│   ├── configurator.html           # Widget customization tool
│   └── ...
├── debug_widget.html               # Debugging interface
└── README.md                       # This file
```

### Technologies Used

- **Backend:** Flask (Python), Google Gemini 2.0 Flash AI
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Web Server:** NGINX
- **SSL:** Let's Encrypt
- **Icons:** Font Awesome 6.5.1
- **Fonts:** Google Fonts (Poppins)

---

## 📚 API Documentation

### Chat Endpoint

**POST** `/chat`

**Request:**
```json
{
  "message": "Earthquake safety",
  "session_id": "unique-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI-generated disaster response guidance..."
}
```

### Widget Configuration Endpoint (Optional)

**GET** `/widget-config/{config_id}`

Returns saved widget configuration for pre-configured widgets.

---

## 🌍 Use Cases

- **Government Websites** - Provide emergency guidance to citizens
- **Schools & Universities** - Safety information for students
- **Hospitals** - Emergency response protocols
- **Community Centers** - Disaster preparedness resources
- **News Websites** - Live disaster assistance during events
- **NGOs** - Humanitarian aid and guidance
- **Corporate Websites** - Employee safety during emergencies

---

## 🔧 Troubleshooting

### Widget Not Appearing?

1. **Clear browser cache** - Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. **Check console** - Press `F12` and look for errors
3. **Verify script URL** - Make sure it's `https://eng.skillfusion.tech/widget.js?v=2.0`
4. **Use debug tool** - Visit https://eng.skillfusion.tech/debug_widget.html

### Icons Not Loading?

The widget has **multiple CDN fallbacks** built-in:
- Primary: Cloudflare CDN
- Fallback: jsDelivr CDN

If icons still don't load, check if your ad blocker is interfering.

### Connection Error?

1. **Check API URL detection** - Open console, look for: "LifeLink Widget v2.0: Initializing with API URL: https://eng.skillfusion.tech"
2. **Test API** - Visit https://eng.skillfusion.tech/debug_widget.html and click "Test API Connection"
3. **CORS issues** - CORS is pre-configured on eng.skillfusion.tech

For more help, see [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/lifelink-chatbot.git
cd lifelink-chatbot

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

Visit http://localhost:5000 to see your local version.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 SkillFusion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powering intelligent disaster responses
- **Font Awesome** - For beautiful icons
- **Let's Encrypt** - For free SSL certificates
- **Open Source Community** - For making this possible

---

## 📞 Support

- **Website:** https://eng.skillfusion.tech
- **Configurator:** https://eng.skillfusion.tech/configurator
- **Debug Tool:** https://eng.skillfusion.tech/debug_widget.html
- **GitHub Issues:** https://github.com/yourusername/lifelink-chatbot/issues

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Offline mode with service workers
- [ ] Mobile app (iOS & Android)
- [ ] SMS integration
- [ ] Emergency contact integration
- [ ] Location-based alerts
- [ ] Customizable disaster types

---

## ⭐ Show Your Support

If LifeLink helps your organization or saves even one life, please give us a ⭐️ on GitHub!

**Built with ❤️ by SkillFusion** | Saving Lives Through Technology

---

**🚨 Remember: In a real emergency, always call your local emergency services first (911, 112, etc.)**
