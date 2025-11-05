"""
Quick test to check if chatbot and Gemini are working
"""
import sys
sys.path.insert(0, 'd:/LifeLinkChatbot')

from chatbot import DisasterChatbot

print("=" * 60)
print("Testing LifeLink Chatbot with Gemini Integration")
print("=" * 60)

# Initialize chatbot
print("\n1. Initializing chatbot...")
bot = DisasterChatbot()

print("\n2. Testing simple greeting...")
response = bot.chat("Hi")
print(f"Response: {response[:200]}...")

print("\n3. Testing knowledge base (earthquake)...")
response = bot.chat("What should I do during an earthquake?")
print(f"Response: {response[:200]}...")

print("\n4. Testing complex question (should use Gemini)...")
response = bot.chat("What magnitude of earthquake is the most dangerous?")
print(f"Response: {response[:500]}...")

if "Gemini" in response:
    print("\n✅ Gemini is working!")
else:
    print("\n⚠️ Response might be from knowledge base or model")

print("\n" + "=" * 60)
print("Test complete!")
print("=" * 60)
