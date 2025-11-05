/**
 * Pet Model - Represents an interactive coding companion
 */

export enum PetType {
    CAT = 'cat',
    DOG = 'dog',
    DRAGON = 'dragon',
    ROBOT = 'robot',
    UNICORN = 'unicorn'
}

export enum PetMood {
    HAPPY = 'happy',
    EXCITED = 'excited',
    THINKING = 'thinking',
    SLEEPING = 'sleeping',
    CURIOUS = 'curious',
    CELEBRATING = 'celebrating'
}

export interface PetState {
    type: PetType;
    name: string;
    mood: PetMood;
    level: number;
    experience: number;
    lastInteraction: Date;
}

export class Pet {
    private state: PetState;

    constructor(type: PetType = PetType.CAT, name: string = 'CodeBuddy') {
        this.state = {
            type,
            name,
            mood: PetMood.HAPPY,
            level: 1,
            experience: 0,
            lastInteraction: new Date()
        };
    }

    getState(): PetState {
        return { ...this.state };
    }

    setMood(mood: PetMood): void {
        this.state.mood = mood;
        this.state.lastInteraction = new Date();
    }

    interact(): void {
        this.state.experience += 10;
        this.state.lastInteraction = new Date();
        
        // Level up every 100 experience points
        if (this.state.experience >= this.state.level * 100) {
            this.state.level++;
            this.state.experience = 0;
        }
    }

    changeName(name: string): void {
        this.state.name = name;
    }

    changeType(type: PetType): void {
        this.state.type = type;
    }

    getEmoji(): string {
        switch (this.state.type) {
            case PetType.CAT: return '🐱';
            case PetType.DOG: return '🐶';
            case PetType.DRAGON: return '🐉';
            case PetType.ROBOT: return '🤖';
            case PetType.UNICORN: return '🦄';
            default: return '🐱';
        }
    }

    getMoodEmoji(): string {
        switch (this.state.mood) {
            case PetMood.HAPPY: return '😊';
            case PetMood.EXCITED: return '🤩';
            case PetMood.THINKING: return '🤔';
            case PetMood.SLEEPING: return '😴';
            case PetMood.CURIOUS: return '🧐';
            case PetMood.CELEBRATING: return '🎉';
            default: return '😊';
        }
    }

    getGreeting(): string {
        const greetings = [
            `Hi! I'm ${this.state.name}, your coding companion! ${this.getEmoji()}`,
            `Hey there! ${this.state.name} here, ready to help! ${this.getMoodEmoji()}`,
            `Woof! I mean... Hi! Let's code together! ${this.getEmoji()}`,
            `*purrs* Need any help? I'm ${this.state.name}! ${this.getEmoji()}`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
}
