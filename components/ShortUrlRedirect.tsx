import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { PublicCardPage } from './PublicCardPage';
import type { ExecutiveData } from '../types';

interface ShortUrlRedirectProps {
    shortId: string;
}

export const ShortUrlRedirect: React.FC<ShortUrlRedirectProps> = ({ shortId }) => {
    const [card, setCard] = useState<ExecutiveData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCard = async () => {
            try {
                setLoading(true);
                const response = await apiService.getCardByShortId(shortId);
                
                if (response.error) {
                    setError(response.error);
                } else if (response.data) {
                    setCard(response.data);
                } else {
                    setError('Card not found');
                }
            } catch (error) {
                setError('Failed to load card');
            } finally {
                setLoading(false);
            }
        };

        loadCard();
    }, [shortId]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-dark-bg flex flex-col items-center justify-center p-4 text-center font-sans">
                <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-dark-text-secondary">Loading your card...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-dark-bg flex flex-col items-center justify-center p-4 text-center font-sans">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-dark-text-secondary mt-2">{error}</p>
                <p className="text-dark-text-secondary text-sm mt-1">The short link may be invalid or expired.</p>
            </div>
        );
    }

    if (card) {
        return <PublicCardPage data={card} />;
    }

    return null;
}; 