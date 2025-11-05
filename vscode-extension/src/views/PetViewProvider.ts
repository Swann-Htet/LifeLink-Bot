/**
 * PetViewProvider - Weather Companion with Auto Notifications
 * Shows weather 3 times daily with friendly reminders and p5.js animations
 */

import * as vscode from 'vscode';
import { Pet, PetMood, PetType } from '../models/Pet';
import { WeatherService } from '../services/weatherService';
import { LocationService } from '../services/locationService';

export class PetViewProvider implements vscode.WebviewViewProvider {
    private pet: Pet;
    private weather: WeatherService;
    private location: LocationService;
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) {
        this.pet = new Pet(PetType.CAT, 'WeatherBuddy');
        this.weather = new WeatherService();
        this.location = new LocationService();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;
        
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // Check if user has completed setup
        const config = vscode.workspace.getConfiguration('lifelinkPet');
        const userName = config.get<string>('petName');
        const location = config.get<string>('location');

        if (!userName || !location) {
            webviewView.webview.html = this.getSetupHtml(webviewView.webview);
        } else {
            this.pet.changeName(userName);
            this.updateWeatherView();
        }

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            try {
                console.log('Received message:', message);
                switch (message.command) {
                    case 'completeSetup':
                        await this.handleSetup(message.name);
                        break;
                    case 'refresh':
                        await this.updateWeatherView();
                        break;
                }
            } catch (error) {
                console.error('Error handling message:', error);
                vscode.window.showErrorMessage(`Error: ${error}`);
            }
        });
    }

    private async handleSetup(name: string) {
        if (!this._view) {
            console.error('View not available');
            return;
        }

        try {
            console.log('Starting setup for:', name);
            
            // Show loading message
            this._view.webview.html = this.getLoadingHtml();
            
            // Auto-detect location from system
            console.log('Detecting location...');
            const detectedLocation = await this.location.detectLocation();
            console.log('Location detected:', detectedLocation);
            
            const config = vscode.workspace.getConfiguration('lifelinkPet');
            await config.update('petName', name, vscode.ConfigurationTarget.Global);
            await config.update('location', detectedLocation, vscode.ConfigurationTarget.Global);
            
            this.pet.changeName(name);
            vscode.window.showInformationMessage(`Welcome ${name}! I detected you're in ${detectedLocation}! 🌤️`);
            
            // Load weather view
            await this.updateWeatherView();
        } catch (error) {
            console.error('Setup error:', error);
            this._view.webview.html = this.getErrorHtml(`Setup failed: ${error}`);
        }
    }

    private async updateWeatherView() {
        if (!this._view) {
            console.error('View not available');
            return;
        }

        try {
            console.log('Updating weather view...');
            const config = vscode.workspace.getConfiguration('lifelinkPet');
            const location = config.get<string>('location', 'New York');
            
            console.log('Fetching weather for:', location);
            const weatherData = await this.weather.getWeather(location);
            console.log('Weather data received:', weatherData);
            
            const reminder = this.getWeatherReminder(weatherData);

            this._view.webview.html = this.getWeatherHtml(this._view.webview, weatherData, reminder);
        } catch (error) {
            console.error('Weather update error:', error);
            this._view.webview.html = this.getErrorHtml(`Failed to load weather: ${error}`);
        }
    }

    private getWeatherReminder(weather: any): string {
        const condition = weather.condition.toLowerCase();
        const temp = weather.temperature;
        const time = new Date().getHours();
        const userName = this.pet.getState().name;

        let greeting = '';
        if (time < 12) {
            greeting = `Good morning, ${userName}! ☀️`;
        } else if (time < 18) {
            greeting = `Good afternoon, ${userName}! 🌤️`;
        } else {
            greeting = `Good evening, ${userName}! 🌙`;
        }

        const reminders: string[] = [greeting];

        // Weather-specific reminders
        if (condition.includes('rain')) {
            reminders.push("Don't forget to bring an umbrella! ☂️");
            reminders.push("Don't forget to hang off the clothes from outside! 👕");
            reminders.push("Roads might be slippery, drive carefully! 🚗");
        } else if (condition.includes('snow')) {
            reminders.push("It's snowing! Bundle up warm! ❄️");
            reminders.push("Wear waterproof boots today! 🥾");
            reminders.push("Don't forget your gloves and scarf! 🧤");
        } else if (condition.includes('clear') || condition.includes('sunny')) {
            reminders.push("Beautiful sunny day! Don't forget sunscreen! ☀️");
            reminders.push("Great day to dry your clothes outside! 👕");
            reminders.push("Stay hydrated in the sun! 💧");
        } else if (condition.includes('cloud')) {
            reminders.push("Cloudy but nice! Perfect for outdoor activities! ☁️");
        }

        // Temperature reminders
        if (temp < 32) {
            reminders.push("It's freezing! Wear warm layers! 🧥");
        } else if (temp < 50) {
            reminders.push("Chilly weather! Bring a jacket! 🧥");
        } else if (temp > 85) {
            reminders.push("It's hot! Wear light clothing! 👕");
            reminders.push("Drink plenty of water! 💧");
        }

        return reminders.join('\n\n');
    }

    private getSetupHtml(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src https://fonts.gstatic.com https://cdn.jsdelivr.net; script-src 'unsafe-inline' https://cdn.jsdelivr.net;">
    <title>LifeLink's Buddy Setup</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
    <script src="https://cdn.jsdelivr.net/npm/p5@1.7.0/lib/p5.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: hidden;
        }
        #canvas-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .setup-container {
            position: relative;
            z-index: 1;
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 450px;
            width: 100%;
            text-align: center;
        }
        .welcome-emoji { font-size: 80px; margin-bottom: 20px; animation: wave 2s ease-in-out infinite; }
        @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
        }
        h1 { color: #667eea; margin-bottom: 10px; font-size: 32px; font-weight: 800; }
        .subtitle { color: #666; margin-bottom: 30px; font-size: 16px; font-weight: 500; }
        .input-group { margin-bottom: 20px; text-align: left; }
        label { display: block; color: #333; font-weight: 600; margin-bottom: 8px; font-size: 14px; }
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            font-family: 'Manrope', sans-serif;
            transition: border-color 0.3s;
        }
        input:focus { outline: none; border-color: #667eea; }
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 700;
            font-family: 'Manrope', sans-serif;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 20px;
        }
        button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        button:active { transform: translateY(0); }
        .info-box {
            background: #f0f7ff;
            padding: 15px;
            border-radius: 10px;
            color: #333;
            font-size: 13px;
            margin-top: 20px;
            text-align: left;
        }
        .info-box strong { color: #667eea; }
        .auto-detect {
            background: #e8f5e9;
            padding: 12px;
            border-radius: 8px;
            color: #2e7d32;
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ti { font-size: 18px; }
    </style>
</head>
<body>
    <div id="canvas-container"></div>
    
    <div class="setup-container">
        <div class="welcome-emoji"><i class="ti ti-cloud"></i></div>
        <h1>Welcome to LifeLink's Buddy!</h1>
        <p class="subtitle">Your friendly weather companion</p>
        
        <div class="auto-detect">
            <i class="ti ti-map-pin"></i>
            <span>We'll auto-detect your location</span>
        </div>
        
        <form id="setupForm">
            <div class="input-group">
                <label>What should I call you?</label>
                <input type="text" id="nameInput" placeholder="Enter your name" required autofocus>
            </div>
            
            <button type="submit"><i class="ti ti-rocket"></i> Let's Get Started!</button>
        </form>
        
        <div class="info-box">
            <strong>What I'll do for you:</strong><br>
            <i class="ti ti-sun"></i> Show weather updates 3 times daily<br>
            <i class="ti ti-umbrella"></i> Remind you about umbrellas and clothes<br>
            <i class="ti ti-snowflake"></i> Warn you about cold weather<br>
            <i class="ti ti-bulb"></i> Give you helpful daily tips
        </div>
    </div>

    <script>
        // Initialize vscode API first
        const vscode = acquireVsCodeApi();
        
        // P5.js floating particles - wait for p5 to load
        let particles = [];
        
        function setup() {
            let canvas = createCanvas(windowWidth, windowHeight);
            canvas.parent('canvas-container');
            
            // Create particles after canvas is ready
            for (let i = 0; i < 30; i++) {
                particles.push({
                    x: random(width),
                    y: random(height),
                    size: random(20, 50),
                    speedX: random(-0.5, 0.5),
                    speedY: random(-0.5, 0.5),
                    emoji: random(['☁️', '⛅', '🌤️', '☀️', '🌈'])
                });
            }
        }

        function draw() {
            clear();
            textSize(30);
            
            for (let p of particles) {
                text(p.emoji, p.x, p.y);
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < -50 || p.x > width + 50) p.speedX *= -1;
                if (p.y < -50 || p.y > height + 50) p.speedY *= -1;
            }
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }

        // Form handling - wait for DOM to be ready
        window.addEventListener('DOMContentLoaded', () => {
            const setupForm = document.getElementById('setupForm');
            if (setupForm) {
                setupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nameInput = document.getElementById('nameInput');
                    const name = nameInput ? nameInput.value.trim() : '';
                    
                    if (name) {
                        console.log('Submitting setup with name:', name);
                        
                        // Show loading state
                        const button = e.target.querySelector('button');
                        if (button) {
                            button.textContent = '🔍 Detecting your location...';
                            button.disabled = true;
                        }
                        
                        // Send message to extension
                        vscode.postMessage({
                            command: 'completeSetup',
                            name: name
                        });
                    } else {
                        alert('Please enter your name!');
                    }
                });
            }
        });
    </script>
</body>
</html>`;
    }

    private getWeatherHtml(webview: vscode.Webview, weather: any, reminder: string): string {
        const weatherImage = this.getWeatherImage(webview, weather.condition);
        const weatherIcon = this.getWeatherIcon(weather.condition);
        const petState = this.pet.getState();
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data: https:; style-src 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src https://fonts.gstatic.com https://cdn.jsdelivr.net; script-src 'unsafe-inline' https://cdn.jsdelivr.net;">
    <title>LifeLink's Buddy</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
    <script src="https://cdn.jsdelivr.net/npm/p5@1.7.0/lib/p5.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
            padding: 15px;
        }
        #canvas-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .content { position: relative; z-index: 1; }
        
        .pet-section {
            text-align: center;
            margin-bottom: 20px;
        }
        .pet-emoji {
            font-size: 60px;
            animation: float 3s ease-in-out infinite;
            display: inline-block;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .pet-name { font-size: 18px; font-weight: 700; margin-top: 10px; }
        
        .weather-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .weather-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        .location {
            color: #667eea;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .temperature {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .condition {
            font-size: 20px;
            color: #666;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .weather-icon {
            font-size: 32px;
        }
        .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .detail-box {
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            padding: 12px;
            border-radius: 10px;
            text-align: center;
        }
        .detail-label { font-size: 11px; color: #666; font-weight: 600; }
        .detail-value { font-size: 18px; font-weight: 700; color: #333; margin-top: 4px; }
        
        .reminder-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .reminder-title {
            color: #667eea;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        .reminder-text {
            color: #333;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.8;
            white-space: pre-line;
        }
        
        .refresh-btn {
            width: 100%;
            padding: 14px;
            background: rgba(255, 255, 255, 0.95);
            color: #667eea;
            border: none;
            border-radius: 15px;
            font-size: 16px;
            font-weight: 700;
            font-family: 'Manrope', sans-serif;
            cursor: pointer;
            transition: all 0.3s;
        }
        .refresh-btn:hover {
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .timestamp {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            font-weight: 500;
            opacity: 0.9;
        }
        .ti { font-size: 20px; vertical-align: middle; }
        .weather-icon .ti { font-size: 32px; }
    </style>
</head>
<body>
    <div id="canvas-container"></div>
    
    <div class="content">
        <div class="pet-section">
            <div class="pet-emoji"><i class="ti ti-heart"></i></div>
            <div class="pet-name">${petState.name}</div>
        </div>
        
        <div class="weather-card">
            <img src="${weatherImage}" class="weather-image" alt="${weather.condition}" onerror="this.style.display='none'">
            <div class="location"><i class="ti ti-map-pin"></i> ${weather.location}, ${weather.country}</div>
            <div class="temperature">${weather.temperature}°F</div>
            <div class="condition">
                <span class="weather-icon">${weatherIcon}</span>
                <span>${weather.condition}</span>
            </div>
            
            <div class="details">
                <div class="detail-box">
                    <div class="detail-label"><i class="ti ti-temperature"></i> Feels Like</div>
                    <div class="detail-value">${weather.feels_like}°F</div>
                </div>
                <div class="detail-box">
                    <div class="detail-label"><i class="ti ti-droplet"></i> Humidity</div>
                    <div class="detail-value">${weather.humidity}%</div>
                </div>
                <div class="detail-box">
                    <div class="detail-label"><i class="ti ti-wind"></i> Wind</div>
                    <div class="detail-value">${weather.wind_speed} mph</div>
                </div>
                <div class="detail-box">
                    <div class="detail-label"><i class="ti ti-calendar"></i> Today</div>
                    <div class="detail-value">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
            </div>
        </div>
        
        <div class="reminder-card">
            <div class="reminder-title"><i class="ti ti-bulb"></i> Friendly Reminders</div>
            <div class="reminder-text">${reminder}</div>
        </div>
        
        <button class="refresh-btn" onclick="refresh()"><i class="ti ti-refresh"></i> Refresh Weather</button>
        
        <div class="timestamp"><i class="ti ti-clock"></i> Updated: ${new Date().toLocaleTimeString()}</div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const weatherCondition = "${weather.condition}".toLowerCase();
        
        // P5.js weather animation
        let particles = [];
        
        function setup() {
            let canvas = createCanvas(windowWidth, windowHeight);
            canvas.parent('canvas-container');
            
            // Create weather-specific particles
            for (let i = 0; i < 50; i++) {
                particles.push(new WeatherParticle());
            }
        }
        
        function draw() {
            clear();
            for (let p of particles) {
                p.update();
                p.display();
            }
        }
        
        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }
        
        class WeatherParticle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = random(width);
                this.y = random(-100, -10);
                this.z = random(0, 20);
                this.len = map(this.z, 0, 20, 10, 20);
                this.yspeed = map(this.z, 0, 20, 1, 5);
            }
            
            update() {
                this.y += this.yspeed;
                let grav = map(this.z, 0, 20, 0, 0.2);
                this.yspeed += grav;
                
                if (this.y > height) {
                    this.reset();
                }
            }
            
            display() {
                let thick = map(this.z, 0, 20, 1, 3);
                strokeWeight(thick);
                
                if (weatherCondition.includes('rain')) {
                    // Rain drops
                    stroke(138, 186, 255, 150);
                    line(this.x, this.y, this.x, this.y + this.len);
                } else if (weatherCondition.includes('snow')) {
                    // Snowflakes
                    noStroke();
                    fill(255, 255, 255, 200);
                    ellipse(this.x, this.y, thick * 3);
                } else if (weatherCondition.includes('cloud')) {
                    // Cloud particles
                    noStroke();
                    fill(220, 220, 235, 100);
                    ellipse(this.x, this.y, thick * 4);
                } else {
                    // Sunny particles
                    noStroke();
                    fill(255, 215, 100, 150);
                    ellipse(this.x, this.y, thick * 2);
                }
            }
        }
        
        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }
    </script>
</body>
</html>`;
    }

    private getWeatherImage(webview: vscode.Webview, condition: string): string {
        const conditionLower = condition.toLowerCase();
        let imageName = 'Sunny.jpg';
        
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            imageName = 'Rainy.jpg';
        } else if (conditionLower.includes('snow')) {
            imageName = 'Snowy.jpg';
        }
        
        // Use exact path: vscode-extension/assets/
        const imagePath = vscode.Uri.joinPath(this._extensionUri, 'assets', imageName);
        return webview.asWebviewUri(imagePath).toString();
    }

    private getWeatherIcon(condition: string): string {
        const conditionLower = condition.toLowerCase();
        
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return '<i class="ti ti-cloud-rain"></i>';
        } else if (conditionLower.includes('snow')) {
            return '<i class="ti ti-snowflake"></i>';
        } else if (conditionLower.includes('cloud')) {
            return '<i class="ti ti-cloud"></i>';
        } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
            return '<i class="ti ti-sun"></i>';
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            return '<i class="ti ti-cloud-storm"></i>';
        } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            return '<i class="ti ti-cloud-fog"></i>';
        } else if (conditionLower.includes('wind')) {
            return '<i class="ti ti-wind"></i>';
        }
        
        return '<i class="ti ti-cloud-sun"></i>'; // Partly cloudy default
    }

    private getLoadingHtml(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Manrope', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .loading-container {
            text-align: center;
        }
        .loading-spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h2 {
            font-weight: 700;
            font-size: 24px;
            margin-bottom: 10px;
        }
        p {
            font-weight: 500;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <h2>🔍 Detecting Your Location</h2>
        <p>This will only take a moment...</p>
    </div>
</body>
</html>`;
    }

    private getErrorHtml(error: string): string {
        if (!this._view) {
            return '';
        }
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Manrope', sans-serif;
            padding: 20px;
            background: #ff6b6b;
            color: white;
            text-align: center;
        }
        .error-icon { font-size: 60px; margin-bottom: 15px; }
        .error-message { font-size: 14px; margin: 10px 0; }
        button {
            margin-top: 15px;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            background: white;
            color: #ff6b6b;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="error-icon">⚠️</div>
    <div class="error-message">${error}</div>
    <button onclick="location.reload()">Try Again</button>
</body>
</html>`;
    }
}
