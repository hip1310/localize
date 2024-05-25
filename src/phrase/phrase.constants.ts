/**
 * The index name for phrases.
 */
export const PHRASES_INDEX = 'phrases';

/**
 * Represents the structure of a phrase object.
 */
export interface PhraseType {
  id: number; // Unique identifier for the phrase
  phrase: string; // The text of the phrase
  status: 'active' | 'pending' | 'spam' | 'deleted'; // Status of the phrase
  createdAt: Date; // Date and time when the phrase was created
  updatedAt: Date; // Date and time when the phrase was last updated
  translations: Record<string, string>; // Translations of the phrase in different languages
}

/**
 * Array of phrases with their translations.
 */
export const phrases: PhraseType[] = [
  {
    id: 1,
    phrase: 'Hello, world!',
    status: 'active',
    createdAt: new Date('2024-05-23T15:58:35+00:00'),
    updatedAt: new Date('2024-05-23T15:58:35+00:00'),
    translations: {
      fr: 'Bonjour, le monde!',
      es: '¡Hola, mundo!',
    },
  },
  {
    id: 2,
    phrase: 'Goodbye!',
    status: 'active',
    createdAt: new Date('2024-05-24T10:15:00+00:00'),
    updatedAt: new Date('2024-05-24T10:15:00+00:00'),
    translations: {
      fr: 'Au revoir!',
      es: '¡Adiós!',
    },
  },
];
