"""
Test ChatGPT Fallback Integration
This demonstrates how the chatbot uses ChatGPT for complex questions
"""

from chatbot import DisasterChatbot

def test_chatgpt_integration():
    print("\n" + "="*70)
    print("🧪 TESTING CHATGPT FALLBACK INTEGRATION")
    print("="*70 + "\n")
    
    print("Initializing chatbot with ChatGPT fallback...")
    chatbot = DisasterChatbot()
    print("✓ Chatbot initialized!\n")
    
    # Test cases: Mix of knowledge base and ChatGPT questions
    test_questions = [
        # These should use knowledge base (fast)
        ("What should I do during an earthquake?", "Knowledge Base"),
        ("Flood safety tips", "Knowledge Base"),
        
        # These should use ChatGPT fallback (complex questions)
        ("How do I perform CPR on someone during a flood emergency?", "ChatGPT Fallback"),
        ("My child is injured in an earthquake, what medical steps should I take?", "ChatGPT Fallback"),
        ("Why do tornadoes form and when are they most dangerous?", "ChatGPT Fallback"),
        ("Where is the safest place for my pets during a hurricane?", "ChatGPT Fallback"),
    ]
    
    print("Running test conversations...\n")
    print("="*70 + "\n")
    
    for i, (question, expected_source) in enumerate(test_questions, 1):
        print(f"TEST {i} [{expected_source}]:")
        print(f"User: {question}")
        print(f"\nBot Response:")
        print("-" * 70)
        
        response = chatbot.chat(question)
        print(response)
        
        # Check if ChatGPT was used
        if "Powered by ChatGPT" in response:
            print("\n✅ Used: ChatGPT Fallback")
        else:
            print("\n✅ Used: Knowledge Base")
        
        print("\n" + "="*70 + "\n")
    
    print("✓ All tests completed!")
    print("\n💡 Summary:")
    print("- Knowledge Base: Fast, structured safety guidelines")
    print("- ChatGPT Fallback: Detailed answers for complex/specific questions")
    print("- Both sources provide life-saving information!")

if __name__ == "__main__":
    test_chatgpt_integration()
