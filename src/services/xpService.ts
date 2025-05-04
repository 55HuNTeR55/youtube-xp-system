interface XPConfig {
  baseVideoXP: number;
  watchTimeMultiplier: number;
  levelUpThreshold: number;
}

const XP_CONFIG: XPConfig = {
  baseVideoXP: 50,
  watchTimeMultiplier: 0.1,
  levelUpThreshold: 1000,
};

export const calculateVideoXP = (watchTimeInSeconds: number): number => {
  const baseXP = XP_CONFIG.baseVideoXP;
  const watchTimeBonus = Math.floor(watchTimeInSeconds * XP_CONFIG.watchTimeMultiplier);
  return baseXP + watchTimeBonus;
};

export const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / XP_CONFIG.levelUpThreshold) + 1;
};

export const calculateXPForNextLevel = (currentLevel: number): number => {
  return currentLevel * XP_CONFIG.levelUpThreshold;
};

export const calculateLevelProgress = (currentXP: number, currentLevel: number): number => {
  const xpForNextLevel = calculateXPForNextLevel(currentLevel);
  const progress = (currentXP / xpForNextLevel) * 100;
  return Math.min(progress, 100);
};

export const hasLeveledUp = (oldXP: number, newXP: number): boolean => {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);
  return newLevel > oldLevel;
};

export const getLevelUpRewards = (newLevel: number): string[] => {
  const rewards: string[] = [];
  
  if (newLevel >= 5) rewards.push('Custom Profile Badge');
  if (newLevel >= 10) rewards.push('Premium Trial (7 days)');
  if (newLevel >= 20) rewards.push('Custom Profile Theme');
  if (newLevel >= 50) rewards.push('Premium Subscription (1 month)');
  
  return rewards;
}; 