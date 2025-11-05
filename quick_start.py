"""
Quick Start Script - Sets up and runs the chatbot
"""

import os
import sys
import subprocess

def print_banner():
    print("\n" + "="*70)
    print("🚨 LIFELINK DISASTER RESPONSE CHATBOT - QUICK START")
    print("="*70 + "\n")

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking dependencies...")
    try:
        import torch
        import transformers
        import flask
        print("✓ All dependencies are installed\n")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\n📥 Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Dependencies installed\n")
        return True

def check_dataset():
    """Check if dataset is downloaded"""
    print("📊 Checking dataset...")
    if os.path.exists("disaster_response_messages"):
        print("✓ Dataset found\n")
        return True
    else:
        print("❌ Dataset not found")
        print("⚠️  The dataset should be in: disaster_response_messages/")
        print("⚠️  You may need to re-run the git clone command\n")
        return False

def check_model():
    """Check if model is trained"""
    print("🤖 Checking trained model...")
    if os.path.exists("disaster_chatbot_model"):
        print("✓ Trained model found\n")
        return True
    else:
        print("❌ Trained model not found")
        print("ℹ️  The chatbot will use the base model and knowledge base")
        print("ℹ️  For better responses, train the model with: python train_model.py\n")
        return False

def main():
    print_banner()
    
    # Check all prerequisites
    check_dependencies()
    check_dataset()
    model_trained = check_model()
    
    # Show menu
    print("="*70)
    print("WHAT WOULD YOU LIKE TO DO?")
    print("="*70)
    print("1. Train the AI model (recommended first time, takes 30-60 minutes)")
    print("2. Run chatbot in console (text-based)")
    print("3. Start web interface (recommended)")
    print("4. Exit")
    print("="*70)
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == "1":
        print("\n🎓 Starting training...")
        print("⏳ This will take 30-60 minutes depending on your hardware")
        print("💡 You can stop with Ctrl+C and resume later\n")
        input("Press Enter to continue or Ctrl+C to cancel...")
        subprocess.run([sys.executable, "train_model.py"])
        
    elif choice == "2":
        print("\n💬 Starting console chatbot...")
        print("Type 'quit' to exit, 'emergency' for emergency contacts\n")
        subprocess.run([sys.executable, "chatbot.py"])
        
    elif choice == "3":
        print("\n🌐 Starting web interface...")
        print("📱 Open your browser and go to: http://localhost:5000")
        print("🛑 Press Ctrl+C to stop the server\n")
        subprocess.run([sys.executable, "app.py"])
        
    elif choice == "4":
        print("\n👋 Goodbye! Stay safe!")
        sys.exit(0)
        
    else:
        print("\n❌ Invalid choice. Please run the script again.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Interrupted by user. Stay safe!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Please check the README.md for troubleshooting steps.")
        sys.exit(1)
