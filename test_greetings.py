"""
Quick test for greeting responses
"""

from chatbot import DisasterChatbot

print("Initializing chatbot...")
chatbot = DisasterChatbot()
print("\n" + "="*70)

# Test greetings
test_messages = [
    "Hi",
    "Hello",
    "Hey there",
    "Good morning",
    "What should I do during an earthquake?",
    "Thanks",
    "Thank you so much",
]

for msg in test_messages:
    print(f"\nUser: {msg}")
    print("-" * 70)
    response = chatbot.chat(msg)
    print(f"Bot: {response}")
    print("="*70)
