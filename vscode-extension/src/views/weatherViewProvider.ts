import * as vscode from 'vscode';
import { WeatherService } from '../services/weatherService';
import { LocationService } from '../services/locationService';

export class WeatherViewProvider implements vscode.WebviewViewProvider {
    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _weatherService: WeatherService,
        private readonly _locationService: LocationService
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        this.updateWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'refresh':
                    await this.updateWebview(webviewView.webview);
                    vscode.window.showInformationMessage('Weather refreshed!');
                    break;
                case 'setLocation': {
                    const location = await vscode.window.showInputBox({
                        prompt: 'Enter your location',
                        placeHolder: 'e.g., New York, London, Tokyo'
                    });
                    if (location) {
                        const config = vscode.workspace.getConfiguration('lifelinkWeather');
                        await config.update('location', location, vscode.ConfigurationTarget.Global);
                        await this.updateWebview(webviewView.webview);
                        vscode.window.showInformationMessage(`Location set to: ${location}`);
                    }
                    break;
                }
            }
        });

        setInterval(() => {
            this.updateWebview(webviewView.webview);
        }, 30 * 60 * 1000);
    }

    private async updateWebview(webview: vscode.Webview) {
        try {
            const config = vscode.workspace.getConfiguration('lifelinkWeather');
            let location = config.get<string>('location', '');

            if (!location) {
                location = await this._locationService.detectLocation();
            }

            const weather = await this._weatherService.getWeather(location);
            const recommendations = await this._weatherService.getRecommendations(weather);

            webview.html = this.getHtmlForWebview(webview, weather, recommendations);
        } catch (error) {
            webview.html = this.getErrorHtml(`Failed to load weather: ${error}`);
        }
    }

    private getHtmlForWebview(webview: vscode.Webview, weather: any, recommendations: string): string {
        const weatherIcon = this.getWeatherEmoji(weather.condition);
        const weatherCharacter = this.getWeatherCharacter(weather.condition);
        const recommendationsHtml = this.formatRecommendationsForPet(recommendations);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; overflow-x: hidden; padding: 15px; }
        .weather-character { text-align: center; margin-bottom: 20px; }
        .character { font-size: 100px; animation: float 3s ease-in-out infinite; cursor: pointer; display: inline-block; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .speech-bubble { background: rgba(255, 255, 255, 0.95); color: #333; padding: 12px 15px; border-radius: 15px; margin: 15px 0; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 13px; }
        .speech-bubble:before { content: ''; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid rgba(255, 255, 255, 0.95); }
        .weather-card { background: rgba(255, 255, 255, 0.95); border-radius: 15px; padding: 15px; margin-bottom: 12px; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .location { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #667eea; }
        .temp-display { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .temperature { font-size: 36px; font-weight: bold; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .condition-icon { font-size: 32px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .detail-item { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 10px; border-radius: 10px; text-align: center; font-size: 12px; }
        .detail-value { font-size: 18px; font-weight: bold; color: #333; margin-top: 4px; }
        .recommendations h3 { font-size: 14px; margin-bottom: 10px; color: #667eea; }
        .recommendation-item { background: #f8f9ff; padding: 10px; border-radius: 10px; margin-bottom: 8px; font-size: 12px; line-height: 1.5; }
        .actions { display: flex; gap: 8px; margin-top: 12px; }
        .btn { flex: 1; padding: 10px; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .btn-secondary { background: rgba(255, 255, 255, 0.95); color: #667eea; }
        .footer { text-align: center; margin-top: 15px; font-size: 10px; color: rgba(255,255,255,0.8); }
    </style>
</head>
<body>
    <div class="weather-character">
        <div class="character" onclick="playAnimation()">${weatherCharacter}</div>
        <div class="speech-bubble" id="speech">Hi! I'm your weather buddy! ${weatherIcon}</div>
    </div>
    <div class="weather-card">
        <div class="location">📍 ${weather.location}, ${weather.country}</div>
        <div class="temp-display">
            <div>
                <div class="temperature">${weather.temperature}°F</div>
                <div style="font-size: 11px; color: #666;">Feels ${weather.feels_like}°F</div>
            </div>
            <div class="condition-icon">${weatherIcon}</div>
        </div>
        <div style="font-size: 14px; color: #667eea; margin-bottom: 10px;">${weather.condition}</div>
        <div class="details-grid">
            <div class="detail-item"><div>💧 Humidity</div><div class="detail-value">${weather.humidity}%</div></div>
            <div class="detail-item"><div>💨 Wind</div><div class="detail-value">${weather.wind_speed} mph</div></div>
        </div>
    </div>
    <div class="weather-card recommendations">
        <h3>🤖 AI Tips</h3>
        ${recommendationsHtml}
    </div>
    <div class="actions">
        <button class="btn btn-primary" onclick="refresh()">🔄 Refresh</button>
        <button class="btn btn-secondary" onclick="changeLocation()">📍 Change</button>
    </div>
    <div class="footer">Updated: ${new Date().toLocaleTimeString()}<br>OpenWeatherMap</div>
    <script>
        const vscode = acquireVsCodeApi();
        const speeches = ["Looking good outside! ${weatherIcon}", "Stay safe out there! 🌟", "Perfect for coding! 💻", "Stay hydrated! 💧", "Great day ahead! ✨"];
        function playAnimation() { const speech = document.getElementById('speech'); speech.textContent = speeches[Math.floor(Math.random() * speeches.length)]; }
        function refresh() { vscode.postMessage({ command: 'refresh' }); }
        function changeLocation() { vscode.postMessage({ command: 'setLocation' }); }
        setInterval(playAnimation, 10000);
    </script>
</body>
</html>`;
    }

    private getWeatherCharacter(condition: string): string {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('rain')) return '🐸';
        if (conditionLower.includes('snow')) return '🐧';
        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '🦁';
        if (conditionLower.includes('cloud')) return '🐨';
        if (conditionLower.includes('storm')) return '🦅';
        if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🦉';
        return '🐱';
    }

    private formatRecommendationsForPet(recommendations: string): string {
        return recommendations.split('\n').filter(line => line.trim()).map(line => {
            const emoji = line.match(/^[^\w\s]/)?.[0] || '💡';
            const text = line.replace(/^[^\w\s]+\s*/, '');
            return `<div class="recommendation-item">${emoji} ${text}</div>`;
        }).join('');
    }

    private getErrorHtml(error: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #ff6b6b; color: white; text-align: center; }
        .error-icon { font-size: 60px; margin-bottom: 15px; }
        .error-message { font-size: 14px; margin: 10px 0; }
        button { margin-top: 15px; padding: 10px 20px; border: none; border-radius: 10px; background: white; color: #ff6b6b; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <div class="error-icon">⚠️</div>
    <div class="error-message">${error}</div>
    <button onclick="location.reload()">Try Again</button>
</body>
</html>`;
    }

    private getWeatherEmoji(condition: string): string {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('rain')) return '🌧️';
        if (conditionLower.includes('snow')) return '❄️';
        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
        if (conditionLower.includes('cloud')) return '☁️';
        if (conditionLower.includes('storm')) return '⛈️';
        if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
        return '🌤️';
    }
}
