"""
Disaster Response Chatbot - Inference Engine
This handles the chatbot conversation and response generation
"""

# Try to import torch and transformers (optional for Gemini-only mode)
try:
    import torch
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("⚠️ PyTorch not available - running in Gemini-only mode")

import json
import re
import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime

# Load environment variables
load_dotenv()

class DisasterChatbot:
    def __init__(self, model_path="./disaster_chatbot_model", knowledge_file="disaster_knowledge_extended.json", learned_responses_file="learned_responses.json"):
        """
        Initialize the chatbot with self-learning capability
        Args:
            model_path: Path to the trained model
            knowledge_file: Path to disaster knowledge JSON
            learned_responses_file: Path to save learned responses from Gemini
        """
        self.learned_responses_file = learned_responses_file
        
        # Load learned responses (saved from Gemini)
        self.learned_responses = self._load_learned_responses()
        # Set device only if torch is available
        if TORCH_AVAILABLE:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = None
            
        print(f"Loading model from {model_path}...")
        
        # Initialize Google Gemini client for fallback
        # Try to read API key from .env (first line after comment)
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        
        # If not found as env var, read directly from .env file
        if not self.gemini_api_key:
            try:
                with open('.env', 'r') as f:
                    lines = f.readlines()
                    for line in lines:
                        line = line.strip()
                        if line and not line.startswith('#') and 'AIza' in line:
                            self.gemini_api_key = line
                            break
            except:
                pass
        
        if self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                self.gemini_available = True
                print("✓ Gemini 2.0 Flash fallback enabled")
            except Exception as e:
                print(f"Warning: Gemini fallback unavailable: {e}")
                self.gemini_available = False
        else:
            self.gemini_available = False
            print("ℹ️  Gemini fallback not configured (add API key to .env)")
        
        # Try to load local model only if PyTorch is available
        self.model_loaded = False
        if TORCH_AVAILABLE:
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(model_path)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
                self.model.to(self.device)
                self.model.eval()
                self.model_loaded = True
                print("✓ Custom trained model loaded successfully")
            except Exception as e:
                print(f"Warning: Could not load custom model: {e}")
                try:
                    print("Loading base model instead...")
                    self.tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
                    self.model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
                    self.model.to(self.device)
                    self.model.eval()
                    self.model_loaded = False
                    print("✓ Base model loaded successfully")
                except Exception as e2:
                    print(f"Warning: Could not load base model either: {e2}")
                    print("ℹ️  Running in Gemini-only mode")
                    self.model_loaded = False
        else:
            print("ℹ️  PyTorch not available - using Gemini API only")
        
        # Load extended knowledge base
        try:
            with open(knowledge_file, 'r', encoding='utf-8') as f:
                self.knowledge = json.load(f)
            print(f"✓ Loaded extended knowledge base with {len(self.knowledge)} disaster types")
        except Exception as e:
            print(f"Warning: Extended knowledge base not found ({e}), loading basic version...")
            try:
                with open('disaster_knowledge.json', 'r', encoding='utf-8') as f:
                    self.knowledge = json.load(f)
            except:
                print("Warning: No knowledge base found")
                self.knowledge = {}
        
        self.conversation_history = []
        
        print(f"✓ Loaded {len(self.learned_responses)} learned responses from previous conversations")
    
    def _load_learned_responses(self):
        """Load previously learned responses from file"""
        try:
            if os.path.exists(self.learned_responses_file):
                with open(self.learned_responses_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Note: Could not load learned responses: {e}")
            return {}
    
    def _save_learned_response(self, question, answer, disaster_type='general'):
        """
        Save a new learned response from Gemini
        This builds our knowledge base automatically
        """
        try:
            # Create a normalized key from the question
            key = question.lower().strip()
            
            # Save the response with metadata
            self.learned_responses[key] = {
                'question': question,
                'answer': answer,
                'disaster_type': disaster_type,
                'learned_from': 'gemini',
                'timestamp': datetime.now().isoformat(),
                'usage_count': 1
            }
            
            # Save to file
            with open(self.learned_responses_file, 'w', encoding='utf-8') as f:
                json.dump(self.learned_responses, f, indent=2, ensure_ascii=False)
            
            print(f"✓ Learned new response: '{question[:50]}...'")
            return True
            
        except Exception as e:
            print(f"Error saving learned response: {e}")
            return False
    
    def _find_similar_learned_response(self, question):
        """
        Search learned responses for similar questions
        Uses keyword matching to find relevant saved responses
        """
        question_lower = question.lower()
        question_words = set(question_lower.split())
        
        best_match = None
        best_score = 0
        
        for key, response_data in self.learned_responses.items():
            # Calculate similarity score (simple word overlap)
            key_words = set(key.split())
            overlap = len(question_words & key_words)
            score = overlap / max(len(question_words), len(key_words))
            
            # If high similarity, use this response
            if score > best_score and score > 0.5:  # 50% word overlap threshold
                best_score = score
                best_match = response_data
        
        if best_match:
            # Increment usage count
            best_match['usage_count'] = best_match.get('usage_count', 0) + 1
            self._save_learned_responses()
            
            print(f"✓ Found similar learned response (similarity: {best_score:.2%})")
            return best_match['answer']
        
        return None
    
    def _save_learned_responses(self):
        """Save all learned responses to file"""
        try:
            with open(self.learned_responses_file, 'w', encoding='utf-8') as f:
                json.dump(self.learned_responses, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving learned responses: {e}")
        
    def detect_disaster_type(self, message):
        """Detect the type of disaster from the message"""
        message_lower = message.lower()
        
        disaster_keywords = {
            'earthquake': ['earthquake', 'quake', 'tremor', 'seismic', 'shaking', 'aftershock'],
            'flood': ['flood', 'flooding', 'water rising', 'overflow', 'inundation', 'flash flood'],
            'fire': ['fire', 'burning', 'smoke', 'flames', 'blaze', 'wildfire'],
            'hurricane': ['hurricane', 'cyclone', 'typhoon', 'tropical storm'],
            'tornado': ['tornado', 'twister', 'funnel cloud'],
            'winter_storm': ['winter storm', 'blizzard', 'ice storm', 'snow storm', 'freezing', 'frostbite', 'hypothermia'],
            'tsunami': ['tsunami', 'tidal wave', 'sea wave'],
            'wildfire': ['wildfire', 'forest fire', 'brush fire', 'bushfire'],
            'heat_wave': ['heat wave', 'extreme heat', 'heat stroke', 'hot weather']
        }
        
        for disaster_type, keywords in disaster_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return disaster_type
        
        return 'general_disaster'
    
    def get_knowledge_response(self, disaster_type, query_type='general'):
        """Get response from knowledge base"""
        if disaster_type not in self.knowledge:
            disaster_type = 'general_disaster'
        
        info = self.knowledge[disaster_type]
        disaster_name = disaster_type.replace('_', ' ').title()
        
        if 'what should i do' in query_type or 'help' in query_type:
            response = f"🆘 **{disaster_name} Safety Guidelines**\n\n"
            response += "✅ **DO:**\n"
            for i, do in enumerate(info['dos'][:5], 1):
                response += f"{i}. {do}\n"
            response += "\n❌ **DON'T:**\n"
            for i, dont in enumerate(info['donts'][:5], 1):
                response += f"{i}. {dont}\n"
            response += "\n💡 Stay calm and follow these guidelines. Help is available."
            return response
        
        elif 'avoid' in query_type or "don't" in query_type or 'not do' in query_type:
            response = f"❌ **What to AVOID during {disaster_name}:**\n\n"
            for i, dont in enumerate(info['donts'][:7], 1):
                response += f"{i}. {dont}\n"
            return response
        
        else:  # Default to do's
            response = f"✅ **What to DO during {disaster_name}:**\n\n"
            for i, do in enumerate(info['dos'][:7], 1):
                response += f"{i}. {do}\n"
            return response
    
    def ask_gemini(self, user_message, disaster_type='general_disaster', save_for_learning=True):
        """
        Fallback to Google Gemini for questions outside our knowledge base
        Automatically saves responses to build knowledge base
        """
        if not self.gemini_available:
            return None
        
        try:
            # Create a disaster-focused prompt for Gemini
            disaster_name = disaster_type.replace('_', ' ').title()
            
            prompt = f"""You are a disaster response expert assistant providing emergency guidance.

Emergency Context: {disaster_name}
Question: {user_message}

Provide clear, actionable safety advice with:
- Clear do's and don'ts
- Prioritize life safety
- Be concise but comprehensive (max 300 words)
- Use bullet points or numbered lists
- Include emergency contact reminders when relevant

Response:"""
            
            response = self.gemini_model.generate_content(prompt)
            gemini_response = response.text
            
            # Save this response for future learning
            if save_for_learning:
                self._save_learned_response(user_message, gemini_response, disaster_type)
            
            # Add attribution
            attributed_response = f"{gemini_response}\n\n"
            attributed_response += "━━━━━━━━━━━━━━━━━━━━━━━━\n"
            attributed_response += "🤖 *Powered by Google Gemini 2.0 Flash*\n"
            attributed_response += "💾 *This response has been saved for future learning*\n"
            attributed_response += "⚠️ For emergencies, call 911 first!"
            
            return attributed_response
            
        except Exception as e:
            print(f"Gemini fallback error: {e}")
            return None
    
    def should_use_gemini_fallback(self, user_message, disaster_type):
        """
        Determine if we should use Gemini fallback
        Returns True if the question is outside our knowledge base scope
        """
        user_message_lower = user_message.lower()
        
        # Keywords that our knowledge base handles well
        core_keywords = [
            'what should i do', 'what do i do', 'help', 'safety', 'tips',
            'avoid', "don't", 'should not', 'guidelines', 'advice',
            'during', 'emergency', 'danger'
        ]
        
        # If message contains core keywords, use knowledge base
        if any(keyword in user_message_lower for keyword in core_keywords):
            return False
        
        # For other questions (medical, specific situations, etc.), use ChatGPT
        complex_keywords = [
            'why', 'how', 'when', 'where', 'who',
            'medical', 'injury', 'first aid', 'medicine',
            'children', 'baby', 'pregnant', 'elderly',
            'pet', 'animal', 'vehicle', 'specific'
        ]
        
        if any(keyword in user_message_lower for keyword in complex_keywords):
            return True
        
        # For very short messages, use knowledge base
        if len(user_message.split()) < 4:
            return False
        
        return False  # Default to knowledge base
    
    def generate_response(self, user_message):
        """Generate a response to user message with self-learning capability"""
        user_message_lower = user_message.lower().strip()
        
        # STEP 1: Check if we've learned this response before
        learned_response = self._find_similar_learned_response(user_message)
        if learned_response:
            # We found a similar question we learned before!
            return f"{learned_response}\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n📚 *Response from learned knowledge base*\n⚠️ For emergencies, call 911 first!"
        
        # Handle greetings and casual messages (more flexible detection)
        greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'hi there', 'hello there']
        # Check if message starts with or contains greeting
        is_greeting = any(user_message_lower.startswith(greeting) or greeting in user_message_lower for greeting in greetings)
        # Also check if it's a short message with a greeting
        is_short_greeting = is_greeting and len(user_message.split()) <= 6
        
        if is_greeting or is_short_greeting:
            # Extract name if provided
            name_match = ""
            if "i am " in user_message_lower or "i'm " in user_message_lower:
                # Try to extract name
                parts = user_message.replace("I'm", "I am").split("I am")
                if len(parts) > 1:
                    name = parts[1].strip().rstrip('!').rstrip('.').strip()
                    name_match = f"Nice to meet you, {name}!\n\n"
            
            return f"""👋 {name_match}I'm your LifeLink Disaster Response Assistant.

I'm here to help you during emergencies. I can provide:

🆘 Safety guidelines for various disasters
✅ Do's and Don'ts for emergency situations
📞 Emergency contact information
💡 Immediate action steps

You can ask me things like:
• "What should I do during an earthquake?"
• "Flood safety tips"
• "Fire emergency help"
• "Hurricane preparation"

Type your question or click a quick action button above! 🚨"""
        
        # Handle thank you messages
        thank_you = ['thank', 'thanks', 'appreciate', 'grateful']
        if any(word in user_message_lower for word in thank_you) and len(user_message.split()) < 5:
            return """You're welcome! 😊 Stay safe and remember:

🚨 **In life-threatening emergencies, always call 911 first!**

I'm here if you need more safety information or have other questions about disaster preparedness.

Take care! 🙏"""
        
        # Detect disaster type
        disaster_type = self.detect_disaster_type(user_message)
        
        # STEP 2: Check if we should use Gemini fallback for complex questions
        # Gemini will automatically save the response for learning
        if self.gemini_available and self.should_use_gemini_fallback(user_message, disaster_type):
            print(f"🤖 Using Gemini for new question: {user_message[:50]}...")
            gemini_response = self.ask_gemini(user_message, disaster_type, save_for_learning=True)
            if gemini_response:
                return gemini_response
        
        # Check for specific intents (use knowledge base)
        if any(word in user_message_lower for word in ['help', 'what do', 'what should', 'need advice']):
            return self.get_knowledge_response(disaster_type, 'help')
        
        elif any(word in user_message_lower for word in ['avoid', "don't", 'not do', 'should not']):
            return self.get_knowledge_response(disaster_type, 'avoid')
        
        elif any(word in user_message_lower for word in ['safety', 'tip', 'advice', 'guide']):
            return self.get_knowledge_response(disaster_type, 'general')
        
        # Generate response using model
        if self.model_loaded:
            try:
                # Prepare input
                input_text = f"Disaster emergency: {user_message}"
                inputs = self.tokenizer(
                    input_text,
                    return_tensors="pt",
                    max_length=256,
                    truncation=True
                ).to(self.device)
                
                # Generate
                with torch.no_grad():
                    outputs = self.model.generate(
                        **inputs,
                        max_length=256,
                        num_beams=4,
                        temperature=0.7,
                        do_sample=True,
                        top_p=0.9,
                        no_repeat_ngram_size=3
                    )
                
                response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                
                # If model response is too short or generic, try Gemini
                if len(response) < 50 and self.gemini_available:
                    print("Model response too short, trying Gemini fallback...")
                    gemini_response = self.ask_gemini(user_message, disaster_type, save_for_learning=True)
                    if gemini_response:
                        return gemini_response
                
                # Enhance with knowledge base if response is generic
                if len(response) < 50:
                    knowledge_response = self.get_knowledge_response(disaster_type, 'help')
                    return f"{response}\n\n{knowledge_response}"
                
                return response
            
            except Exception as e:
                print(f"Error generating response: {e}")
                # Try Gemini fallback with learning enabled
                if self.gemini_available:
                    gemini_response = self.ask_gemini(user_message, disaster_type, save_for_learning=True)
                    if gemini_response:
                        return gemini_response
                # Fall back to knowledge base
                return self.get_knowledge_response(disaster_type, 'help')
        
        else:
            # Model not trained - try Gemini first for complex questions
            if self.gemini_available and len(user_message.split()) > 5:
                gemini_response = self.ask_gemini(user_message, disaster_type, save_for_learning=True)
                if gemini_response:
                    return gemini_response
            
            # Use knowledge base if model not trained
            return self.get_knowledge_response(disaster_type, 'help')
    
    def chat(self, user_message):
        """Main chat interface"""
        # Add to conversation history
        self.conversation_history.append({
            'role': 'user',
            'content': user_message
        })
        
        # Generate response
        response = self.generate_response(user_message)
        
        # Add to conversation history
        self.conversation_history.append({
            'role': 'assistant',
            'content': response
        })
        
        return response
    
    def get_emergency_contacts(self):
        """Return emergency contact information"""
        return """
🚨 **EMERGENCY CONTACTS**

**Universal Emergency Number:** 
- Call 911 (USA)
- Call 112 (Europe/International)

**Disaster-Specific:**
- Red Cross: 1-800-RED-CROSS (1-800-733-2767)
- FEMA: 1-800-621-3362
- Poison Control: 1-800-222-1222
- Suicide Prevention: 988

**Important:**
- Only call if you're in immediate danger
- Text to 911 if calling isn't possible
- Give your location first
- Stay on the line with dispatcher

Remember: Your safety is the priority! 🙏
"""
    
    def reset_conversation(self):
        """Reset conversation history"""
        self.conversation_history = []

if __name__ == "__main__":
    # Test the chatbot
    print("Initializing Disaster Response Chatbot...")
    chatbot = DisasterChatbot()
    
    print("\n" + "="*60)
    print("DISASTER RESPONSE CHATBOT")
    print("="*60)
    print("Type your emergency or question. Type 'quit' to exit.")
    print("Type 'emergency' for emergency contact numbers.")
    print("="*60 + "\n")
    
    while True:
        user_input = input("You: ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("\nStay safe! Remember to follow emergency guidelines.")
            break
        
        if user_input.lower() == 'emergency':
            print(chatbot.get_emergency_contacts())
            continue
        
        if not user_input:
            continue
        
        response = chatbot.chat(user_input)
        print(f"\nChatbot: {response}\n")
