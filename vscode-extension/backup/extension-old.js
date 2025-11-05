"use strict";
/**
 * LifeLink CodeBuddy Extension
 * Revolutionary AI-powered pet chatbot for VS Code
 * Inspired by VS Code Pets and Coding Pet
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const PetViewProvider_1 = require("./views/PetViewProvider");
const weatherService_1 = require("./services/weatherService");
let statusBarItem;
let petViewProvider;
async function activate(context) {
    console.log('🎉 LifeLink CodeBuddy is activating...');
    try {
        // Initialize Pet View Provider
        petViewProvider = new PetViewProvider_1.PetViewProvider(context.extensionUri);
        const petViewRegistration = vscode.window.registerWebviewViewProvider('lifelinkCodeBuddy', petViewProvider, {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        });
        context.subscriptions.push(petViewRegistration);
        // Create status bar item with pet emoji
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = '🐱 CodeBuddy';
        statusBarItem.tooltip = 'Your friendly coding companion! Click to chat';
        statusBarItem.command = 'lifelink.showCodeBuddy';
        statusBarItem.show();
        context.subscriptions.push(statusBarItem);
        // Register Commands
        registerCommands(context);
        // Show welcome message
        vscode.window.showInformationMessage('🎉 CodeBuddy is here! Your AI coding companion is ready to help!', 'Say Hi!').then(selection => {
            if (selection === 'Say Hi!') {
                vscode.commands.executeCommand('lifelink.showCodeBuddy');
            }
        });
        console.log('✅ LifeLink CodeBuddy activated successfully!');
    }
    catch (error) {
        console.error('❌ Error activating CodeBuddy:', error);
        vscode.window.showErrorMessage(`Failed to activate CodeBuddy: ${error}`);
    }
}
function registerCommands(context) {
    // Show CodeBuddy Panel
    const showCodeBuddyCmd = vscode.commands.registerCommand('lifelink.showCodeBuddy', () => {
        vscode.commands.executeCommand('workbench.view.extension.lifelink-codebuddy');
    });
    // Quick Chat Command
    const quickChatCmd = vscode.commands.registerCommand('lifelink.quickChat', async () => {
        const input = await vscode.window.showInputBox({
            prompt: 'Ask CodeBuddy anything!',
            placeHolder: 'Type your question here...'
        });
        if (input) {
            vscode.commands.executeCommand('lifelink.showCodeBuddy');
            // Message will be handled by the webview
        }
    });
    // Get Weather Command
    const weatherCmd = vscode.commands.registerCommand('lifelink.getWeather', async () => {
        try {
            const weatherService = new weatherService_1.WeatherService();
            const config = vscode.workspace.getConfiguration('lifelinkPet');
            const location = config.get('location') || 'New York';
            const weather = await weatherService.getWeather(location);
            const icon = getWeatherIcon(weather.condition);
            statusBarItem.text = `${icon} ${weather.temperature}°F`;
            statusBarItem.tooltip = `${weather.condition} in ${weather.location}`;
            vscode.window.showInformationMessage(`${icon} ${weather.temperature}°F in ${weather.location} - ${weather.condition}`);
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to get weather. Please check your settings.');
        }
    });
    // Set Location Command
    const setLocationCmd = vscode.commands.registerCommand('lifelink.setLocation', async () => {
        const location = await vscode.window.showInputBox({
            prompt: 'Enter your location',
            placeHolder: 'e.g., New York, London, Tokyo'
        });
        if (location) {
            const config = vscode.workspace.getConfiguration('lifelinkPet');
            await config.update('location', location, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`📍 Location set to: ${location}`);
            // Refresh weather
            vscode.commands.executeCommand('lifelink.getWeather');
        }
    });
    // Change Pet Command
    const changePetCmd = vscode.commands.registerCommand('lifelink.changePet', async () => {
        const petTypes = [
            { label: '🐱 Cat', value: 'cat' },
            { label: '🐶 Dog', value: 'dog' },
            { label: '🐉 Dragon', value: 'dragon' },
            { label: '🤖 Robot', value: 'robot' },
            { label: '🦄 Unicorn', value: 'unicorn' }
        ];
        const selected = await vscode.window.showQuickPick(petTypes, {
            placeHolder: 'Choose your coding companion!'
        });
        if (selected) {
            const emoji = selected.label.split(' ')[0];
            statusBarItem.text = `${emoji} CodeBuddy`;
            vscode.window.showInformationMessage(`Your new companion is ${selected.label}!`);
        }
    });
    // Motivate Me Command
    const motivateCmd = vscode.commands.registerCommand('lifelink.motivateMe', () => {
        const motivations = [
            '💪 You\'re doing amazing! Keep coding!',
            '🌟 Every bug you fix makes you stronger!',
            '🚀 Your code is going to change the world!',
            '✨ Believe in yourself - you\'ve got this!',
            '🔥 Keep pushing! Great developers never give up!',
            '🎯 Focus on progress, not perfection!',
            '💡 Your creativity is your superpower!',
            '⭐ You\'re writing the future, one line at a time!'
        ];
        const message = motivations[Math.floor(Math.random() * motivations.length)];
        vscode.window.showInformationMessage(message);
    });
    // Get Coding Tip Command
    const codingTipCmd = vscode.commands.registerCommand('lifelink.getCodingTip', () => {
        const tips = [
            '💡 Tip: Write meaningful commit messages - your future self will thank you!',
            '🔍 Tip: Use console.log() strategically for debugging.',
            '📝 Tip: Comment your code like you\'re explaining it to your past self.',
            '🎯 Tip: Break large problems into smaller, manageable pieces.',
            '♻️ Tip: Refactor regularly - clean code is happy code!',
            '🧪 Tip: Write tests! They save time in the long run.',
            '📚 Tip: Learn one new thing every day, even if it\'s small.',
            '⌨️ Tip: Master keyboard shortcuts to boost productivity!'
        ];
        const tip = tips[Math.floor(Math.random() * tips.length)];
        vscode.window.showInformationMessage(tip);
    });
    // Configure API Command
    const configureApiCmd = vscode.commands.registerCommand('lifelink.configureApi', async () => {
        const apiUrl = await vscode.window.showInputBox({
            prompt: 'Enter your LifeLink chatbot API URL',
            placeHolder: 'http://localhost:5000',
            value: 'http://localhost:5000'
        });
        if (apiUrl) {
            const config = vscode.workspace.getConfiguration('lifelinkPet');
            await config.update('chatbotApiUrl', apiUrl, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('✅ API URL configured successfully!');
        }
    });
    // Register all commands
    context.subscriptions.push(showCodeBuddyCmd, quickChatCmd, weatherCmd, setLocationCmd, changePetCmd, motivateCmd, codingTipCmd, configureApiCmd);
    console.log('✅ All commands registered');
}
function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain'))
        return '🌧️';
    if (conditionLower.includes('snow'))
        return '❄️';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny'))
        return '☀️';
    if (conditionLower.includes('cloud'))
        return '☁️';
    if (conditionLower.includes('storm'))
        return '⛈️';
    if (conditionLower.includes('fog'))
        return '🌫️';
    return '🌤️';
}
function deactivate() {
    console.log('👋 CodeBuddy is deactivating...');
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    console.log('✅ CodeBuddy deactivated successfully');
}
//# sourceMappingURL=extension-old.js.map