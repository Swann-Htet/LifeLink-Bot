"""
Learned Responses Manager
Tool to view, manage, and export learned responses from Gemini
"""

import json
import os
from datetime import datetime
from collections import defaultdict

class LearnedResponsesManager:
    def __init__(self, learned_file='learned_responses.json'):
        self.learned_file = learned_file
        self.responses = self._load_responses()
    
    def _load_responses(self):
        """Load learned responses from file"""
        try:
            if os.path.exists(self.learned_file):
                with open(self.learned_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading responses: {e}")
            return {}
    
    def _save_responses(self):
        """Save responses to file"""
        try:
            with open(self.learned_file, 'w', encoding='utf-8') as f:
                json.dump(self.responses, f, indent=2, ensure_ascii=False)
            print("✓ Saved successfully")
        except Exception as e:
            print(f"Error saving responses: {e}")
    
    def show_statistics(self):
        """Display statistics about learned responses"""
        if not self.responses:
            print("No learned responses yet.")
            return
        
        print("\n" + "="*70)
        print("📊 LEARNED RESPONSES STATISTICS")
        print("="*70)
        
        total = len(self.responses)
        print(f"\n📚 Total Learned Responses: {total}")
        
        # Count by disaster type
        by_type = defaultdict(int)
        total_usage = 0
        
        for key, data in self.responses.items():
            disaster_type = data.get('disaster_type', 'general')
            usage_count = data.get('usage_count', 0)
            by_type[disaster_type] += 1
            total_usage += usage_count
        
        print(f"🔄 Total Reuses: {total_usage} times")
        print(f"📈 Average Reuse: {total_usage/total if total > 0 else 0:.1f} times per response")
        
        print("\n📂 By Disaster Type:")
        for disaster_type, count in sorted(by_type.items(), key=lambda x: x[1], reverse=True):
            print(f"   • {disaster_type.replace('_', ' ').title()}: {count} responses")
        
        # Most used responses
        print("\n🔥 Top 5 Most Used Responses:")
        sorted_responses = sorted(
            self.responses.items(),
            key=lambda x: x[1].get('usage_count', 0),
            reverse=True
        )[:5]
        
        for i, (key, data) in enumerate(sorted_responses, 1):
            question = data.get('question', key)
            usage = data.get('usage_count', 0)
            print(f"   {i}. [{usage} uses] {question[:60]}...")
        
        print("\n" + "="*70 + "\n")
    
    def list_responses(self, disaster_type=None, limit=None):
        """List all learned responses"""
        if not self.responses:
            print("No learned responses yet.")
            return
        
        print("\n" + "="*70)
        print("📚 LEARNED RESPONSES")
        print("="*70 + "\n")
        
        filtered = self.responses.items()
        
        if disaster_type:
            filtered = [(k, v) for k, v in filtered if v.get('disaster_type') == disaster_type]
            print(f"Filtering by disaster type: {disaster_type.replace('_', ' ').title()}\n")
        
        if limit:
            filtered = list(filtered)[:limit]
        
        for i, (key, data) in enumerate(filtered, 1):
            question = data.get('question', key)
            answer = data.get('answer', 'No answer')
            disaster = data.get('disaster_type', 'general')
            usage = data.get('usage_count', 0)
            timestamp = data.get('timestamp', 'Unknown')
            
            # Parse timestamp
            try:
                dt = datetime.fromisoformat(timestamp)
                time_str = dt.strftime('%Y-%m-%d %H:%M')
            except:
                time_str = timestamp
            
            print(f"{'─'*70}")
            print(f"#{i} | 🔖 {disaster.replace('_', ' ').title()} | ⏰ {time_str} | 🔄 Used {usage}x")
            print(f"{'─'*70}")
            print(f"❓ Question: {question}")
            print(f"\n💡 Answer:\n{answer[:300]}{'...' if len(answer) > 300 else ''}")
            print()
        
        print("="*70 + "\n")
    
    def search_responses(self, keyword):
        """Search for responses containing keyword"""
        keyword_lower = keyword.lower()
        results = []
        
        for key, data in self.responses.items():
            question = data.get('question', '').lower()
            answer = data.get('answer', '').lower()
            
            if keyword_lower in question or keyword_lower in answer:
                results.append((key, data))
        
        if not results:
            print(f"No responses found containing '{keyword}'")
            return
        
        print(f"\n🔍 Found {len(results)} responses containing '{keyword}':\n")
        
        for i, (key, data) in enumerate(results, 1):
            question = data.get('question', key)
            usage = data.get('usage_count', 0)
            print(f"{i}. [{usage} uses] {question}")
        
        print()
    
    def delete_response(self, question_key):
        """Delete a learned response"""
        if question_key in self.responses:
            del self.responses[question_key]
            self._save_responses()
            print(f"✓ Deleted response: {question_key[:50]}...")
        else:
            print(f"Response not found: {question_key}")
    
    def export_to_training_data(self, output_file='learned_training_data.json'):
        """Export learned responses to training data format"""
        if not self.responses:
            print("No responses to export.")
            return
        
        training_data = []
        
        for key, data in self.responses.items():
            question = data.get('question', '')
            answer = data.get('answer', '')
            disaster_type = data.get('disaster_type', 'general')
            
            if question and answer:
                training_data.append({
                    'input': f"Disaster emergency: {question}",
                    'output': answer,
                    'disaster_type': disaster_type
                })
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(training_data, f, indent=2, ensure_ascii=False)
            
            print(f"✓ Exported {len(training_data)} responses to {output_file}")
            print(f"  You can use this file to retrain your model with learned data!")
        except Exception as e:
            print(f"Error exporting: {e}")
    
    def clear_all(self, confirm=False):
        """Clear all learned responses"""
        if not confirm:
            print("⚠️  This will delete ALL learned responses!")
            response = input("Type 'YES' to confirm: ")
            if response != 'YES':
                print("Cancelled.")
                return
        
        self.responses = {}
        self._save_responses()
        print("✓ All learned responses cleared.")

def main():
    """Interactive menu"""
    manager = LearnedResponsesManager()
    
    while True:
        print("\n" + "="*70)
        print("🧠 LEARNED RESPONSES MANAGER")
        print("="*70)
        print("\n1. Show Statistics")
        print("2. List All Responses")
        print("3. List by Disaster Type")
        print("4. Search Responses")
        print("5. Export to Training Data")
        print("6. Clear All (Danger!)")
        print("7. Exit")
        print("\n" + "="*70)
        
        choice = input("\nEnter choice (1-7): ").strip()
        
        if choice == '1':
            manager.show_statistics()
        
        elif choice == '2':
            limit = input("Show how many? (Enter for all): ").strip()
            limit = int(limit) if limit else None
            manager.list_responses(limit=limit)
        
        elif choice == '3':
            print("\nDisaster Types:")
            print("  • earthquake")
            print("  • flood")
            print("  • fire")
            print("  • hurricane")
            print("  • tornado")
            print("  • winter_storm")
            print("  • tsunami")
            print("  • wildfire")
            print("  • heat_wave")
            print("  • general_disaster")
            
            disaster_type = input("\nEnter disaster type: ").strip().lower()
            manager.list_responses(disaster_type=disaster_type)
        
        elif choice == '4':
            keyword = input("Enter search keyword: ").strip()
            if keyword:
                manager.search_responses(keyword)
        
        elif choice == '5':
            filename = input("Output filename (default: learned_training_data.json): ").strip()
            filename = filename if filename else 'learned_training_data.json'
            manager.export_to_training_data(filename)
        
        elif choice == '6':
            manager.clear_all()
        
        elif choice == '7':
            print("\nGoodbye! 👋")
            break
        
        else:
            print("Invalid choice. Please enter 1-7.")

if __name__ == '__main__':
    main()
