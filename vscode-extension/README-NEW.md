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

### 🤖 **AI-Powered Chat**
- Natural conversation with your coding companion
- Get coding help, advice, and motivation
- Context-aware responses powered by LifeLink AI

### 🐾 **Interactive Pet Companion**
- Choose from 5 different pets: Cat 🐱, Dog 🐶, Dragon 🐉, Robot 🤖, Unicorn 🦄
- Watch your pet react to conversations with dynamic animations
- Level up your pet through interactions
- Customize your pet's name and appearance

### 🌤️ **Real-Time Weather Integration**
- Get weather updates directly in chat
- AI-powered weather recommendations
- Status bar weather display
- Auto-location detection

### 💪 **Developer Motivation**
- Random motivational messages
- Coding tips and best practices
- Quick actions for instant help
- Mood-based pet responses

### 🎨 **Beautiful UI**
- Modern gradient design
- Smooth animations
- Responsive chat interface
- Multiple color themes

---

## 🚀 Quick Start

### Installation

1. **Install from VS Code Marketplace** (Coming Soon)
   ```
   Search for "LifeLink CodeBuddy" in VS Code Extensions
   ```

2. **Or Install from VSIX**
   ```bash
   code --install-extension lifelink-codebuddy-2.0.0.vsix
   ```

### First Time Setup

1. **Open CodeBuddy**
   - Click the CodeBuddy icon in the activity bar
   - Or press `Ctrl+Shift+P` and run "CodeBuddy: Show CodeBuddy"

2. **Configure Your Location** (Optional)
   ```
   Ctrl+Shift+P → "CodeBuddy: Set Weather Location"
   Enter your city name
   ```

3. **Configure API** (For AI Chat)
   ```
   Ctrl+Shift+P → "CodeBuddy: Configure Chatbot API"
   Enter: http://localhost:5000 (or your LifeLink server URL)
   ```

4. **Start Chatting!**
   - Type your message in the chat box
   - Ask questions, get help, or just say hi!

---

## 🎮 Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `Show CodeBuddy` | Open the CodeBuddy panel | - |
| `Quick Chat` | Quick chat with CodeBuddy | - |
| `Get Weather` | Fetch current weather | - |
| `Set Weather Location` | Set your location | - |
| `Change Your Pet` | Choose a different pet | - |
| `Motivate Me!` | Get instant motivation | - |
| `Get Coding Tip` | Receive a coding tip | - |
| `Configure Chatbot API` | Set API endpoint | - |

---

## 💬 Chat Examples

### Get Coding Help
```
You: How do I fix a merge conflict?
CodeBuddy: Great question! Let me help you with that...
```

### Weather Updates
```
You: What's the weather like?
CodeBuddy: *shows weather card with current conditions*
```

### Motivation
```
You: I'm feeling stuck on this bug
CodeBuddy: Take a deep breath! 🌟 Every great developer faces challenges...
```

### Quick Actions
- 🌤️ **Weather** - Instant weather update
- ❓ **Help** - Get general help
- 💪 **Motivate** - Boost your mood
- 😄 **Tell Joke** - Hear a coding joke

---

## ⚙️ Configuration

Open VS Code Settings (`Ctrl+,`) and search for "CodeBuddy"

### Available Settings

```json
{
  // Pet Settings
  "lifelinkPet.petType": "cat",  // cat, dog, dragon, robot, unicorn
  "lifelinkPet.petName": "CodeBuddy",
  "lifelinkPet.enableAnimations": true,
  "lifelinkPet.theme": "purple",  // purple, blue, green, pink, dark
  
  // Chat Settings
  "lifelinkPet.chatbotApiUrl": "http://localhost:5000",
  
  // Weather Settings
  "lifelinkPet.location": "New York",
  "lifelinkPet.weatherApiKey": "your-api-key",
  "lifelinkPet.autoWeatherUpdates": true,
  "lifelinkPet.updateInterval": 30,
  
  // Motivation
  "lifelinkPet.showMotivation": true
}
```

---

## 🏗️ Architecture

### Clean Code Structure

```
vscode-extension/
├── src/
│   ├── extension.ts              # Main extension entry
│   ├── models/
│   │   └── Pet.ts                # Pet model & behavior
│   ├── services/
│   │   ├── ChatbotService.ts     # AI chat integration
│   │   ├── weatherService.ts     # Weather API
│   │   └── locationService.ts    # Location detection
│   └── views/
│       └── PetViewProvider.ts    # Webview UI
├── assets/                       # Icons & images
└── package.json                  # Extension manifest
```

### Key Components

**Pet Model** (`Pet.ts`)
- Manages pet state, mood, and level
- Handles interactions and experience
- Provides emoji representations

**ChatbotService** (`ChatbotService.ts`)
- Connects to LifeLink AI backend
- Manages conversation history
- Provides fallback responses

**PetViewProvider** (`PetViewProvider.ts`)
- Renders beautiful chat UI
- Handles user interactions
- Manages webview communication

---

## 🎨 Customization

### Change Your Pet

```
Ctrl+Shift+P → "CodeBuddy: Change Your Pet"
Select from: Cat, Dog, Dragon, Robot, or Unicorn
```

### Choose a Theme

Edit settings:
```json
"lifelinkPet.theme": "blue"  // purple, blue, green, pink, dark
```

### Rename Your Pet

Edit settings:
```json
"lifelinkPet.petName": "MyAwesomePet"
```

---

## 🔌 Integration with LifeLink Backend

CodeBuddy connects to your LifeLink chatbot server for AI responses.

### Setup Backend

1. **Start LifeLink Server**
   ```bash
   cd LifeLinkChatbot
   python app.py
   ```

2. **Configure Extension**
   ```
   Settings → lifelinkPet.chatbotApiUrl → "http://localhost:5000"
   ```

3. **Test Connection**
   - Open CodeBuddy
   - Send a message
   - Watch the AI respond!

---

## 🐛 Troubleshooting

### Chat Not Working

**Check API Connection**
```
1. Verify LifeLink server is running
2. Check API URL in settings
3. Look at VS Code Developer Console (Help → Toggle Developer Tools)
```

**Fallback Mode**
- Extension works offline with rule-based responses
- Upgrade to AI mode by connecting to LifeLink server

### Weather Not Loading

**Set Location Manually**
```
Ctrl+Shift+P → "CodeBuddy: Set Weather Location"
```

**Check API Key**
```
Settings → lifelinkPet.weatherApiKey
```

### Pet Not Animating

**Enable Animations**
```json
"lifelinkPet.enableAnimations": true
```

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

- [ ] More pet types (Fox, Panda, Phoenix)
- [ ] Voice commands
- [ ] Code snippet suggestions
- [ ] GitHub integration
- [ ] Multi-language support
- [ ] Custom pet skins
- [ ] Pet mini-games
- [ ] Productivity tracking

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
