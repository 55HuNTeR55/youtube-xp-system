import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../hooks/usePremium';

const Premium: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { isPremium } = usePremium();

  const plans = [
    {
      name: '1 Month Premium',
      xpCost: 1000,
      duration: 30,
      benefits: [
        'Ad-free experience',
        'Download videos',
        'Background playback',
        'HD quality (1080p/720p)',
      ],
    },
    {
      name: '3 Months Premium',
      xpCost: 2500,
      duration: 90,
      benefits: [
        'All 1 Month benefits',
        'Priority support',
        'Custom themes',
        'Early access to features',
      ],
    },
    {
      name: '6 Months Premium',
      xpCost: 4500,
      duration: 180,
      benefits: [
        'All 3 Months benefits',
        'Exclusive content',
        'Offline mode',
        'Family sharing (up to 5 accounts)',
      ],
    },
  ];

  const handlePurchase = async (plan: typeof plans[0]) => {
    if (!user) return;
    if (user.xp < plan.xpCost) {
      alert('Not enough XP!');
      return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    await updateUserProfile({
      xp: user.xp - plan.xpCost,
      subscription: 'premium',
      subscriptionExpiry: expiryDate.toISOString(),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-gray-400 text-lg">
          Get access to exclusive features and enhance your viewing experience
        </p>
      </div>

      {/* User Status */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-gray-400 mb-2">Current Status</h3>
            <p className="text-2xl font-bold">
              {isPremium() ? 'Premium' : 'Free'}
            </p>
          </div>
          <div>
            <h3 className="text-gray-400 mb-2">Available XP</h3>
            <p className="text-2xl font-bold">{user?.xp || 0} XP</p>
          </div>
          <div>
            <h3 className="text-gray-400 mb-2">Expiry Date</h3>
            <p className="text-2xl font-bold">
              {user?.subscriptionExpiry
                ? new Date(user.subscriptionExpiry).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-youtube-red transition-colors"
          >
            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6">
              {plan.xpCost} <span className="text-youtube-red">XP</span>
            </p>
            <ul className="space-y-3 mb-6">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 text-youtube-red mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase(plan)}
              disabled={isPremium() || (user?.xp || 0) < plan.xpCost}
              className={`w-full py-3 rounded-full font-semibold ${
                isPremium() || (user?.xp || 0) < plan.xpCost
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-youtube-red text-white hover:bg-red-700'
              }`}
            >
              {isPremium()
                ? 'Already Premium'
                : (user?.xp || 0) < plan.xpCost
                ? 'Not enough XP'
                : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium; 