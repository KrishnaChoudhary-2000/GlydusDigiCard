import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface ShortUrlRedirectProps {
  shortId: string;
}

export const ShortUrlRedirect: React.FC<ShortUrlRedirectProps> = ({ shortId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToCard = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCardByShortId(shortId);
        
        if (response.data) {
          // Redirect to the card with the full data (base64-encoded)
          const cardData = btoa(JSON.stringify(response.data));
          window.location.href = `/?card=${cardData}`;
        } else {
          setError('Card not found or invalid short ID');
        }
      } catch (err) {
        setError('Failed to load card');
        console.error('Error loading card by short ID:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shortId) {
      redirectToCard();
    }
  }, [shortId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-dark-text-primary mb-2">Card Not Found</h1>
          <p className="text-dark-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}; 