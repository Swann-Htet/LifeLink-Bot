"""
Test the chatbot without training (uses knowledge base only)
This is useful for quick testing before training the AI model
"""

from chatbot import DisasterChatbot

def test_chatbot():
    print("\n" + "="*70)
    print("🧪 TESTING DISASTER RESPONSE CHATBOT (KNOWLEDGE BASE MODE)")
    print("="*70 + "\n")
    
    print("Initializing chatbot...")
    chatbot = DisasterChatbot()
    print("✓ Chatbot initialized!\n")
    
    # Test cases
    test_questions = [
        "What should I do during an earthquake?",
        "I'm experiencing a flood, help me!",
        "Fire emergency tips please",
        "What should I avoid during a hurricane?",
        "Tornado safety guidelines",
    ]
    
    print("Running test conversations...\n")
    print("="*70 + "\n")
    
    for i, question in enumerate(test_questions, 1):
        print(f"TEST {i}:")
        print(f"User: {question}")
        print(f"\nBot Response:")
        print("-" * 70)
        
        response = chatbot.chat(question)
        print(response)
        print("\n" + "="*70 + "\n")
    
    print("✓ All tests completed successfully!")
    print("\n💡 The chatbot is working with the knowledge base.")
    print("📚 For AI-enhanced responses, train the model with: python train_model.py")
    print("\n🌐 To use the web interface, run: python app.py")

if __name__ == "__main__":
    test_chatbot()
