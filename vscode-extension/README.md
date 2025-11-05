# 🐱 LifeLink CodeBuddy - Your AI Coding Companion

<div align="center">

![CodeBuddy Banner](https://img.shields.io/badge/CodeBuddy-AI%20Pet%20Companion-purple?style=for-the-badge)
![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-brightgreen?style=for-the-badge)

**An interactive AI-powered pet chatbot that makes coding more fun!**

Inspired by VS Code Pets and Coding Pet, but with revolutionary AI chat capabilities.

</div>

---

## ✨ Features

### 🌤️ **Smart Weather Updates**
- **Auto notifications 3 times daily** (8 AM, 2 PM, 8 PM)
- **Smart reminders** - "Don't forget your umbrella!" on rainy days
- **Beautiful weather display** with professional Tabler Icons
- **Live updates** directly in your VS Code sidebar

### � **Auto-Location Detection**
- **No manual setup needed** - Automatically detects your location
- **Accurate weather** based on your actual location
- **Privacy-friendly** using IP-based geolocation

### � **Beautiful Animations**
- **p5.js weather effects** - See rain, snow, and sunshine
- **Floating particles** - Interactive weather visualizations
- **Manrope font** - Clean, modern typography
- **Weather photos** - Stunning imagery for each condition

### ⚡ **Quick & Easy**
- **One-time setup** - Just enter your name, we handle the rest
- **Explorer sidebar** - No extra panels cluttering your workspace
- **Lightweight** - Minimal performance impact
- **Always ready** - Status bar shows current weather at a glance

### � **Developer-Friendly**
- **Non-intrusive** - Works in the background
- **Customizable** - Adjust notification times and preferences
- **Real weather data** - Powered by OpenWeatherMap API
- **Open source** - MIT licensed, contribute on GitHub!

---

## 🚀 Quick Start

### Installation

1. **Install from VS Code Marketplace**
   - Open VS Code
   - Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
   - Search for "LifeLink's Buddy"
   - Click **Install**

2. **First Time Setup** (Takes 10 seconds!)
   - Open **Explorer** sidebar (Ctrl+Shift+E)
   - Find **"LifeLink's Buddy"** dropdown
   - Click **"Let's Get Started"**
   - Enter your name
   - Done! Location detected automatically ✨

3. **That's it!**
   - Weather updates appear 3x daily
   - Check weather anytime in Explorer sidebar
   - See current conditions in status bar

---

## 🎮 Commands

Access via Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)

| Command | Description |
|---------|-------------|
| `Show CodeBuddy` | Open LifeLink's Buddy panel |
| `Get Weather` | Refresh current weather |
| `Set Weather Location` | Change your location manually |

---

## � Screenshots

### Setup Screen
Beautiful onboarding with animated weather particles:
- One-time setup
- Auto-location detection
- Friendly welcome message

### Weather Display
See current conditions at a glance:
- Temperature with icon
- Weather description
- Location indicator
- Humidity, wind speed, and more
- Stunning weather photography
- Animated weather effects

### Smart Notifications
Get helpful reminders 3x daily:
- Morning: "Good morning! Sunny day ahead ☀️"
- Afternoon: "Rainy weather - don't forget your umbrella! ☔"
- Evening: "Chilly tonight, wrap up warm! 🧥"

---

## ⚙️ Configuration

Open VS Code Settings (`Ctrl+,` or `Cmd+,`) and search for "LifeLink"

### Available Settings

```json
{
  // Your friendly buddy's name
  "lifelinkPet.petName": "Buddy",
  
  // Your location (auto-detected by default)
  "lifelinkPet.location": "New York",
  
  // OpenWeatherMap API key (included by default)
  "lifelinkPet.weatherApiKey": "your-api-key",
  
  // Enable/disable weather animations
  "lifelinkPet.enableAnimations": true
}
```

### Get Your Own API Key (Optional)

The extension includes a free API key, but for better reliability:

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get your API key
4. Add to settings: `lifelinkPet.weatherApiKey`

---

## 🏗️ How It Works

### Clean Architecture

**Weather Service** (`weatherService.ts`)
- Fetches real-time weather from OpenWeatherMap
- Caches data to minimize API calls
- Provides formatted weather information

**Location Service** (`locationService.ts`)
- Auto-detects location via IP geolocation
- Provides city, country, and coordinates
- Privacy-friendly (no GPS required)

**View Provider** (`PetViewProvider.ts`)
- Beautiful webview UI with animations
- Handles user interactions
- Displays weather with Tabler Icons

**Extension** (`extension.ts`)
- Schedules 3x daily notifications
- Manages status bar updates
- Coordinates all services

---

## 🎨 Customization

### Change Buddy's Name

Settings → Search "lifelinkPet.petName"
```json
"lifelinkPet.petName": "Sunny"  // Or any name you like!
```

### Set Custom Location

Settings → Search "lifelinkPet.location"
```json
"lifelinkPet.location": "London"  // Any city worldwide
```

### Disable Animations (for performance)

Settings → Search "lifelinkPet.enableAnimations"
```json
"lifelinkPet.enableAnimations": false
```

---

## 🌍 Privacy & Data

**Your Privacy Matters**

- ✅ **No tracking** - We don't collect any personal data
- ✅ **No account required** - Works instantly after install
- ✅ **Local storage only** - Settings saved in VS Code
- ✅ **IP-based location** - No GPS, no precise tracking
- ✅ **Open source** - Audit the code yourself!

**What Data We Use:**
- Your IP address (to detect city for weather)
- Your chosen name (stored locally)
- Weather API calls (anonymous, via OpenWeatherMap)

---

## 🐛 Troubleshooting

### Weather Not Loading

**Solution 1: Manual Location**
```
Ctrl+Shift+P → "Set Weather Location"
Enter your city name
```

**Solution 2: Check API Key**
- Settings → Search "weatherApiKey"
- Make sure it's not empty
- Get free key from [OpenWeatherMap](https://openweathermap.org/api)

### Extension Not Showing

**Solution: Check Explorer Sidebar**
```
1. Press Ctrl+Shift+E (or Cmd+Shift+E on Mac)
2. Look for "LifeLink's Buddy" dropdown
3. Click to expand
```

### Animations Not Working

**Solution: Enable in Settings**
```json
"lifelinkPet.enableAnimations": true
```

### Still Having Issues?

- Open an issue on [GitHub](https://github.com/skillfusion/lifelink-codebuddy/issues)
- Check [Discussions](https://github.com/skillfusion/lifelink-codebuddy/discussions)
- Email: support@skillfusion.com

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📝 Development

### Build Extension

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile)
npm run watch

# Package extension
npm run package
```

### Test Extension

1. Press `F5` in VS Code
2. A new Extension Development Host window opens
3. Test your changes
4. Check Debug Console for logs

---

## 🌟 Roadmap

**Planned Features:**

- [ ] 📅 **Weekly weather forecast** - Plan your week ahead
- [ ] 🌡️ **Temperature alerts** - Get notified of extreme weather
- [ ] 🌍 **Multi-location support** - Track weather in multiple cities
- [ ] 🎨 **Custom themes** - Choose your favorite colors
- [ ] 📊 **Weather history** - See past conditions
- [ ] 🗣️ **Multi-language** - Support for more languages
- [ ] 🔔 **Custom notification times** - Set your own schedule
- [ ] 📱 **Mobile companion app** - Sync across devices

**Vote for features on [GitHub Discussions](https://github.com/skillfusion/lifelink-codebuddy/discussions)!**

---

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Inspired by [VS Code Pets](https://github.com/tonybaloney/vscode-pets)
- Inspired by [Coding Pet](https://marketplace.visualstudio.com/items?itemName=codingpet.codingpet)
- Weather data from [OpenWeatherMap](https://openweathermap.org/)
- AI powered by Google Gemini

---

## 📧 Support

- 📫 Email: support@skillfusion.com
- 🐛 Issues: [GitHub Issues](https://github.com/skillfusion/lifelink-codebuddy/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/skillfusion/lifelink-codebuddy/discussions)

---

<div align="center">

**Made with ❤️ by SkillFusion**

*Happy Coding with your new buddy!* 🐱🚀

</div>
