// Utility function to calculate matching confidence between lost and found items
export function calculateMatchConfidence(lostItem: any, foundItem: any): number {
  let confidence = 0;

  // Category match (40 points)
  if (lostItem.category === foundItem.category) {
    confidence += 40;
  }

  // Description keyword overlap (40 points)
  const lostWords = lostItem.description.toLowerCase().split(/\s+/);
  const foundWords = foundItem.description.toLowerCase().split(/\s+/);
  
  const commonWords = lostWords.filter((word: string) => 
    foundWords.includes(word) && word.length > 3
  );
  
  const keywordScore = Math.min(40, (commonWords.length / Math.max(lostWords.length, foundWords.length)) * 40);
  confidence += keywordScore;

  // Time proximity (20 points)
  const timeDiff = Math.abs(
    new Date(lostItem.createdAt.toDate()).getTime() - 
    new Date(foundItem.createdAt.toDate()).getTime()
  );
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= 1) {
    confidence += 20;
  } else if (daysDiff <= 3) {
    confidence += 15;
  } else if (daysDiff <= 7) {
    confidence += 10;
  } else if (daysDiff <= 14) {
    confidence += 5;
  }

  return Math.round(confidence);
}
