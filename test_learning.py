#!/usr/bin/env python3
"""
Test script to verify self-learning is working
"""
import requests
import json

# Test the chatbot with a learning question
url = "http://localhost:5001/chat"
data = {
    "message": "What should I do during an 8.5 magnitude earthquake?",
    "session_id": "test_learning_123"
}

print("Testing chatbot self-learning...")
print(f"Sending question: {data['message']}\n")

response = requests.post(url, json=data)
result = response.json()

if result.get('success'):
    print("✓ Response received successfully!")
    print(f"\nBot Response:\n{result['response']}\n")
    
    # Check if learned_responses.json was updated
    try:
        with open('learned_responses.json', 'r') as f:
            learned = json.load(f)
            print(f"✓ Learned responses file updated!")
            print(f"Total learned responses: {len(learned)}")
            if learned:
                print("\nLearned questions:")
                for key, value in learned.items():
                    print(f"  - {value['question']} (used {value['usage_count']} times)")
    except Exception as e:
        print(f"✗ Error reading learned responses: {e}")
else:
    print(f"✗ Error: {result.get('error')}")
