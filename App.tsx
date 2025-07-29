import React, { useState, useEffect } from 'react';
import type { ExecutiveData } from './types';
import { DEFAULT_CARD_DATA, executiveData } from './constants';
import { CardPreview } from './components/Card';
import { EditorPanel } from './components/EditorPanel';
import { Header, Toast, Icons } from './components/AppUI';
import { CreateCardModal, ConfirmDeleteModal, ShareModal, InteractivePreviewModal } from './components/AppModals';
import { PublicCardPage } from './components/PublicCardPage';
import { apiService } from './services/api';
import { ShortUrlRedirect } from './components/ShortUrlRedirect';

// --- CARD MANAGER (SIDEBAR) ---
interface CardManagerProps {
    cards: ExecutiveData[];
    selectedCardId: string | null;
    onSelectCard: (id: string) => void;
    onAddCard: () => void;
    onDeleteCardRequest: (id: string) => void;
}

const CardManager: React.FC<CardManagerProps> = ({ cards, selectedCardId, onSelectCard, onAddCard, onDeleteCardRequest }) => (
    <aside className="w-full md:w-96 bg-dark-surface flex-shrink-0 flex flex-col h-full border-r border-dark-border">
        <div className="p-6 border-b border-dark-border h-24 flex items-center">
            <h2 className="text-2xl font-bold tracking-tight text-dark-text-primary">My Cards</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
            {cards.map(card => (
                <div
                    key={card.id}
                    onClick={() => onSelectCard(card.id)}
                    className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition-all duration-200 group relative ${selectedCardId === card.id ? 'bg-dark-panel' : 'hover:bg-dark-panel/50'}`}
                >
                    <div className={`absolute left-0 top-0 h-full w-1 bg-brand-accent rounded-r-full transition-all duration-300 transform ${selectedCardId === card.id ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-50'}`}></div>
                    <span className={`font-semibold transition-colors pl-2 ${selectedCardId === card.id ? 'text-dark-text-primary' : 'text-dark-text-secondary'}`}>{card.cardName}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCardRequest(card.id);
                        }}
                        className="text-dark-text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Delete ${card.cardName}`}
                    >
                        <Icons.trash />
                    </button>
                </div>
            ))}
        </div>
        <div className="p-4 border-t border-dark-border">
            <button
                onClick={onAddCard}
                className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
            >
                <Icons.add />
                Create New Card
            </button>
        </div>
    </aside>
);


// --- MAIN APP ---

const App: React.FC = () => {
    // --- URL CHECK FOR PUBLIC CARD VIEW ---
    const urlParams = new URLSearchParams(window.location.search);
    const cardDataParam = urlParams.get('card');
    const shortIdParam = urlParams.get('shortId');
    const sharedParam = urlParams.get('shared');
    const cardIdParam = urlParams.get('cardId');

    // Security: Prevent access to admin dashboard from shared links
    const isSharedLink = cardDataParam || shortIdParam || sharedParam;
    
    // If this is a shared link, prevent any navigation to admin dashboard
    if (isSharedLink) {
        // Disable browser back button for shared links
        useEffect(() => {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                // Allow normal navigation but prevent going back to admin
                if (window.history.length > 1) {
                    window.history.pushState(null, '', window.location.href);
                }
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => window.removeEventListener('beforeunload', handleBeforeUnload);
        }, []);

        // Prevent going back to admin dashboard
        useEffect(() => {
            const handlePopState = () => {
                // If user tries to go back, redirect to the shared card
                if (cardDataParam) {
                    window.location.href = `/?card=${cardDataParam}`;
                } else if (shortIdParam) {
                    window.location.href = `/?shortId=${shortIdParam}`;
                } else if (sharedParam && cardIdParam) {
                    window.location.href = `/?shared=true&cardId=${cardIdParam}`;
                }
            };

            window.addEventListener('popstate', handlePopState);
            return () => window.removeEventListener('popstate', handlePopState);
        }, [cardDataParam, shortIdParam, sharedParam, cardIdParam]);

        // For shared cards, load from window.cardData if available
        if (sharedParam && cardIdParam && (window as any).cardData) {
            const cardData = (window as any).cardData;
            return <PublicCardPage data={cardData} />;
        }
    }

    // Handle short URL redirects
    if (shortIdParam) {
        return <ShortUrlRedirect shortId={shortIdParam} />;
    }

    if (cardDataParam) {
        try {
            const decodedString = atob(cardDataParam);
            const parsedData = JSON.parse(decodedString) as ExecutiveData;
            return <PublicCardPage data={parsedData} />;
        } catch (error) {
            console.error("Failed to parse card data from URL", error);
            return (
                <div className="min-h-screen w-full bg-dark-bg flex flex-col items-center justify-center p-4 text-center font-sans">
                    <h1 className="text-2xl font-bold text-red-500">Error</h1>
                    <p className="text-dark-text-secondary mt-2">Could not load the shared card. The link may be invalid.</p>
                </div>
            );
        }
    }

    // --- DASHBOARD STATE ---
    const [cards, setCards] = useState<ExecutiveData[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [cardToDelete, setCardToDelete] = useState<ExecutiveData | null>(null);
    const [activeModal, setActiveModal] = useState<'create' | 'delete' | 'share' | 'preview' | null>(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [unsavedChanges, setUnsavedChanges] = useState<ExecutiveData | null>(null);

    // --- API PERSISTENCE ---
    useEffect(() => {
        const loadCards = async () => {
            try {
                const response = await apiService.getCards();
                if (response.data) {
                    setCards(response.data);
                    setSelectedCardId(response.data[0]?._id || null);
                } else if (response.error) {
                    console.error("Failed to load cards from API:", response.error);
                    // Fallback to default card if API fails
                    setCards([executiveData]);
                    setSelectedCardId(executiveData.id);
                }
            } catch (error) {
                console.error("Failed to load cards from API", error);
                setCards([executiveData]);
                setSelectedCardId(executiveData.id);
            }
        };

        loadCards();
    }, []);

    // --- DERIVED STATE ---
    const selectedCard = cards.find(c => c.id === selectedCardId) || null;

    // --- KEYBOARD SHORTCUTS ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (unsavedChanges) {
                    handleSaveCard();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [unsavedChanges]);

    // --- HANDLERS ---
    const showToast = (message: string) => {
        setToast({ show: true, message });
    };

    const handleCreateCard = async (cardName: string) => {
        try {
            const newCardData = {
                ...DEFAULT_CARD_DATA,
                cardName: cardName,
            };
            
            const response = await apiService.createCard(newCardData);
            if (response.data) {
                setCards([...cards, response.data]);
                setSelectedCardId(response.data._id);
                setActiveModal(null);
                showToast("Card created successfully!");
            } else {
                showToast("Failed to create card: " + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("Error creating card:", error);
            showToast("Failed to create card");
        }
    };

    const handleDeleteRequest = (id: string) => {
        const card = cards.find(c => c.id === id);
        if (card) {
            setCardToDelete(card);
            setActiveModal('delete');
        }
    };
    
    const handleConfirmDelete = async () => {
        if (!cardToDelete) return;
        
        try {
            const cardId = cardToDelete._id || cardToDelete.id;
            const response = await apiService.deleteCard(cardId);
            
            if (response.data || response.message) {
                const newCards = cards.filter(c => (c._id || c.id) !== cardId);
                setCards(newCards);

                if (selectedCardId === cardId) {
                    setSelectedCardId(newCards[0]?._id || newCards[0]?.id || null);
                }
                
                setActiveModal(null);
                setCardToDelete(null);
                showToast("Card deleted successfully!");
            } else {
                showToast("Failed to delete card: " + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            showToast("Failed to delete card");
        }
    };

    const handleUpdateCard = async (updatedCard: ExecutiveData) => {
        // Store changes locally but don't save to database yet
        setUnsavedChanges(updatedCard);
        setCards(cards.map(c => (c._id || c.id) === (updatedCard._id || updatedCard.id) ? updatedCard : c));
    };

    const handleSaveCard = async () => {
        if (!unsavedChanges) return;
        
        try {
            const cardId = unsavedChanges._id || unsavedChanges.id;
            const response = await apiService.updateCard(cardId, unsavedChanges);
            
            if (response.data) {
                setCards(cards.map(c => (c._id || c.id) === cardId ? response.data : c));
                setUnsavedChanges(null);
                showToast("Card saved successfully!");
            } else {
                showToast("Failed to save card: " + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("Error saving card:", error);
            showToast("Failed to save card");
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-dark-bg text-dark-text-primary font-sans">
            <CardManager
                cards={cards}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
                onAddCard={() => setActiveModal('create')}
                onDeleteCardRequest={handleDeleteRequest}
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    onPreviewClick={() => selectedCard && setActiveModal('preview')}
                    onShareClick={() => selectedCard && setActiveModal('share')}
                    onSaveClick={handleSaveCard}
                    hasUnsavedChanges={!!unsavedChanges}
                />
                
                {selectedCard ? (
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8 overflow-y-auto">
                        <EditorPanel card={selectedCard} onUpdate={handleUpdateCard} hasUnsavedChanges={!!unsavedChanges} />
                        <div className="hidden lg:flex justify-center items-start">
                            <div className="sticky top-8">
                                <CardPreview data={selectedCard} onUpdate={handleUpdateCard} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-32 h-32 bg-dark-surface rounded-full flex items-center justify-center mb-8 border-4 border-dark-panel">
                           <Icons.glydus className="opacity-50" />
                        </div>
                        <h2 className="text-3xl font-bold text-dark-text-primary">Welcome to Glydus</h2>
                        <p className="text-dark-text-secondary mt-3 max-w-sm">Your journey to seamless networking starts here. Create a new card to begin.</p>
                    </div>
                )}
            </main>
            
            {/* --- MODALS & TOASTS --- */}
            <CreateCardModal 
                isOpen={activeModal === 'create'}
                onClose={() => setActiveModal(null)}
                onCreate={handleCreateCard}
            />
             <ConfirmDeleteModal
                isOpen={activeModal === 'delete'}
                onClose={() => setActiveModal(null)}
                onConfirm={handleConfirmDelete}
                cardName={cardToDelete?.cardName || ''}
            />
            <ShareModal
                isOpen={activeModal === 'share'}
                onClose={() => setActiveModal(null)}
                card={selectedCard}
                onCopy={() => showToast("Share link copied to clipboard!")}
            />
            <InteractivePreviewModal
                isOpen={activeModal === 'preview'}
                onClose={() => setActiveModal(null)}
                card={selectedCard}
            />
            <Toast 
                message={toast.message}
                show={toast.show}
                onDismiss={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default App;