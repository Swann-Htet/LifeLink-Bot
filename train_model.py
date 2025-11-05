"""
Disaster Response Chatbot - Training Script
This script trains a model on disaster response messages
"""

import pandas as pd
import json
import torch
from datasets import Dataset, load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    AutoModelForSeq2SeqLM,
    TrainingArguments,
    Trainer,
    DataCollatorForSeq2Seq,
    T5ForConditionalGeneration,
    T5Tokenizer
)
from sklearn.model_selection import train_test_split
import os

class DisasterChatbotTrainer:
    def __init__(self, model_name="google/flan-t5-base"):
        """
        Initialize the trainer with a pre-trained model
        Args:
            model_name: HuggingFace model identifier
        """
        self.model_name = model_name
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
    def load_disaster_dataset(self, dataset_path="disaster_response_messages"):
        """Load the disaster response dataset"""
        try:
            # Try loading from local directory
            print(f"Loading dataset from {dataset_path}...")
            dataset = load_dataset(dataset_path)
            return dataset
        except Exception as e:
            print(f"Error loading dataset: {e}")
            print("Attempting to load from HuggingFace Hub...")
            dataset = load_dataset("community-datasets/disaster_response_messages")
            return dataset
    
    def load_knowledge_base(self, knowledge_file="disaster_knowledge.json"):
        """Load disaster do's and don'ts knowledge base"""
        with open(knowledge_file, 'r') as f:
            knowledge = json.load(f)
        return knowledge
    
    def create_training_data(self, dataset, knowledge):
        """Create training data combining dataset and knowledge base"""
        training_samples = []
        
        # Process disaster response messages
        if 'train' in dataset:
            df = pd.DataFrame(dataset['train'])
            
            # Create Q&A pairs from the disaster messages
            for idx, row in df.iterrows():
                if idx > 5000:  # Limit for training efficiency
                    break
                    
                message = str(row.get('message', ''))
                if len(message) < 10:
                    continue
                
                # Extract categories if available
                categories = []
                for col in df.columns:
                    if col not in ['message', 'id', 'original', 'genre', 'split']:
                        if row.get(col) == 1:
                            categories.append(col.replace('_', ' '))
                
                # Create instruction-response pairs
                if categories:
                    category_text = ', '.join(categories[:3])
                    input_text = f"A person needs help with: {category_text}. Message: {message[:200]}"
                    output_text = f"This is a {category_text} situation. I understand you need assistance. "
                    
                    # Add relevant advice from knowledge base
                    for cat_key, cat_data in knowledge.items():
                        if any(cat in cat_key for cat in categories):
                            output_text += f"Important do's: {', '.join(cat_data['dos'][:3])}. "
                            output_text += f"Critical don'ts: {', '.join(cat_data['donts'][:3])}."
                            break
                    
                    training_samples.append({
                        'input': input_text,
                        'output': output_text[:512]  # Limit output length
                    })
        
        # Add knowledge base as direct Q&A pairs
        for disaster_type, info in knowledge.items():
            # What to do questions
            training_samples.append({
                'input': f"What should I do during a {disaster_type.replace('_', ' ')}?",
                'output': f"During a {disaster_type.replace('_', ' ')}, here's what you should do: " + "; ".join(info['dos'][:5])
            })
            
            # What not to do questions
            training_samples.append({
                'input': f"What should I avoid during a {disaster_type.replace('_', ' ')}?",
                'output': f"During a {disaster_type.replace('_', ' ')}, avoid these actions: " + "; ".join(info['donts'][:5])
            })
            
            # Safety tips
            training_samples.append({
                'input': f"Give me safety tips for {disaster_type.replace('_', ' ')}",
                'output': f"Safety tips for {disaster_type.replace('_', ' ')}: DO: " + ", ".join(info['dos'][:3]) + ". DON'T: " + ", ".join(info['donts'][:3])
            })
            
            # Help request
            training_samples.append({
                'input': f"I'm experiencing a {disaster_type.replace('_', ' ')}, what should I do?",
                'output': f"Stay calm. For {disaster_type.replace('_', ' ')}: First, " + info['dos'][0] + " " + info['dos'][1] + " Remember: " + info['donts'][0]
            })
        
        print(f"Created {len(training_samples)} training samples")
        return training_samples
    
    def prepare_dataset(self, training_samples):
        """Prepare dataset for training"""
        # Split into train and validation
        train_samples, val_samples = train_test_split(
            training_samples, 
            test_size=0.1, 
            random_state=42
        )
        
        # Create datasets
        train_dataset = Dataset.from_list(train_samples)
        val_dataset = Dataset.from_list(val_samples)
        
        # Tokenize
        def tokenize_function(examples):
            model_inputs = self.tokenizer(
                examples['input'],
                max_length=256,
                truncation=True,
                padding='max_length'
            )
            
            labels = self.tokenizer(
                examples['output'],
                max_length=256,
                truncation=True,
                padding='max_length'
            )
            
            model_inputs['labels'] = labels['input_ids']
            return model_inputs
        
        train_dataset = train_dataset.map(tokenize_function, batched=True)
        val_dataset = val_dataset.map(tokenize_function, batched=True)
        
        return train_dataset, val_dataset
    
    def train(self, train_dataset, val_dataset, output_dir="./disaster_chatbot_model"):
        """Train the model"""
        # Training arguments
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=3,
            per_device_train_batch_size=4,
            per_device_eval_batch_size=4,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir='./logs',
            logging_steps=100,
            eval_strategy="steps",
            eval_steps=500,
            save_steps=1000,
            save_total_limit=2,
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
            greater_is_better=False,
            report_to="none",
            fp16=torch.cuda.is_available(),  # Use mixed precision if GPU available
        )
        
        # Data collator
        data_collator = DataCollatorForSeq2Seq(
            self.tokenizer,
            model=self.model,
            padding=True
        )
        
        # Trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            data_collator=data_collator,
        )
        
        # Train
        print("Starting training...")
        trainer.train()
        
        # Save model
        print(f"Saving model to {output_dir}")
        trainer.save_model(output_dir)
        self.tokenizer.save_pretrained(output_dir)
        
        return trainer
    
    def run_full_training(self):
        """Execute the full training pipeline"""
        print("=" * 50)
        print("DISASTER RESPONSE CHATBOT TRAINING")
        print("=" * 50)
        
        # Load data
        print("\n1. Loading disaster response dataset...")
        dataset = self.load_disaster_dataset()
        
        print("\n2. Loading knowledge base...")
        knowledge = self.load_knowledge_base()
        
        print("\n3. Creating training data...")
        training_samples = self.create_training_data(dataset, knowledge)
        
        print("\n4. Preparing datasets...")
        train_dataset, val_dataset = self.prepare_dataset(training_samples)
        
        print("\n5. Training model...")
        trainer = self.train(train_dataset, val_dataset)
        
        print("\n" + "=" * 50)
        print("TRAINING COMPLETE!")
        print("=" * 50)
        print("\nModel saved to: ./disaster_chatbot_model")
        print("You can now use the chatbot with the trained model.")

if __name__ == "__main__":
    # Initialize and run training
    trainer = DisasterChatbotTrainer(model_name="google/flan-t5-base")
    trainer.run_full_training()
