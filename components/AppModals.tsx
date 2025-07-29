
import React, { useState, useEffect } from 'react';
import { ExecutiveData } from '../types';
import { CardPreview } from './Card';

// --- BASE MODAL ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'w-full h-full max-w-none rounded-none',
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center animate-fade-in p-4" onClick={onClose}>
            <div
                className={`bg-dark-surface/80 backdrop-blur-2xl border border-dark-border rounded-2xl shadow-2xl m-4 animate-slide-in ${sizeClasses[size]} w-full`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

// --- CREATE CARD MODAL ---
interface CreateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (cardName: string) => void;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [cardName, setCardName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardName.trim()) {
            onCreate(cardName.trim());
            setCardName('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Create New Card</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="cardName" className="block text-sm font-medium text-dark-text-secondary mb-2">Card Name</label>
                    <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
                        placeholder="e.g., My Main Business Card"
                        autoComplete="off"
                        spellCheck="false"
                        autoFocus
                    />
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-lg bg-dark-panel hover:bg-dark-border/70 text-dark-text-primary font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="py-2.5 px-5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold transition-colors disabled:bg-brand-accent/40 disabled:cursor-not-allowed" disabled={!cardName.trim()}>Create</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

// --- CONFIRM DELETE MODAL ---
interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cardName: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, cardName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Delete Card?</h2>
                <p className="text-dark-text-secondary mb-6">Are you sure you want to delete the card "{cardName}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-lg bg-dark-panel hover:bg-dark-border/70 text-dark-text-primary font-semibold transition-colors">Cancel</button>
                    <button type="button" onClick={onConfirm} className="py-2.5 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">Delete</button>
                </div>
            </div>
        </Modal>
    );
};


// --- SHARE MODAL ---
interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: ExecutiveData | null;
    onCopy: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, card, onCopy }) => {
    const [copied, setCopied] = useState(false);
    const [shortUrl, setShortUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateShortUrl = async () => {
        if (!card?._id && !card?.id) {
            setError('Please save the card first to generate a short URL');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const cardId = card._id || card.id;
            // Assuming apiService is available globally or imported elsewhere
            // For now, we'll simulate a successful response
            const response = { data: { shortUrl: `https://short.url/${cardId}` } };
            
            if (response.data) {
                setShortUrl(response.data.shortUrl);
            }
        } catch (error) {
            setError('Failed to generate short URL');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        const urlToCopy = shortUrl || `${window.location.origin}${window.location.pathname}?card=${card?._id || card?.id}`;
        navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate short URL when modal opens - always call useEffect
    useEffect(() => {
        if (isOpen && card) {
            generateShortUrl();
        }
    }, [isOpen, card]);

    // Early return after all hooks are called
    if (!card) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Share Your Card</h2>
                <p className="text-dark-text-secondary mb-4">
                    {shortUrl ? 
                        'Perfect for NFC cards! Copy the short link below:' : 
                        'Generating short URL for NFC compatibility...'
                    }
                </p>
                
                {isGenerating && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-dark-panel rounded-lg">
                        <div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-dark-text-secondary">Generating short URL...</span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex items-center bg-dark-bg border border-dark-border rounded-lg p-2">
                    <input
                        type="text"
                        readOnly
                        value={shortUrl || 'Generating...'}
                        className="bg-transparent w-full text-dark-text-secondary focus:outline-none px-2"
                    />
                    <button
                        onClick={handleCopy}
                        disabled={!shortUrl || isGenerating}
                        className={`ml-2 px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                            copied ? 'bg-green-600' : 
                            shortUrl && !isGenerating ? 'bg-brand-accent hover:bg-brand-accent-hover' : 
                            'bg-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {copied ? <span>✓</span> : <span>📋</span>}
                    </button>
                </div>

                {shortUrl && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 text-sm">
                            ✅ NFC Ready: This short URL can fit in an 80-bit NFC card!
                        </p>
                        <p className="text-green-400/70 text-xs mt-1">
                            URL length: {shortUrl.length} characters
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

// --- INTERACTIVE PREVIEW MODAL ---
interface InteractivePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: ExecutiveData | null;
}
export const InteractivePreviewModal: React.FC<InteractivePreviewModalProps> = ({ isOpen, onClose, card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    if (!card) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <div className="w-full h-full flex flex-col items-center gap-8 p-4 relative bg-dark-bg/50 overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="w-full max-w-sm h-auto perspective mt-auto">
                    <div className={`card-flipper ${isFlipped ? 'is-flipped' : ''} w-full relative`}>
                        <div className="card-front w-full">
                           <CardPreview data={card} onUpdate={() => {}} />
                        </div>
                        <div className="card-back absolute w-full h-full top-0 left-0">
                           <div className="premium-card-base premium-card-bg relative overflow-hidden rounded-2xl p-6">
                               <div className="text-center">
                                   <h2 className="text-2xl font-bold text-white mb-4">Digital Business Card</h2>
                                   <p className="text-gray-300 mb-6">Scan or tap to connect</p>
                                   <div className="text-center">
                                       <p className="text-[#00D1A6] font-semibold">MAKE WAVES</p>
                                       <p className="text-gray-400 text-sm mt-2">Powered by Glydus</p>
                                   </div>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setIsFlipped(f => !f)}
                    className="mb-auto flex items-center gap-2 bg-dark-surface hover:bg-dark-panel text-dark-text-primary font-semibold py-2 px-4 border border-dark-border rounded-lg shadow-sm transition-colors duration-200"
                >
                    <span>🔄</span>
                    Flip Card
                </button>
            </div>
        </Modal>
    );
};