# 🚀 VS Code Extension - Setup & Installation Guide

## Prerequisites

Before building the extension, ensure you have:

- ✅ Node.js (v18 or higher)
- ✅ npm (comes with Node.js)
- ✅ VS Code (v1.85.0 or higher)
- ✅ vsce (VS Code Extension Manager)

## Quick Setup

### Step 1: Navigate to Extension Directory
```bash
cd d:\LifeLinkChatbot\vscode-extension
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- TypeScript
- VS Code types
- Axios (for API calls)
- ESLint (for linting)
- VS Code Test Runner

### Step 3: Install vsce (if not already installed)
```bash
npm install -g @vscode/vsce
```

### Step 4: Compile TypeScript
```bash
npm run compile
```

This compiles `src/**/*.ts` → `out/**/*.js`

### Step 5: Package the Extension
```bash
npm run package
```

This creates: `lifelink-weather-alert-1.0.0.vsix`

### Step 6: Install Extension
```bash
code --install-extension lifelink-weather-alert-1.0.0.vsix
```

Or install via VS Code:
1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: "Extensions: Install from VSIX..."
4. Select the `.vsix` file

### Step 7: Reload VS Code
Press `Ctrl+Shift+P` and run "Developer: Reload Window"

## 🎉 Done!

You should now see:
- Weather icon in your activity bar (left sidebar)
- Weather info in status bar (bottom)
- Commands available via Command Palette

## 📋 Available Commands

Open Command Palette (`Ctrl+Shift+P`) and try:

- `LifeLink: Show Weather Alert` - Full weather panel
- `LifeLink: Refresh Weather` - Update weather
- `LifeLink: Set Weather Location` - Change location

## ⚙️ Configuration

1. Go to Settings (`Ctrl+,`)
2. Search for "LifeLink Weather"
3. Configure:
   - Location (leave empty for auto-detect)
   - API Key (default included)
   - Update interval
   - Notifications
   - Status bar visibility

## 🧪 Testing in Development

### Method 1: Extension Development Host

1. Open `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. This opens a new VS Code window with the extension loaded
4. Test your extension there

### Method 2: Watch Mode

```bash
npm run watch
```

This watches for changes and recompiles automatically.
Press `F5` to reload the extension.

## 📦 Project Structure

```
vscode-extension/
├── src/
│   ├── extension.ts           ← Main entry point
│   ├── services/
│   │   ├── weatherService.ts  ← Weather API
│   │   └── locationService.ts ← Location detection
│   └── views/
│       └── weatherViewProvider.ts ← Sidebar view
├── out/                       ← Compiled JavaScript (generated)
├── assets/
│   ├── weather-icon.svg      ← Activity bar icon
│   └── images/               ← Weather images
├── node_modules/             ← Dependencies (generated)
├── package.json              ← Extension manifest
├── tsconfig.json             ← TypeScript config
└── README.md                 ← Documentation
```

## 🔧 Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Compile**: `npm run compile` (or `npm run watch`)
3. **Test**: Press `F5` in VS Code
4. **Package**: `npm run package`
5. **Install**: `code --install-extension *.vsix`
6. **Reload**: `Ctrl+Shift+P` → "Reload Window"

## 🐛 Troubleshooting

### Extension Not Loading

**Problem**: Extension doesn't appear after installation

**Solution**:
```bash
# Reinstall
code --uninstall-extension skillfusion.lifelink-weather-alert
code --install-extension lifelink-weather-alert-1.0.0.vsix
# Reload VS Code
```

### Compilation Errors

**Problem**: TypeScript compilation fails

**Solution**:
```bash
# Clean and rebuild
rm -rf out node_modules
npm install
npm run compile
```

### Missing Dependencies

**Problem**: `Cannot find module 'axios'` or similar

**Solution**:
```bash
npm install --save axios
npm install --save-dev @types/node @types/vscode
```

### Weather Not Loading

**Problem**: Weather data doesn't load

**Solution**:
1. Check internet connection
2. Verify API key in settings
3. Check Output panel: View → Output → LifeLink Weather
4. Try manual location entry

## 📤 Publishing to Marketplace

### Prerequisites
1. Create a publisher account: https://marketplace.visualstudio.com/manage
2. Get a Personal Access Token from Azure DevOps

### Steps

1. **Update package.json**:
```json
{
  "publisher": "your-publisher-name",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/repo"
  }
}
```

2. **Login to vsce**:
```bash
vsce login your-publisher-name
```

3. **Publish**:
```bash
vsce publish
```

Or publish specific version:
```bash
vsce publish 1.0.1
```

### Automated Publishing

Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "vsce publish"
  }
}
```

Then run:
```bash
npm run deploy
```

## 🔐 API Keys

### WeatherAPI.com
- **Default key included**: `cf1c17e3399549eb9a5111316250411`
- **Free tier**: 1,000,000 calls/month
- **Get your own**: https://www.weatherapi.com/my/

### Google Gemini (Optional)
- **For enhanced AI recommendations**
- **Get key**: https://makersuite.google.com/app/apikey
- **Add to settings**: `lifelinkWeather.geminiApiKey`

## 📊 Extension Size

After packaging:
- `.vsix` file: ~500 KB
- Includes:
  - Compiled JavaScript
  - Assets (icons, images)
  - Dependencies (axios)
  - README and metadata

## 🎯 Next Steps

1. **Test thoroughly** in Extension Development Host
2. **Add more features** (forecasts, alerts, etc.)
3. **Improve UI** with more animations
4. **Add tests** using VS Code Test Runner
5. **Publish** to VS Code Marketplace
6. **Get feedback** from users
7. **Iterate** and improve

## 💡 Tips

- Use `console.log()` for debugging (check Output panel)
- Press `F5` often to test changes quickly
- Keep API keys in settings, not hardcoded
- Use TypeScript for type safety
- Follow VS Code extension guidelines
- Test on different OS (Windows, Mac, Linux)

## 📚 Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [WeatherAPI Docs](https://www.weatherapi.com/docs/)

## ✅ Checklist

Before publishing:

- [ ] Extension compiles without errors
- [ ] All commands work correctly
- [ ] Weather data loads successfully
- [ ] UI looks good in light/dark themes
- [ ] Settings are properly configured
- [ ] README is complete and accurate
- [ ] CHANGELOG is updated
- [ ] Version number is correct
- [ ] Icons and images are included
- [ ] Extension size is reasonable
- [ ] Tested on multiple OS
- [ ] No hardcoded secrets/keys
- [ ] LICENSE file included

---

**Happy coding!** 🎉

Need help? Create an issue on GitHub or email support@skillfusion.tech
