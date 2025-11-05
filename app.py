"""
Flask Web Application for Disaster Response Chatbot
Provides a web interface for victims to chat with AI
"""

from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_cors import CORS
from chatbot import DisasterChatbot
from weather_service import WeatherAlertService
import os
from datetime import datetime
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
CORS(app)

# Disable template caching for development
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.after_request
def add_header(response):
    """Add headers to prevent caching"""
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

# Initialize chatbot
print("Initializing chatbot...")
chatbot = DisasterChatbot()
print("Chatbot ready!")

# Initialize weather service
print("Initializing weather service...")
weather_service = WeatherAlertService()
print("Weather service ready!")

# Store user sessions
user_sessions = {}

@app.route('/')
def home():
    """Render the main chat interface"""
    response = render_template('index.html')
    return response

@app.route('/configurator')
def configurator():
    """Render the widget configurator"""
    response = render_template('configurator.html')
    return response

@app.route('/widget.js')
def widget_js():
    """Serve the widget JavaScript file"""
    return send_from_directory('.', 'widget.js', mimetype='application/javascript')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Empty message'
            }), 400
        
        # Get or create session
        if session_id not in user_sessions:
            user_sessions[session_id] = DisasterChatbot()
        
        user_chatbot = user_sessions[session_id]
        
        # Generate response
        response = user_chatbot.chat(user_message)
        
        return jsonify({
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/emergency-contacts', methods=['GET'])
def emergency_contacts():
    """Get emergency contact information"""
    try:
        contacts = chatbot.get_emergency_contacts()
        return jsonify({
            'success': True,
            'contacts': contacts
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/disaster-types', methods=['GET'])
def disaster_types():
    """Get list of supported disaster types"""
    try:
        return jsonify({
            'success': True,
            'disaster_types': list(chatbot.knowledge.keys())
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/reset', methods=['POST'])
def reset():
    """Reset conversation for a session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id', 'default')
        
        if session_id in user_sessions:
            user_sessions[session_id].reset_conversation()
        
        return jsonify({
            'success': True,
            'message': 'Conversation reset'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/weather-alert', methods=['POST'])
def weather_alert():
    """Get weather alert with AI recommendations"""
    try:
        data = request.get_json()
        location = data.get('location', 'New York')
        
        alert = weather_service.get_weather_alert(location)
        
        if alert['success']:
            return jsonify({
                'success': True,
                'alert': alert['message'],
                'weather': alert['weather'],
                'recommendations': alert['recommendations']
            })
        else:
            return jsonify({
                'success': False,
                'error': alert.get('error', 'Failed to fetch weather')
            }), 500
    
    except Exception as e:
        print(f"Error in weather-alert endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/weather', methods=['GET'])
def weather():
    """Get current weather for a location (GET request)"""
    try:
        location = request.args.get('location', 'New York')
        alert = weather_service.get_weather_alert(location)
        
        if alert['success']:
            return jsonify({
                'success': True,
                'alert': alert['message'],
                'weather': alert['weather'],
                'recommendations': alert['recommendations']
            })
        else:
            return jsonify({
                'success': False,
                'error': alert.get('error', 'Failed to fetch weather')
            }), 500
    
    except Exception as e:
        print(f"Error in weather endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n{'='*60}")
    print(f"🚨 DISASTER RESPONSE CHATBOT SERVER")
    print(f"{'='*60}")
    print(f"Server starting on http://localhost:{port}")
    print(f"Open your browser and navigate to the URL above")
    print(f"{'='*60}\n")
    
    app.run(host='0.0.0.0', port=port, debug=True)
