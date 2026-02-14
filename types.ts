export enum ArcanaType {
  MAJOR = '大阿爾克那',
  MINOR = '小阿爾克那'
}

export enum Suit {
  WANDS = '權杖',
  CUPS = '聖杯',
  SWORDS = '寶劍',
  PENTACLES = '錢幣',
  NONE = '無' // For Major Arcana
}

export interface TarotCardData {
  id: number;
  name: string;
  englishName: string;
  arcana: ArcanaType;
  suit: Suit;
  number?: number | string; 
  keywords: string[];
  image: string; // Add image URL
}

export interface SelectedCard {
  data: TarotCardData;
  isReversed: boolean;
}

export enum GameState {
  INTRO = 'INTRO',
  INPUT = 'INPUT',
  SHUFFLING = 'SHUFFLING',
  SPREAD = 'SPREAD',
  REVEAL = 'REVEAL',
  READING = 'READING'
}

export enum ReadingMode {
  SINGLE = 'single',
  THREE_TRIANGLE = 'three_triangle',
  TWO_PATHS = 'two_paths',
  RELATIONSHIP = 'relationship'
}

export interface ReadingRequest {
  question: string;
  mode: ReadingMode;
  cards: SelectedCard[];
}