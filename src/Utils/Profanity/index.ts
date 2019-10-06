import WordList from './source';

const generatePattern = () => {
  const sanitizedWords = WordList.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const pattern = `\\b(${sanitizedWords.join('|')})\\b`;
  return new RegExp(pattern, 'gi');
};

export function containsProfanity(string: string): boolean {
  const match = string.match(generatePattern());
  if (match && match.length > 0) {
    return true;
  }
  return false;
}

export function filterProfanity(string: string) {
  return string.replace(generatePattern(), (match: string): string => Array(match.length).fill('*').join(''));
}
