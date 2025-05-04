import { useAuth } from '../contexts/AuthContext';

export const usePremium = () => {
  const { user } = useAuth();

  const isPremium = () => {
    if (!user?.subscriptionExpiry) return false;
    return new Date(user.subscriptionExpiry) > new Date();
  };

  const getDaysRemaining = () => {
    if (!user?.subscriptionExpiry) return 0;
    const expiry = new Date(user.subscriptionExpiry);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    isPremium,
    getDaysRemaining,
  };
}; 