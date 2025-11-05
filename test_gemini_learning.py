#!/usr/bin/env python3
import requests
import json
import time

# Test with a specific question that will trigger Gemini
url = "http://localhost:5001/chat"
data = {
    "message": "What specific preparations should I make for a 9.5 magnitude mega earthquake in Tokyo, Japan?",
    "session_id": "test_gemini_123"
}

print("Testing Gemini response and self-learning...")
print(f"Question: {data['message']}\n")

response = requests.post(url, json=data)
result = response.json()

if result.get('success'):
    print("✓ Response received!")
    response_text = result['response']
    print(f"\nResponse preview: {response_text[:200]}...\n")
    
    # Check if it's from Gemini
    if "Gemini" in response_text:
        print("✓ Response came from Gemini!")
    
    # Wait a moment for file to be written
    time.sleep(1)
    
    # Check learned responses
    try:
        with open('learned_responses.json', 'r') as f:
            learned = json.load(f)
            print(f"\n✓ Learned responses count: {len(learned)}")
            if learned:
                print("\nLearned responses:")
                for key, value in list(learned.items())[:3]:
                    print(f"  Q: {value['question'][:80]}...")
                    print(f"     Used: {value['usage_count']} times")
                    print(f"     Type: {value['disaster_type']}")
                    print()
            else:
                print("✗ No responses learned yet")
    except Exception as e:
        print(f"✗ Error checking learned responses: {e}")
else:
    print(f"✗ Error: {result.get('error')}")
