/**
 * ChatbotService - AI-powered chatbot integration
 * Connects to LifeLink chatbot backend for intelligent responses
 */

import axios from 'axios';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatResponse {
    message: string;
    mood?: string;
    confidence?: number;
}

export class ChatbotService {
    private apiUrl: string;
    private conversationHistory: ChatMessage[] = [];
    private maxHistoryLength: number = 10;

    constructor(apiUrl: string = 'http://localhost:5000') {
        this.apiUrl = apiUrl;
    }

    async sendMessage(userMessage: string): Promise<ChatResponse> {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date()
            });

            // Call LifeLink chatbot API
            const response = await axios.post(`${this.apiUrl}/chat`, {
                message: userMessage,
                history: this.conversationHistory.slice(-5) // Send last 5 messages for context
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const assistantMessage = response.data.response || response.data.message;
            
            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage,
                timestamp: new Date()
            });

            // Trim history if too long
            if (this.conversationHistory.length > this.maxHistoryLength) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
            }

            return {
                message: assistantMessage,
                mood: this.detectMood(assistantMessage),
                confidence: response.data.confidence || 0.8
            };

        } catch (error) {
            console.error('Chatbot API error:', error);
            
            // Fallback to rule-based responses
            return this.getFallbackResponse(userMessage);
        }
    }

    private getFallbackResponse(message: string): ChatResponse {
        const messageLower = message.toLowerCase();

        // Coding help
        if (messageLower.includes('error') || messageLower.includes('bug')) {
            return {
                message: "I see you're dealing with an error! Don't worry, debugging is part of the journey. Can you tell me more about what's happening? 🐛",
                mood: 'thinking',
                confidence: 0.7
            };
        }

        if (messageLower.includes('help') || messageLower.includes('how')) {
            return {
                message: "I'm here to help! Whether it's coding questions, weather updates, or just chatting - I'm all ears! What do you need? 💡",
                mood: 'happy',
                confidence: 0.8
            };
        }

        // Weather queries
        if (messageLower.includes('weather') || messageLower.includes('temperature')) {
            return {
                message: "Let me check the weather for you! I can show you current conditions and give you smart recommendations. Want me to check? ☀️",
                mood: 'excited',
                confidence: 0.9
            };
        }

        // Greetings
        if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
            return {
                message: "Hey there, awesome coder! 👋 I'm your friendly coding companion. How can I make your day better?",
                mood: 'happy',
                confidence: 0.95
            };
        }

        // Motivation
        if (messageLower.includes('tired') || messageLower.includes('stuck')) {
            return {
                message: "Take a deep breath! 🌟 Every great developer faces challenges. Remember: bugs are just undocumented features waiting to be discovered! You've got this! 💪",
                mood: 'celebrating',
                confidence: 0.8
            };
        }

        // Default response
        return {
            message: "That's interesting! Tell me more about what you're working on. I'm here to help with coding questions, weather updates, or just a friendly chat! 😊",
            mood: 'curious',
            confidence: 0.6
        };
    }

    private detectMood(message: string): string {
        const messageLower = message.toLowerCase();
        
        if (messageLower.includes('great') || messageLower.includes('awesome') || messageLower.includes('perfect')) {
            return 'celebrating';
        }
        if (messageLower.includes('think') || messageLower.includes('consider') || messageLower.includes('maybe')) {
            return 'thinking';
        }
        if (messageLower.includes('!') || messageLower.includes('😊') || messageLower.includes('😃')) {
            return 'excited';
        }
        
        return 'happy';
    }

    clearHistory(): void {
        this.conversationHistory = [];
    }

    getHistory(): ChatMessage[] {
        return [...this.conversationHistory];
    }

    setApiUrl(url: string): void {
        this.apiUrl = url;
    }
}
