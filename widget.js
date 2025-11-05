/**
 * LifeLink Chatbot Widget - Embeddable JavaScript
 * Open Source Disaster Response Chatbot by SkillFusion
 * 
 * Usage:
 * <script src="https://your-domain.com/widget.js" data-chatbot-config="CONFIG_ID"></script>
 * 
 * Or with custom config (apiUrl is automatic - uses widget.js domain):
 * <script>
 *   window.LifeLinkConfig = {
 *     primaryColor: '#ff4757',
 *     buttonColor: '#ffa7c4',
 *     position: 'bottom-right' // or 'bottom-left'
 *   };
 * </script>
 * <script src="https://your-domain.com/widget.js"></script>
 */

(function () {
    'use strict';

    // Get widget's source URL to determine API endpoint
    function getWidgetOrigin() {
        // Try to get from current script tag
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            const src = scripts[i].src;
            if (src && src.includes('widget.js')) {
                try {
                    const url = new URL(src);
                    console.log('LifeLink Widget: Detected API URL from script source:', url.origin);
                    return url.origin;
                } catch (e) {
                    console.error('LifeLink Widget: Error parsing widget URL:', e);
                }
            }
        }
        // Fallback to hardcoded URL if detection fails
        console.log('LifeLink Widget: Using fallback API URL: https://eng.skillfusion.tech');
        return 'https://eng.skillfusion.tech';
    }

    // Default configuration
    const defaultConfig = {
        apiUrl: 'https://eng.skillfusion.tech',  // Connect to SkillFusion domain
        primaryColor: '#331013',
        buttonColor: '#9b224a',
        textColor: '#ffffff',
        position: 'bottom-right',
        buttonSize: 56,
        windowWidth: 400,
        windowHeight: 600,
        fontFamily: 'Manrope, sans-serif',
        brandName: 'SkillFusion'
    };

    console.log('LifeLink Widget v2.0: Initializing with API URL:', defaultConfig.apiUrl);

    // Merge user config with defaults
    const config = Object.assign({}, defaultConfig, window.LifeLinkConfig || {});

    // Get config from script tag data attribute
    const scriptTag = document.currentScript;
    if (scriptTag && scriptTag.dataset.chatbotConfig) {
        const configId = scriptTag.dataset.chatbotConfig;
        // Fetch config from server
        fetch(`${config.apiUrl}/widget-config/${configId}`)
            .then(res => res.json())
            .then(data => {
                Object.assign(config, data.config);
                initWidget();
            })
            .catch(() => initWidget());
    } else {
        initWidget();
    }

    function initWidget() {
        console.log('LifeLink Widget: Starting initialization...');
        console.log('LifeLink Widget: Parent page URL:', window.location.href);
        console.log('LifeLink Widget: Widget will connect to API at:', config.apiUrl + '/chat');

        // Load Font Awesome with multiple CDN fallbacks and proper integrity
        const fontAwesomeLink1 = document.createElement('link');
        fontAwesomeLink1.rel = 'stylesheet';
        fontAwesomeLink1.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        fontAwesomeLink1.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
        fontAwesomeLink1.crossOrigin = 'anonymous';
        fontAwesomeLink1.onload = function () {
            console.log('LifeLink Widget: Font Awesome loaded successfully from Cloudflare CDN');
        };
        fontAwesomeLink1.onerror = function () {
            console.warn('LifeLink Widget: Primary Font Awesome CDN failed, trying fallback...');
            // Fallback to jsDelivr CDN
            const fontAwesomeLink2 = document.createElement('link');
            fontAwesomeLink2.rel = 'stylesheet';
            fontAwesomeLink2.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css';
            fontAwesomeLink2.onload = function () {
                console.log('LifeLink Widget: Font Awesome loaded from fallback CDN (jsDelivr)');
            };
            fontAwesomeLink2.onerror = function () {
                console.error('LifeLink Widget: All Font Awesome CDNs failed to load!');
            };
            document.head.appendChild(fontAwesomeLink2);
        };
        document.head.appendChild(fontAwesomeLink1);

        // Load Google Fonts with preconnect for faster loading
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);

        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);

        const googleFontsLink = document.createElement('link');
        googleFontsLink.rel = 'stylesheet';
        googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap';
        document.head.appendChild(googleFontsLink);

        // Create widget HTML
        const widgetHTML = `
            <div id="lifelink-chatbot-widget">
                <!-- Floating Button -->
                <div id="lifelink-chat-button" class="lifelink-chat-button">
                    <i class="fas fa-comments"></i>
                </div>

                <!-- Chat Window -->
                <div id="lifelink-chat-window" class="lifelink-chat-window">
                    <!-- Header -->
                    <div class="lifelink-chat-header">
                        <div class="lifelink-chat-header-content">
                            <h2><i class="fas fa-life-ring"></i> LifeLink Assistant</h2>
                            <p><i class="fas fa-robot"></i> AI-Powered Disaster Response</p>
                        </div>
                        <div class="lifelink-close-chat">×</div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="lifelink-quick-actions">
                        <div class="lifelink-quick-actions-grid">
                            <button class="lifelink-weather-btn" id="lifelink-weather-alert">
                                <i class="fas fa-cloud-sun"></i> Weather Alert
                            </button>
                            <button class="lifelink-quick-btn" data-message="Earthquake safety"><i class="fas fa-house-damage"></i> Earthquake</button>
                            <button class="lifelink-quick-btn" data-message="Flood safety"><i class="fas fa-water"></i> Flood</button>
                            <button class="lifelink-quick-btn" data-message="Fire emergency"><i class="fas fa-fire"></i> Fire</button>
                            <button class="lifelink-quick-btn" data-message="Hurricane safety"><i class="fas fa-hurricane"></i> Hurricane</button>
                            <button class="lifelink-quick-btn" data-message="Tornado safety"><i class="fas fa-tornado"></i> Tornado</button>
                            <button class="lifelink-quick-btn" data-message="Wildfire safety"><i class="fas fa-fire-alt"></i> Wildfire</button>
                            <button class="lifelink-quick-btn" data-message="Tsunami safety"><i class="fas fa-wave"></i> Tsunami</button>
                            <button class="lifelink-quick-btn" data-message="Winter storm safety"><i class="fas fa-snowflake"></i> Winter</button>
                            <button class="lifelink-quick-btn" data-message="Heat wave safety"><i class="fas fa-temperature-high"></i> Heat</button>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div class="lifelink-chat-messages" id="lifelink-chat-messages">
                        <div class="lifelink-welcome-screen">
                            <h3><i class="fas fa-hand-wave"></i> Welcome to LifeLink!</h3>
                            <p>I'm your AI-powered disaster response assistant. Ask me about emergency safety guidelines.</p>
                        </div>
                        <div class="lifelink-typing-indicator" id="lifelink-typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="lifelink-chat-input">
                        <input 
                            type="text" 
                            id="lifelink-user-input" 
                            placeholder="Ask about emergency safety..."
                            autocomplete="off"
                        >
                        <button id="lifelink-send-button">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>

                    <!-- Footer -->
                    <div class="lifelink-powered-by">
                        Powered by <strong>${config.brandName}</strong>
                    </div>
                </div>
            </div>
        `;

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = widgetHTML;
        document.body.appendChild(widgetContainer);

        console.log('LifeLink Widget: HTML structure created and appended to body');

        // Inject CSS
        injectCSS();

        // Initialize widget functionality
        initializeWidget();

        console.log('LifeLink Widget: ✅ Initialization complete! Widget is ready.');
    }

    function injectCSS() {
        const position = config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;';

        const css = `
            #lifelink-chatbot-widget * {
                box-sizing: border-box;
                font-family: ${config.fontFamily};
            }

            .lifelink-chat-button {
                position: fixed;
                bottom: 20px;
                ${position}
                width: ${config.buttonSize}px;
                height: ${config.buttonSize}px;
                background: ${config.buttonColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${config.buttonSize * 0.4}px;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s;
                z-index: 999999;
                animation: lifelink-pulse 2s infinite;
            }

            .lifelink-chat-button i {
                color: white;
            }

            .lifelink-chat-button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            @keyframes lifelink-pulse {
                0%, 100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
                50% { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25); }
            }

            .lifelink-chat-window {
                position: fixed;
                bottom: 85px;
                ${position}
                width: ${config.windowWidth}px;
                height: ${config.windowHeight}px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                z-index: 999998;
                animation: lifelink-slideUp 0.3s ease-out;
            }

            .lifelink-chat-window.open {
                display: flex;
            }

            @keyframes lifelink-slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .lifelink-chat-header {
                background: ${config.primaryColor};
                color: white;
                padding: 18px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .lifelink-chat-header-content h2 {
                font-size: 18px;
                font-weight: 700;
                margin: 0 0 3px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .lifelink-chat-header-content h2 i,
            .lifelink-chat-header-content p i {
                color: white;
            }

            .lifelink-chat-header-content p {
                font-size: 12px;
                margin: 0;
                opacity: 0.95;
            }

            .lifelink-close-chat {
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 18px;
                color: white;
            }

            .lifelink-close-chat:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .lifelink-quick-actions {
                padding: 12px 16px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
                overflow-x: auto;
                white-space: nowrap;
            }

            .lifelink-quick-actions-grid {
                display: flex;
                gap: 8px;
            }

            .lifelink-quick-btn {
                padding: 6px 12px;
                background: white;
                border: 1.5px solid #e9ecef;
                color: #495057;
                border-radius: 16px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                white-space: nowrap;
            }

            .lifelink-quick-btn i {
                color: ${config.primaryColor};
                margin-right: 4px;
            }

            .lifelink-quick-btn:hover {
                background: ${config.primaryColor};
                color: white;
                border-color: ${config.primaryColor};
                transform: translateY(-2px);
            }

            .lifelink-quick-btn:hover i {
                color: white;
            }

            .lifelink-weather-btn {
                padding: 6px 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                border-radius: 16px;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }

            .lifelink-weather-btn i {
                color: white;
                margin-right: 4px;
            }

            .lifelink-weather-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
            }

            .lifelink-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
            }

            .lifelink-welcome-screen {
                text-align: center;
                padding: 20px 10px;
            }

            .lifelink-welcome-screen h3 {
                font-size: 18px;
                font-weight: 700;
                color: #2d3748;
                margin: 0 0 10px 0;
            }

            .lifelink-welcome-screen p {
                font-size: 13px;
                color: #718096;
                line-height: 1.6;
                margin: 0;
            }

            .lifelink-message {
                margin-bottom: 16px;
                display: flex;
                animation: lifelink-slideIn 0.3s ease-out;
            }

            @keyframes lifelink-slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .lifelink-message.user {
                justify-content: flex-end;
            }

            .lifelink-message-bubble {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 16px;
                line-height: 1.6;
                font-size: 13px;
            }

            .lifelink-message.user .lifelink-message-bubble {
                background: ${config.primaryColor};
                color: white;
                border-bottom-right-radius: 4px;
            }

            .lifelink-message.bot .lifelink-message-bubble {
                background: white;
                color: #2d3748;
                border: 1px solid #e2e8f0;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            .lifelink-message.bot .lifelink-message-bubble strong {
                color: ${config.primaryColor};
                font-weight: 700;
            }

            .lifelink-gemini-badge {
                display: inline-block;
                background: linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc04 75%, #ea4335 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 700;
                margin-top: 8px;
            }

            .lifelink-typing-indicator {
                display: none;
                padding: 12px 16px;
                background: white;
                border-radius: 16px;
                width: fit-content;
                border: 1px solid #e2e8f0;
            }

            .lifelink-typing-indicator.active {
                display: block;
            }

            .lifelink-typing-indicator span {
                display: inline-block;
                width: 8px;
                height: 8px;
                background: ${config.primaryColor};
                border-radius: 50%;
                margin: 0 2px;
                animation: lifelink-typing 1.4s infinite;
            }

            .lifelink-typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .lifelink-typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes lifelink-typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-8px);
                }
            }

            .lifelink-chat-input {
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #e9ecef;
                display: flex;
                gap: 10px;
                align-items: center;
            }

            #lifelink-user-input {
                flex: 1;
                padding: 10px 14px;
                border: 2px solid #e9ecef;
                border-radius: 20px;
                font-size: 13px;
                outline: none;
                transition: all 0.3s;
                background: #f8f9fa;
            }

            #lifelink-user-input:focus {
                border-color: ${config.primaryColor};
                background: white;
                box-shadow: 0 0 0 3px ${config.primaryColor}20;
            }

            #lifelink-send-button {
                width: 40px;
                height: 40px;
                background: ${config.primaryColor};
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
                box-shadow: 0 3px 10px ${config.primaryColor}40;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #lifelink-send-button:hover:not(:disabled) {
                transform: scale(1.08);
                box-shadow: 0 4px 15px ${config.primaryColor}60;
            }

            #lifelink-send-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .lifelink-powered-by {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                text-align: center;
                font-size: 10px;
                color: #6c757d;
            }

            .lifelink-powered-by strong {
                color: ${config.primaryColor};
                font-weight: 700;
            }

            @media (max-width: 768px) {
                .lifelink-chat-window {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100vh;
                    border-radius: 0;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function initializeWidget() {
        const chatButton = document.getElementById('lifelink-chat-button');
        const chatWindow = document.getElementById('lifelink-chat-window');
        const closeButton = document.querySelector('.lifelink-close-chat');
        const sendButton = document.getElementById('lifelink-send-button');
        const userInput = document.getElementById('lifelink-user-input');
        const chatMessages = document.getElementById('lifelink-chat-messages');
        const typingIndicator = document.getElementById('lifelink-typing-indicator');
        const quickButtons = document.querySelectorAll('.lifelink-quick-btn');
        const weatherButton = document.getElementById('lifelink-weather-alert');

        // Verify all elements loaded
        if (!chatButton || !chatWindow) {
            console.error('LifeLink Widget: ERROR - Widget elements not found! Chat button:', chatButton, 'Chat window:', chatWindow);
            return;
        }

        console.log('LifeLink Widget: All UI elements loaded successfully');
        console.log('LifeLink Widget: Button position:', config.position);
        console.log('LifeLink Widget: Colors - Primary:', config.primaryColor, ', Button:', config.buttonColor);

        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        let isProcessing = false;

        // Toggle chat window
        chatButton.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                userInput.focus();
            }
        });

        closeButton.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });

        // Quick action buttons
        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                userInput.value = message;
                sendMessage();
            });
        });

        // Weather alert button
        if (weatherButton) {
            weatherButton.addEventListener('click', () => {
                getWeatherAlert();
            });
        }

        // Send message on Enter
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Send button click
        sendButton.addEventListener('click', sendMessage);

        function sendMessage() {
            if (isProcessing) return;

            const message = userInput.value.trim();
            if (!message) return;

            isProcessing = true;
            sendButton.disabled = true;

            // Add user message
            addMessage(message, 'user');
            userInput.value = '';

            // Show typing indicator
            typingIndicator.classList.add('active');
            scrollToBottom();

            // Send to API
            fetch(`${config.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId
                })
            })
                .then(res => res.json())
                .then(data => {
                    typingIndicator.classList.remove('active');
                    if (data.success) {
                        addMessage(data.response, 'bot');
                    } else {
                        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                    }
                })
                .catch(error => {
                    typingIndicator.classList.remove('active');
                    addMessage('Connection error. Please try again.', 'bot');
                    console.error('LifeLink Widget Error:', error);
                })
                .finally(() => {
                    isProcessing = false;
                    sendButton.disabled = false;
                    userInput.focus();
                });
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `lifelink-message ${sender}`;

            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'lifelink-message-bubble';

            // Check for Gemini attribution
            if (text.includes('Powered by Google Gemini')) {
                const parts = text.split('━━━━━━━━━━━━━━━━━━━━━━━━');
                const mainContent = parts[0].trim();

                bubbleDiv.innerHTML = formatMessage(mainContent);

                const geminiBadge = document.createElement('div');
                geminiBadge.className = 'lifelink-gemini-badge';
                geminiBadge.textContent = '✨ Powered by Google Gemini 2.0 Flash';
                bubbleDiv.appendChild(geminiBadge);
            } else {
                bubbleDiv.innerHTML = formatMessage(text);
            }

            messageDiv.appendChild(bubbleDiv);
            chatMessages.appendChild(messageDiv);
            scrollToBottom();
        }

        function formatMessage(text) {
            // Format text with bold, remove asterisks
            let formatted = text;
            formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/\*/g, '');

            // Convert to paragraphs
            const lines = formatted.split('\n');
            let result = [];
            let inList = false;

            for (let line of lines) {
                if (line.trim().match(/^[🆘✅📞💡•\d]/)) {
                    if (!inList) {
                        result.push('<ul style="margin: 8px 0; padding-left: 20px;">');
                        inList = true;
                    }
                    result.push('<li style="margin: 4px 0;">' + line.trim() + '</li>');
                } else {
                    if (inList) {
                        result.push('</ul>');
                        inList = false;
                    }
                    if (line.trim()) {
                        result.push('<p style="margin: 4px 0;">' + line.trim() + '</p>');
                    }
                }
            }

            if (inList) {
                result.push('</ul>');
            }

            return result.join('');
        }

        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function getWeatherAlert() {
            if (isProcessing) return;

            isProcessing = true;
            weatherButton.disabled = true;

            // Show typing indicator
            typingIndicator.classList.add('active');
            scrollToBottom();

            // Get user's location or use default
            let location = 'New York'; // Default location

            // Try to get user's location from browser
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // We have coordinates, but for simplicity we'll use IP-based location
                        fetchWeather(location);
                    },
                    () => {
                        // Geolocation failed, use default
                        fetchWeather(location);
                    }
                );
            } else {
                fetchWeather(location);
            }
        }

        function fetchWeather(location) {
            fetch(`${config.apiUrl}/weather-alert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: location
                })
            })
                .then(res => res.json())
                .then(data => {
                    typingIndicator.classList.remove('active');
                    if (data.success) {
                        addMessage(data.alert, 'bot');
                    } else {
                        addMessage('Sorry, I could not fetch the weather alert. Please try again.', 'bot');
                    }
                })
                .catch(error => {
                    typingIndicator.classList.remove('active');
                    addMessage('Connection error. Could not fetch weather data.', 'bot');
                    console.error('LifeLink Weather Error:', error);
                })
                .finally(() => {
                    isProcessing = false;
                    weatherButton.disabled = false;
                });
        }
    }
})();
