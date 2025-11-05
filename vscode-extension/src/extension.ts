/**
 * LifeLink's Buddy Extension
 * Auto weather notifications 3 times daily with friendly reminders
 */

import * as vscode from 'vscode';
import { PetViewProvider } from './views/PetViewProvider';
import { WeatherService } from './services/weatherService';

let statusBarItem: vscode.StatusBarItem;
let petViewProvider: PetViewProvider;
let weatherService: WeatherService;
let notificationTimers: NodeJS.Timeout[] = [];

export async function activate(context: vscode.ExtensionContext) {
    console.log('🎉 LifeLink\'s Buddy is activating...');

    try {
        // Initialize services
        weatherService = new WeatherService();
        
        // Initialize Pet View Provider
        petViewProvider = new PetViewProvider(context.extensionUri);
        
        const petViewRegistration = vscode.window.registerWebviewViewProvider(
            'lifelinkCodeBuddy',
            petViewProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        );
        context.subscriptions.push(petViewRegistration);

        // Create status bar item
        statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        statusBarItem.text = '$(cloud) LifeLink\'s Buddy';
        statusBarItem.tooltip = 'Click to view weather and reminders';
        statusBarItem.command = 'lifelink.showCodeBuddy';
        statusBarItem.show();
        context.subscriptions.push(statusBarItem);

        // Register Commands
        registerCommands(context);

        // Check if setup is complete
        const config = vscode.workspace.getConfiguration('lifelinkPet');
        const userName = config.get<string>('petName');
        const location = config.get<string>('location');

        if (!userName || !location) {
            // Show welcome message for first-time setup
            vscode.window.showInformationMessage(
                '👋 Welcome to LifeLink\'s Buddy! Let us get you set up!',
                'Start Setup'
            ).then(selection => {
                if (selection === 'Start Setup') {
                    vscode.commands.executeCommand('lifelink.showCodeBuddy');
                }
            });
        } else {
            // Setup weather notifications (3 times daily)
            setupDailyNotifications(context);
            
            // Update status bar with current weather
            updateStatusBarWeather();
        }

        console.log('✅ LifeLink\'s Buddy activated successfully!');

    } catch (error) {
        console.error('❌ Error activating LifeLink\'s Buddy:', error);
        vscode.window.showErrorMessage(`Failed to activate LifeLink's Buddy: ${error}`);
    }
}

function registerCommands(context: vscode.ExtensionContext) {
    // Show CodeBuddy Panel
    const showCodeBuddyCmd = vscode.commands.registerCommand(
        'lifelink.showCodeBuddy',
        () => {
            vscode.commands.executeCommand('lifelinkCodeBuddy.focus');
        }
    );

    // Quick Chat Command
    const quickChatCmd = vscode.commands.registerCommand(
        'lifelink.quickChat',
        async () => {
            const input = await vscode.window.showInputBox({
                prompt: 'Ask CodeBuddy anything!',
                placeHolder: 'Type your question here...'
            });

            if (input) {
                vscode.commands.executeCommand('lifelink.showCodeBuddy');
                // Message will be handled by the webview
            }
        }
    );

    // Get Weather Command
    const weatherCmd = vscode.commands.registerCommand(
        'lifelink.getWeather',
        async () => {
            try {
                const weatherService = new WeatherService();
                const config = vscode.workspace.getConfiguration('lifelinkPet');
                const location = config.get<string>('location') || 'New York';
                
                const weather = await weatherService.getWeather(location);
                const icon = getWeatherIcon(weather.condition);
                
                statusBarItem.text = `${icon} ${weather.temperature}°F`;
                statusBarItem.tooltip = `${weather.condition} in ${weather.location}`;
                
                vscode.window.showInformationMessage(
                    `${icon} ${weather.temperature}°F in ${weather.location} - ${weather.condition}`
                );

            } catch (error) {
                vscode.window.showErrorMessage('Failed to get weather. Please check your settings.');
            }
        }
    );

    // Set Location Command
    const setLocationCmd = vscode.commands.registerCommand(
        'lifelink.setLocation',
        async () => {
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
        }
    );

    // Change Pet Command
    const changePetCmd = vscode.commands.registerCommand(
        'lifelink.changePet',
        async () => {
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
        }
    );

    // Motivate Me Command
    const motivateCmd = vscode.commands.registerCommand(
        'lifelink.motivateMe',
        () => {
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
        }
    );

    // Get Coding Tip Command
    const codingTipCmd = vscode.commands.registerCommand(
        'lifelink.getCodingTip',
        () => {
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
        }
    );

    // Configure API Command
    const configureApiCmd = vscode.commands.registerCommand(
        'lifelink.configureApi',
        async () => {
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
        }
    );

    // Register all commands
    context.subscriptions.push(
        showCodeBuddyCmd,
        quickChatCmd,
        weatherCmd,
        setLocationCmd,
        changePetCmd,
        motivateCmd,
        codingTipCmd,
        configureApiCmd
    );

    console.log('✅ All commands registered');
}

function getWeatherIcon(condition: string): string {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('fog')) return '🌫️';
    
    return '🌤️';
}

// Setup 3-times daily weather notifications
function setupDailyNotifications(context: vscode.ExtensionContext) {
    // Clear existing timers
    notificationTimers.forEach(timer => clearTimeout(timer));
    notificationTimers = [];

    // Notification times: 8 AM, 2 PM, 8 PM
    const notificationTimes = [
        { hour: 8, minute: 0 },   // Morning
        { hour: 14, minute: 0 },  // Afternoon
        { hour: 20, minute: 0 }   // Evening
    ];

    function scheduleNotification(targetHour: number, targetMinute: number) {
        const now = new Date();
        const target = new Date();
        target.setHours(targetHour, targetMinute, 0, 0);

        // If target time is past today, schedule for tomorrow
        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const delay = target.getTime() - now.getTime();
        
        const timer = setTimeout(async () => {
            await showWeatherNotification();
            // Reschedule for next day
            scheduleNotification(targetHour, targetMinute);
        }, delay);

        notificationTimers.push(timer);
    }

    // Schedule all three notifications
    notificationTimes.forEach(time => {
        scheduleNotification(time.hour, time.minute);
    });

    console.log('✅ Daily weather notifications scheduled');
}

async function showWeatherNotification() {
    try {
        const config = vscode.workspace.getConfiguration('lifelinkPet');
        const location = config.get<string>('location', '');
        const userName = config.get<string>('petName', 'friend');

        if (!location) {return;}

        const weather = await weatherService.getWeather(location);
        const icon = getWeatherIcon(weather.condition);
        const condition = weather.condition.toLowerCase();

        let message = `${icon} ${weather.temperature}°F - ${weather.condition}`;
        let reminder = '';

        // Add weather-specific reminders
        if (condition.includes('rain')) {
            reminder = `☂️ ${userName}, don't forget your umbrella! And bring in the clothes! 👕`;
        } else if (condition.includes('snow')) {
            reminder = `❄️ ${userName}, it's snowing! Bundle up warm! 🧤`;
        } else if (condition.includes('clear') || condition.includes('sunny')) {
            reminder = `☀️ ${userName}, beautiful day! Don't forget sunscreen! 🌞`;
        }

        if (reminder) {
            vscode.window.showInformationMessage(message, 'View Details', reminder).then(selection => {
                if (selection === 'View Details') {
                    vscode.commands.executeCommand('lifelink.showCodeBuddy');
                }
            });
        } else {
            vscode.window.showInformationMessage(message, 'View Details').then(selection => {
                if (selection === 'View Details') {
                    vscode.commands.executeCommand('lifelink.showCodeBuddy');
                }
            });
        }

        // Update status bar
        await updateStatusBarWeather();
    } catch (error) {
        console.error('Error showing weather notification:', error);
    }
}

async function updateStatusBarWeather() {
    try {
        const config = vscode.workspace.getConfiguration('lifelinkPet');
        const location = config.get<string>('location');

        if (!location) {return;}

        const weather = await weatherService.getWeather(location);
        const icon = getWeatherIcon(weather.condition);
        statusBarItem.text = `${icon} ${weather.temperature}°F`;
        statusBarItem.tooltip = `${weather.condition} in ${weather.location}\nClick for details`;
    } catch (error) {
        statusBarItem.text = '🌤️ Weather Buddy';
        statusBarItem.tooltip = 'Click to set up';
    }
}

export function deactivate() {
    console.log('👋 Weather Buddy is deactivating...');
    
    // Clear all notification timers
    notificationTimers.forEach(timer => clearTimeout(timer));
    notificationTimers = [];
    
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    
    console.log('✅ Weather Buddy deactivated successfully');
}
